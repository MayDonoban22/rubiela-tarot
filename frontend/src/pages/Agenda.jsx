import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";

import { agendaSchema } from "../schemas";
import { getServices } from "../services/services";
import { getAvailableHours } from "../services/availability";
import { getToken } from "../utils/token";

// =====================================
// CONFIGURACIÓN
// =====================================

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");

const WOMPI_SANDBOX_ENABLED =
  import.meta.env.VITE_WOMPI_SANDBOX_ENABLED === "true";

const WOMPI_SCRIPT_URL = "https://checkout.wompi.co/widget.js";

// =====================================
// UTILIDADES
// =====================================

const formatUSD = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

const formatCOP = (amount) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getColombiaToday = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return [values.year, values.month, values.day].join("-");
};

const getAuthToken = () => {
  return getToken();
};

const readApiResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || "No fue posible completar la solicitud.",
    );

    error.status = response.status;

    throw error;
  }

  return data;
};

// Las tres experiencias visibles en Consultas.
// Solo un servicio activo devuelto por MongoDB permite continuar a la reserva.
const consultationCatalog = [
  {
    slug: "general",
    name: "Lectura de Tarot General",
    description:
      "Una lectura para explorar tus inquietudes y encontrar orientación.",
    image: "/assets/images/consulta-tarot-general.jpg",
    examplePrice: 50,
  },
  {
    slug: "amor",
    name: "Tarot del Amor y las Relaciones",
    description:
      "Orientación sobre vínculos, comunicación y decisiones del corazón.",
    image: "/assets/images/consulta-tarot-amor.jpg",
    examplePrice: 200,
  },
  {
    slug: "prosperidad",
    name: "Tarot de Prosperidad y Trabajo",
    description: "Un espacio para reflexionar sobre proyectos y oportunidades.",
    image: "/assets/images/consulta-tarot-prosperidad.jpg",
    examplePrice: 200,
  },
];

const normalizeServiceName = (name = "") =>
  String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getServiceCategory = (name) => {
  const normalized = normalizeServiceName(name);
  if (/amor|relacion|pareja|sentimental/.test(normalized)) return "amor";
  if (/prosper|trabajo|laboral|dinero|abundancia/.test(normalized))
    return "prosperidad";
  if (/tarot|general/.test(normalized)) return "general";
  return null;
};

const WHATSAPP_NUMBER = "573209821747";

// =====================================
// CARGAR WIDGET DE WOMPI
// =====================================

const loadWompiWidget = () => {
  return new Promise((resolve, reject) => {
    if (window.WidgetCheckout) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[data-wompi-widget="true"]',
    );

    const script = existingScript || document.createElement("script");

    const handleLoad = () => {
      if (window.WidgetCheckout) {
        resolve();
      } else {
        reject(new Error("El Widget de Wompi no está disponible."));
      }
    };

    const handleError = () => {
      reject(new Error("No se pudo cargar el servicio de Wompi."));
    };

    script.addEventListener("load", handleLoad, { once: true });

    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = WOMPI_SCRIPT_URL;
      script.async = true;
      script.dataset.wompiWidget = "true";

      document.head.appendChild(script);
    }
  });
};

// =====================================
// COMPONENTE AGENDA
// =====================================

function Agenda() {
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState([]);

  const [loading, setLoading] = useState(true);
  const [hoursLoading, setHoursLoading] = useState(false);

  const [apiError, setApiError] = useState(null);
  const [message, setMessage] = useState("");

  const [preparingPayment, setPreparingPayment] = useState(false);

  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const [payment, setPayment] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(agendaSchema),
    defaultValues: {
      service: "",
      serviceName: "",
      date: "",
      hour: "",
      name: "",
    },
  });

  const selectedService = watch("service");
  const selectedDate = watch("date");
  const selectedHour = watch("hour");
  const customerName = watch("name");

  const today = getColombiaToday();

  const selectionLocked =
    Boolean(payment) ||
    preparingPayment ||
    verifyingPayment ||
    paymentConfirmed;

  // =====================================
  // CARGAR SERVICIOS
  // =====================================

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        const data = await getServices();

        if (!cancelled) {
          setServices(data.filter((service) => service.activo));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error cargando servicios:", error);

          setApiError("No se pudieron cargar los servicios.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================
  // CARGAR HORARIOS DISPONIBLES
  // =====================================

  useEffect(() => {
    if (selectionLocked) {
      return;
    }

    setValue("hour", "");
    setHours([]);

    if (!selectedDate) {
      return;
    }

    let cancelled = false;

    const loadHours = async () => {
      try {
        setHoursLoading(true);
        setApiError(null);

        const data = await getAvailableHours(selectedDate);

        if (cancelled) {
          return;
        }

        if (!Array.isArray(data)) {
          throw new Error("Formato de horarios inválido.");
        }

        setHours(data);

        if (data.length === 0) {
          setApiError(
            "No hay horarios disponibles para la fecha seleccionada.",
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error cargando horarios:", error);

          setApiError("No se pudieron cargar los horarios.");
        }
      } finally {
        if (!cancelled) {
          setHoursLoading(false);
        }
      }
    };

    loadHours();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, setValue, selectionLocked]);

  const serviceDetails = services.find(
    (service) => service._id === selectedService,
  );

  // Catálogo visual sincronizado con los servicios reales activos.
  const matchedServiceIds = new Set();
  const displayServices = consultationCatalog.map((item) => {
    const match = services.find((service) => {
      if (matchedServiceIds.has(service._id)) return false;
      return getServiceCategory(service.nombre) === item.slug;
    });
    if (match) matchedServiceIds.add(match._id);
    return { ...item, backend: match || null };
  });

  // Evitamos ocultar otros servicios activos agregados por el administrador.
  services.forEach((service) => {
    if (!matchedServiceIds.has(service._id)) {
      displayServices.push({
        slug: `extra-${service._id}`,
        name: service.nombre,
        description: service.descripcion,
        image: "/assets/images/consulta-tarot-general.jpg",
        backend: service,
        examplePrice: undefined,
      });
    }
  });

  // =====================================
  // PREPARAR RESERVA Y CHECKOUT
  // =====================================

  const preparePayment = async (formData) => {
    if (!WOMPI_SANDBOX_ENABLED || preparingPayment || payment) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setApiError("Debes iniciar sesión antes de reservar.");
      return;
    }

    setPreparingPayment(true);
    setApiError(null);
    setMessage("");

    try {
      // Comprobar el Widget antes de
      // crear una reserva pendiente.
      await loadWompiWidget();

      // 1. Crear reserva en el backend.
      const bookingResponse = await fetch(`${API_URL}/turnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          servicio: formData.service,
          fecha: formData.date,
          hora: formData.hour,
        }),
      });

      const bookingData = await readApiResponse(bookingResponse);

      const turnoId = bookingData.turno?._id;

      if (!turnoId) {
        throw new Error("No recibimos el identificador de la reserva.");
      }

      // 2. Preparar Checkout con Wompi.
      const paymentResponse = await fetch(
        `${API_URL}/payments/create-session/${turnoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const paymentData = await readApiResponse(paymentResponse);

      if (
        paymentData.provider !== "WOMPI" ||
        paymentData.environment !== "sandbox" ||
        paymentData.checkout?.currency !== "COP" ||
        !paymentData.checkout?.reference ||
        !paymentData.checkout?.publicKey ||
        !paymentData.checkout?.signature?.integrity ||
        !Number.isSafeInteger(paymentData.checkout?.amountInCents)
      ) {
        throw new Error("Los datos del Checkout son inválidos.");
      }

      setPayment({
        ...paymentData,
        customerName: formData.name,
      });

      setMessage(
        "Tu reserva está pendiente. Revisa el importe en COP antes de continuar al pago de prueba.",
      );
    } catch (error) {
      console.error("Error preparando reserva:", error);

      setApiError(error.message);
    } finally {
      setPreparingPayment(false);
    }
  };

  // =====================================
  // RECUPERAR TRANSACCIÓN CON WOMPI
  // =====================================

  const recoverTransaction = async (turnoId, transactionId) => {
    const token = getAuthToken();

    if (!token) {
      setApiError(
        "Tu sesión ha terminado. Inicia sesión para consultar el pago.",
      );
      return;
    }

    setVerifyingPayment(true);
    setApiError(null);
    setMessage("Verificando el pago con Wompi...");

    try {
      const response = await fetch(`${API_URL}/payments/recover/${turnoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId,
        }),
      });

      const result = await readApiResponse(response);

      if (result.paymentStatus === "PAID") {
        setPaymentConfirmed(true);

        setMessage("Tu pago fue verificado y tu reserva quedó confirmada.");

        return;
      }

      if (result.transactionStatus) {
        setMessage(
          `Estado de Wompi: ${result.transactionStatus}. ${result.message}`,
        );
      } else {
        setMessage(result.message || "Tu transacción sigue en verificación.");
      }
    } catch (error) {
      console.error("Error verificando pago:", error);

      setApiError(
        "No pudimos verificar el resultado todavía. No realices otro pago; consulta el estado de tu reserva.",
      );
    } finally {
      setVerifyingPayment(false);
    }
  };

  // =====================================
  // ABRIR WIDGET
  // =====================================

  const openWompiCheckout = () => {
    if (
      !payment ||
      paymentConfirmed ||
      verifyingPayment ||
      !WOMPI_SANDBOX_ENABLED
    ) {
      return;
    }

    const { checkout, turnoId, customerName: fullName } = payment;

    if (
      !checkout ||
      !window.WidgetCheckout ||
      new Date(checkout.expirationTime).getTime() <= Date.now()
    ) {
      setApiError(
        "El Checkout no está disponible o su plazo venció. Consulta tu reserva antes de intentar otro pago.",
      );

      return;
    }

    try {
      const widget = new window.WidgetCheckout({
        currency: checkout.currency,

        amountInCents: checkout.amountInCents,

        reference: checkout.reference,

        publicKey: checkout.publicKey,

        expirationTime: checkout.expirationTime,

        signature: {
          integrity: checkout.signature.integrity,
        },

        customerData: {
          fullName,
        },
      });

      widget.open((result) => {
        const transactionId = result?.transaction?.id;

        if (!transactionId) {
          setMessage(
            "El Checkout se cerró sin devolver una transacción. Si realizaste un pago, espera su verificación antes de intentar nuevamente.",
          );

          return;
        }

        // El resultado del Widget no confirma
        // ningún pago por sí mismo.
        // Nuestro backend consulta a Wompi.
        recoverTransaction(turnoId, transactionId);
      });
    } catch (error) {
      console.error("Error abriendo Wompi:", error);

      setApiError("No fue posible abrir el Checkout de Wompi.");
    }
  };

  // =====================================
  // DISEÑO RESPONSIVE
  // =====================================

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F8F6F0] font-inter">
      {/* HERO: la misma identidad editorial de Consultas y Sobre mí. */}
      <section
        aria-labelledby="agenda-heading"
        className="relative isolate flex min-h-[350px] items-center overflow-hidden bg-[#101827] text-[#F8F6F0] sm:min-h-[390px] lg:min-h-[430px]"
      >
        <picture aria-hidden="true" className="absolute inset-0 h-full w-full">
          <source
            media="(max-width: 639px)"
            srcSet="/assets/images/consultas-banner-mobile.jpg"
          />
          <img
            src="/assets/images/consultas-banner-desktop.jpg"
            alt=""
            className="h-full w-full object-cover object-[72%_center] sm:object-center"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,15,30,0.95)_0%,rgba(10,20,39,0.86)_42%,rgba(11,24,45,0.25)_100%)] max-sm:bg-[linear-gradient(180deg,rgba(8,16,32,0.94),rgba(8,16,32,0.75))]"
        />
        <div className="ldr-container relative z-10 w-full py-16 sm:py-20">
          <div className="ldr-animate-enter max-w-[650px]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BB9B49]/45 bg-[#101827]/50 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#E8D8B5] backdrop-blur-sm sm:text-xs">
              <FaStar size={10} aria-hidden="true" className="text-[#D6B967]" />
              Luz de Rubí · Agenda
            </p>
            <h1
              id="agenda-heading"
              className="font-Abhaya text-[clamp(2.65rem,4.7vw,4rem)] font-medium leading-[1.03] tracking-[-0.025em]"
            >
              Reserva tu <span className="italic text-[#E2BE66]">momento.</span>
            </h1>
            <div
              aria-hidden="true"
              className="mt-6 h-px w-16 bg-gradient-to-r from-[#D6B967] to-transparent"
            />
            <p className="mt-5 max-w-[535px] text-[14px] leading-[1.85] text-white/85 sm:text-[15px]">
              Explora nuestras experiencias, elige una fecha y encuentra el
              espacio para tu consulta.
            </p>
          </div>
        </div>
      </section>

      {/* APERTURA */}
      <section className="bg-[linear-gradient(180deg,#EDE5D8_0%,#F8F6F0_100%)] px-4 pb-10 pt-14 text-center sm:pt-16">
        <div className="ldr-animate-enter mx-auto max-w-[770px]">
          <span className="ldr-eyebrow">Un encuentro contigo</span>
          <h2 className="mt-4 font-Abhaya text-[clamp(2.2rem,4.8vw,3.6rem)] font-medium leading-[1.1] text-[#192846]">
            Un espacio para{" "}
            <span className="italic text-[#94783F]">conectar.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[14px] leading-[1.85] text-[#6F7480] sm:text-[15px]">
            Descubre las consultas y organiza tu encuentro a tu ritmo.
          </p>
        </div>
      </section>

      <section className="bg-[#F8F6F0] pb-20 pt-3 sm:pb-24">
        <div className="ldr-container">
          {apiError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-[#CF8A8A]/50 bg-[#FFF4F2] px-5 py-4 text-[14px] text-[#983E42]"
            >
              {apiError}
            </div>
          )}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 rounded-xl border border-[#BB9B49]/40 bg-white px-5 py-4 text-[14px] text-[#34415A]"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(preparePayment)} noValidate>
            {/* PASO 1: CATÁLOGO */}
            <div className="mb-10 sm:mb-12">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94783F]">
                    Paso 01
                  </span>
                  <h2 className="mt-2 font-Abhaya text-[clamp(2rem,3.6vw,2.8rem)] leading-tight text-[#192846]">
                    Elige tu consulta
                  </h2>
                </div>
                <p className="max-w-[420px] text-[12px] leading-[1.7] text-[#6F7480]">
                  Los servicios registrados en nuestro sistema podrán
                  seleccionarse para reservar.
                </p>
              </div>

              {loading ? (
                <div
                  role="status"
                  className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                >
                  {[1, 2, 3].map((id) => (
                    <div
                      key={id}
                      className="h-[390px] animate-pulse rounded-[24px] bg-[#EBE6DC]"
                    />
                  ))}
                  <span className="sr-only">Cargando servicios...</span>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {displayServices.map((item) => {
                    const service = item.backend;
                    const selected = Boolean(
                      service && selectedService === service._id,
                    );
                    return (
                      <article
                        key={item.slug}
                        className={`group flex min-w-0 flex-col overflow-hidden rounded-[24px] border bg-white shadow-[0_14px_40px_rgba(17,24,39,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(17,24,39,0.11)] ${selected ? "border-[#BB9B49] ring-1 ring-[#BB9B49]" : "border-[#BB9B49]/25"}`}
                      >
                        <div className="relative h-[185px] overflow-hidden bg-[#192846] sm:h-[205px]">
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/60 via-transparent to-transparent" />
                          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#101827]/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-white backdrop-blur-sm">
                            {service
                              ? "Disponible en Agenda"
                              : "Consulta personalizada"}
                          </span>
                          {selected && (
                            <FaCheckCircle
                              className="absolute bottom-4 right-4 text-[#F5D78C]"
                              size={23}
                              aria-label="Seleccionado"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6 sm:p-7">
                          <h3 className="font-Abhaya text-[27px] font-semibold leading-[1.1] text-[#192846]">
                            {service?.nombre || item.name}
                          </h3>
                          <p className="mt-3 flex-1 text-[13px] leading-[1.8] text-[#6F7480] sm:text-[14px]">
                            {service?.descripcion || item.description}
                          </p>
                          <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-[#BB9B49]/20 pt-4 text-[12px]">
                            <span className="inline-flex items-center gap-2 text-[#706B61]">
                              <FaClock aria-hidden="true" />
                              {service?.duracion
                                ? `${service.duracion} min`
                                : "A convenir"}
                            </span>
                            <span className="font-semibold text-[#927337]">
                              {service
                                ? formatUSD(service.precio)
                                : item.examplePrice
                                  ? `US $${item.examplePrice}*`
                                  : "A consultar"}
                            </span>
                          </div>
                          {service ? (
                            <button
                              type="button"
                              disabled={selectionLocked}
                              aria-pressed={selected}
                              onClick={() => {
                                setValue("service", service._id, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                setValue("serviceName", service.nombre, {
                                  shouldValidate: true,
                                });
                                setApiError(null);
                              }}
                              className={`mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BB9B49] disabled:cursor-not-allowed disabled:opacity-60 ${selected ? "border-[#BB9B49] bg-[#192846] text-white" : "border-[#BB9B49]/45 bg-[#F8F6F0] text-[#192846] hover:bg-[#EDE5D8]"}`}
                            >
                              {selected
                                ? "Consulta seleccionada"
                                : "Seleccionar consulta"}
                              {selected ? (
                                <FaCheckCircle aria-hidden="true" />
                              ) : (
                                <FaArrowRight aria-hidden="true" size={12} />
                              )}
                            </button>
                          ) : (
                            <a
                              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, quisiera información sobre ${item.name}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#BB9B49]/45 bg-[#F8F6F0] px-4 text-[13px] font-semibold text-[#192846] transition hover:bg-[#EDE5D8]"
                            >
                              <FaWhatsapp aria-hidden="true" size={15} />{" "}
                              Consultar disponibilidad
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {errors.service && (
                <p role="alert" className="mt-3 text-[12px] text-[#A13F3F]">
                  {errors.service.message}
                </p>
              )}
              <p className="mt-5 text-center text-[11px] leading-[1.7] text-[#777C87]">
                * Los importes de Amor y Relaciones y Prosperidad y Trabajo son
                ilustrativos cuando aún no existen como servicios activos en
                MongoDB.
              </p>
            </div>

            {/* PASO 2: FECHA, HORA Y DATOS */}
            <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,1.38fr)_minmax(300px,0.82fr)]">
              <div className="min-w-0 space-y-6">
                <div className="rounded-[26px] border border-[#BB9B49]/25 bg-white p-6 shadow-[0_14px_42px_rgba(17,24,39,0.05)] sm:p-8">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94783F]">
                    Paso 02
                  </span>
                  <h2 className="mt-2 font-Abhaya text-[clamp(1.9rem,3.3vw,2.6rem)] leading-tight text-[#192846]">
                    Fecha y horario
                  </h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="agenda-date"
                        className="flex items-center gap-2 text-[13px] font-semibold text-[#34415A]"
                      >
                        <FaCalendarAlt
                          className="text-[#94783F]"
                          aria-hidden="true"
                        />{" "}
                        Selecciona una fecha
                      </label>
                      <input
                        id="agenda-date"
                        type="date"
                        min={today}
                        disabled={selectionLocked || loading}
                        {...register("date")}
                        className="mt-3 block min-h-12 w-full rounded-xl border border-[#D8C8AA] bg-[#FFFEFA] px-3 text-[14px] text-[#192846] outline-none focus:border-[#BB9B49] focus:ring-2 focus:ring-[#BB9B49]/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      {errors.date && (
                        <p
                          role="alert"
                          className="mt-2 text-[12px] text-[#A13F3F]"
                        >
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#34415A]">
                        <FaClock
                          className="text-[#94783F]"
                          aria-hidden="true"
                        />{" "}
                        Horarios disponibles
                      </div>
                      {!selectedDate ? (
                        <p className="mt-3 text-[13px] leading-[1.8] text-[#777C87]">
                          Primero elige una fecha para consultar los horarios.
                        </p>
                      ) : hoursLoading ? (
                        <p
                          role="status"
                          className="mt-3 text-[13px] text-[#777C87]"
                        >
                          Consultando disponibilidad...
                        </p>
                      ) : hours.length === 0 ? (
                        <p className="mt-3 text-[13px] leading-[1.8] text-[#777C87]">
                          No hay horarios para la fecha seleccionada.
                        </p>
                      ) : (
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
                          {hours.map((hour) => (
                            <button
                              key={hour}
                              type="button"
                              disabled={selectionLocked}
                              aria-pressed={selectedHour === hour}
                              onClick={() =>
                                setValue("hour", hour, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                              }
                              className={`min-h-11 rounded-xl border px-2 text-[13px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BB9B49] disabled:opacity-60 ${selectedHour === hour ? "border-[#BB9B49] bg-[#192846] text-white" : "border-[#D8C8AA] bg-[#FFFEFA] text-[#34415A] hover:bg-[#F5EFE2]"}`}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      )}
                      {errors.hour && (
                        <p
                          role="alert"
                          className="mt-2 text-[12px] text-[#A13F3F]"
                        >
                          {errors.hour.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-[#BB9B49]/25 bg-white p-6 shadow-[0_14px_42px_rgba(17,24,39,0.05)] sm:p-8">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94783F]">
                    Paso 03
                  </span>
                  <h2 className="mt-2 font-Abhaya text-[clamp(1.9rem,3.3vw,2.6rem)] leading-tight text-[#192846]">
                    Tus datos
                  </h2>
                  <label
                    className="mt-5 block text-[13px] font-semibold text-[#34415A]"
                    htmlFor="agenda-name"
                  >
                    Nombre para la consulta
                  </label>
                  <input
                    id="agenda-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Escribe tu nombre completo"
                    disabled={selectionLocked || loading}
                    {...register("name")}
                    className="mt-2 block min-h-12 w-full rounded-xl border border-[#D8C8AA] bg-[#FFFEFA] px-4 text-[14px] text-[#192846] outline-none focus:border-[#BB9B49] focus:ring-2 focus:ring-[#BB9B49]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-2 text-[12px] text-[#A13F3F]">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* RESUMEN ADAPTATIVO */}
              <aside className="min-w-0 rounded-[26px] border border-[#BB9B49]/25 bg-[linear-gradient(145deg,#17253D,#263D65)] p-6 text-[#F8F6F0] shadow-[0_16px_48px_rgba(17,24,39,0.1)] sm:p-8 lg:sticky lg:top-24">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D6B967]">
                  Tu selección
                </span>
                <h2 className="mt-3 font-Abhaya text-[clamp(1.9rem,3vw,2.6rem)] leading-tight">
                  Resumen de tu cita
                </h2>
                <div className="mt-6 space-y-4 text-[13px] leading-[1.7]">
                  <div className="border-b border-white/15 pb-3">
                    <span className="block text-white/60">Consulta</span>
                    <strong className="mt-1 block font-medium text-white">
                      {serviceDetails?.nombre || "Aún no seleccionada"}
                    </strong>
                  </div>
                  <div className="border-b border-white/15 pb-3">
                    <span className="block text-white/60">Fecha</span>
                    <strong className="mt-1 block font-medium text-white">
                      {selectedDate || "Por elegir"}
                    </strong>
                  </div>
                  <div className="border-b border-white/15 pb-3">
                    <span className="block text-white/60">Hora</span>
                    <strong className="mt-1 block font-medium text-white">
                      {selectedHour || "Por elegir"}
                    </strong>
                  </div>
                  <div className="border-b border-white/15 pb-3">
                    <span className="block text-white/60">Duración</span>
                    <strong className="mt-1 block font-medium text-white">
                      {serviceDetails?.duracion
                        ? `${serviceDetails.duracion} minutos`
                        : "Por definir"}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-white/60">
                      Precio de referencia
                    </span>
                    <strong className="mt-1 block font-Abhaya text-[29px] font-semibold text-[#E2BE66]">
                      {serviceDetails ? formatUSD(serviceDetails.precio) : "—"}
                    </strong>
                  </div>
                </div>
                <p className="mt-3 text-[11px] leading-[1.7] text-white/65">
                  El importe definitivo para Wompi se calculará en COP desde el
                  servidor.
                </p>
                {!payment && (
                  <button
                    type="submit"
                    disabled={
                      !WOMPI_SANDBOX_ENABLED ||
                      loading ||
                      preparingPayment ||
                      !selectedService ||
                      !selectedDate ||
                      !selectedHour ||
                      !customerName?.trim()
                    }
                    className="ldr-button ldr-button--gold mt-7 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {preparingPayment
                      ? "Preparando reserva..."
                      : WOMPI_SANDBOX_ENABLED
                        ? "Continuar a pago de prueba"
                        : "Pagos en preparación"}
                    {!preparingPayment && (
                      <FaArrowRight aria-hidden="true" size={12} />
                    )}
                  </button>
                )}
                {!WOMPI_SANDBOX_ENABLED && (
                  <p className="mt-4 text-center text-[12px] leading-[1.7] text-white/75">
                    Estamos preparando los pagos seguros. Por ahora no se crean
                    reservas ni se realizan cobros desde Agenda.
                  </p>
                )}
              </aside>
            </div>
          </form>

          {/* Flujo de Wompi Sandbox preservado. */}
          {payment && !paymentConfirmed && (
            <div className="mt-8 rounded-[26px] border border-[#BB9B49]/35 bg-white p-6 shadow-[0_14px_42px_rgba(17,24,39,0.05)] sm:p-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94783F]">
                Pago de prueba · Wompi Sandbox
              </span>
              <h2 className="mt-3 font-Abhaya text-[clamp(2rem,3.5vw,2.8rem)] text-[#192846]">
                Revisa el importe de tu pago
              </h2>
              <div className="mt-5 space-y-3 text-[14px] text-[#34415A]">
                <p>
                  <strong>Precio original:</strong>{" "}
                  {formatUSD(payment.pricing.originalAmount)}
                </p>
                <p>
                  <strong>Tipo de cambio de prueba:</strong> 1 USD ={" "}
                  {formatCOP(payment.pricing.exchangeRate)}
                </p>
                <p className="font-semibold text-[#192846]">
                  Total del cobro:{" "}
                  {formatCOP(payment.checkout.amountInCents / 100)}
                </p>
                <p className="text-[12px] leading-[1.7] text-[#6F7480]">
                  Importe calculado por nuestro servidor con una tasa fija
                  exclusivamente para Sandbox. La reserva permanece pendiente
                  hasta la verificación del pago.
                </p>
              </div>
              <button
                type="button"
                onClick={openWompiCheckout}
                disabled={verifyingPayment}
                className="ldr-button ldr-button--gold mt-6 flex w-full items-center justify-center disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {verifyingPayment
                  ? "Verificando transacción..."
                  : "Abrir Wompi Sandbox"}
              </button>
            </div>
          )}

          {paymentConfirmed && (
            <div
              role="status"
              className="mt-8 rounded-[26px] border border-[#BB9B49]/50 bg-white p-8 text-center shadow-[0_14px_42px_rgba(17,24,39,0.05)]"
            >
              <FaCheckCircle
                aria-hidden="true"
                className="mx-auto text-[#94783F]"
                size={34}
              />
              <h2 className="mt-3 font-Abhaya text-[clamp(2rem,4vw,3rem)] text-[#192846]">
                Reserva confirmada
              </h2>
              <p className="mx-auto mt-3 max-w-[580px] text-[14px] leading-[1.8] text-[#6F7480]">
                El backend verificó el pago con Wompi y confirmó tu consulta.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Agenda;

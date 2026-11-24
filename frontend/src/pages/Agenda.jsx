import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

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
  // RENDER
  // =====================================

  if (loading) {
    return <div className="text-center mt-20">Cargando servicios...</div>;
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[65px] pt-[57px] pb-16">
      <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] text-center mb-8">
        Agenda tu Consulta
      </h1>

      {apiError && (
        <p role="alert" className="text-red-600 text-center mb-4">
          {apiError}
        </p>
      )}

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="text-[#3D578D] text-center mb-4 font-medium"
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit(preparePayment)} className="space-y-8">
        {/* SERVICIOS */}
        <div className="max-w-[1000px] mx-auto mb-12">
          <h2 className="text-[24px] font-Abhaya text-[#9E874D] mb-6">
            Selecciona tu Servicio
          </h2>

          {services.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay servicios disponibles actualmente.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <button
                  key={service._id}
                  type="button"
                  disabled={selectionLocked}
                  aria-pressed={selectedService === service._id}
                  onClick={() => {
                    setValue("service", service._id, { shouldValidate: true });

                    setValue("serviceName", service.nombre);

                    setApiError(null);
                  }}
                  className={`w-full sm:w-[280px] min-h-[160px] rounded-xl p-5 border transition text-left disabled:cursor-not-allowed ${
                    selectedService === service._id
                      ? "border-[#BB9B49] bg-[#3D578D] ring-2 ring-[#BB9B49]"
                      : "border-[#6C82B5] bg-[#526B9F] hover:bg-[#3D578D]"
                  }`}
                >
                  <h3 className="text-[22px] font-Abhaya text-[#F5D78C] mb-2">
                    {service.nombre}
                  </h3>

                  <p className="text-white/90 text-sm mb-3">
                    {service.descripcion}
                  </p>

                  <p className="text-white">
                    Duración: {service.duracion} minutos
                  </p>

                  <p className="text-[#F5D78C] mt-2 font-semibold">
                    Precio: {formatUSD(service.precio)}
                  </p>
                </button>
              ))}
            </div>
          )}

          {errors.service && (
            <p className="text-red-600 mt-2">{errors.service.message}</p>
          )}
        </div>

        {/* FECHA Y HORA */}
        <div className="max-w-[1000px] mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaCalendarAlt />
              <h2 className="font-semibold">Fecha</h2>
            </div>

            <input
              type="date"
              min={today}
              disabled={selectionLocked}
              {...register("date")}
              className="w-full h-11 border rounded-lg px-3 disabled:bg-gray-100"
            />

            {errors.date && (
              <p className="text-red-600 mt-2">{errors.date.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaClock />
              <h2 className="font-semibold">Hora</h2>
            </div>

            {!selectedDate ? (
              <p className="text-gray-500">
                Selecciona una fecha para consultar los horarios.
              </p>
            ) : hoursLoading ? (
              <p className="text-gray-500">Cargando horarios...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    disabled={selectionLocked}
                    aria-pressed={selectedHour === hour}
                    onClick={() => {
                      setValue("hour", hour, { shouldValidate: true });
                    }}
                    className={`min-h-10 border rounded-lg px-2 transition disabled:cursor-not-allowed ${
                      selectedHour === hour
                        ? "bg-[#BB9B49] text-[#111827] border-[#BB9B49]"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            )}

            {errors.hour && (
              <p className="text-red-600 mt-2">{errors.hour.message}</p>
            )}
          </div>
        </div>

        {/* RESUMEN */}
        {serviceDetails && selectedDate && selectedHour && (
          <div className="max-w-[1000px] mx-auto bg-[#F7F5EB] border border-[#BB9B49] rounded-xl p-6 mb-8">
            <h2 className="text-[24px] font-Abhaya mb-4">Resumen de tu cita</h2>

            <div className="space-y-2">
              <p>
                <strong>Servicio: </strong>
                {serviceDetails.nombre}
              </p>

              <p>
                <strong>Fecha: </strong>
                {selectedDate}
              </p>

              <p>
                <strong>Hora: </strong>
                {selectedHour}
              </p>

              <p>
                <strong>Duración: </strong>
                {serviceDetails.duracion} minutos
              </p>

              <p>
                <strong>Precio de referencia: </strong>
                {formatUSD(serviceDetails.precio)}
              </p>

              <p className="text-sm text-gray-600">
                El cobro se realizará en pesos colombianos (COP).
              </p>
            </div>
          </div>
        )}

        {/* DATOS DEL CLIENTE */}
        <div className="max-w-[1000px] mx-auto space-y-4">
          <label className="block font-semibold" htmlFor="agenda-name">
            Nombre para la consulta
          </label>

          <input
            id="agenda-name"
            placeholder="Tu nombre completo"
            disabled={selectionLocked}
            {...register("name")}
            className="w-full h-11 border rounded-lg px-3 disabled:bg-gray-100"
          />

          {errors.name && <p className="text-red-600">{errors.name.message}</p>}

          {!payment && (
            <button
              type="submit"
              disabled={
                !WOMPI_SANDBOX_ENABLED ||
                preparingPayment ||
                !selectedService ||
                !selectedDate ||
                !selectedHour ||
                !customerName?.trim()
              }
              className="w-full h-12 rounded-lg bg-[#BB9B49] text-[#111827] font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {preparingPayment
                ? "Preparando reserva..."
                : WOMPI_SANDBOX_ENABLED
                  ? "Continuar al pago de prueba"
                  : "Pago próximamente con Wompi"}
            </button>
          )}

          {!WOMPI_SANDBOX_ENABLED && (
            <p className="text-center text-sm text-gray-500">
              Estamos preparando los pagos seguros de Luz de Rubí. Por ahora no
              se realizarán cobros ni nuevas reservas desde este formulario.
            </p>
          )}
        </div>
      </form>

      {/* CONFIRMACIÓN DEL IMPORTE */}
      {payment && !paymentConfirmed && (
        <div className="max-w-[1000px] mx-auto mt-8 border border-[#BB9B49] bg-[#F7F5EB] rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-Abhaya">Revisa el importe de tu pago</h2>

          <p>
            <strong>Precio original: </strong>
            {formatUSD(payment.pricing.originalAmount)}
          </p>

          <p>
            <strong>Tipo de cambio de prueba: </strong>1 USD ={" "}
            {formatCOP(payment.pricing.exchangeRate)}
          </p>

          <p className="text-xl font-semibold text-[#3D578D]">
            Total del cobro: {formatCOP(payment.checkout.amountInCents / 100)}
          </p>

          <p className="text-sm text-gray-600">
            Importe calculado por nuestro servidor. En esta etapa utilizamos una
            tasa fija exclusivamente para Sandbox.
          </p>

          <p className="text-sm text-gray-600">
            La reserva está pendiente y el Checkout tiene un plazo limitado para
            completarse.
          </p>

          <button
            type="button"
            onClick={openWompiCheckout}
            disabled={verifyingPayment}
            className="w-full h-12 bg-[#BB9B49] rounded-lg text-[#111827] font-semibold disabled:opacity-60"
          >
            {verifyingPayment
              ? "Verificando transacción..."
              : "Abrir Wompi Sandbox"}
          </button>
        </div>
      )}

      {/* RESERVA CONFIRMADA */}
      {paymentConfirmed && (
        <div
          role="status"
          className="max-w-[1000px] mx-auto mt-8 rounded-xl border border-green-600 p-6 text-center"
        >
          <h2 className="text-2xl font-Abhaya text-green-700">
            Reserva confirmada
          </h2>

          <p className="mt-2">
            El backend verificó el pago con Wompi y confirmó tu consulta.
          </p>
        </div>
      )}
    </section>
  );
}

export default Agenda;

import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaHeart,
  FaMoon,
  FaRegClock,
  FaSeedling,
  FaStar,
} from "react-icons/fa";
import AppContext from "../contexts/AppContext";
import { getServices } from "../services/services";

// Las imágenes ya existen en frontend/public/assets/images.
// Solo el servicio devuelto por el backend se puede reservar.
const suggestedServices = [
  {
    slug: "general",
    name: "Lectura de Tarot General",
    description:
      "Un encuentro para explorar distintas áreas de tu vida, tus inquietudes y los caminos que deseas considerar.",
    image: "/assets/images/card-rubi.png",
    icon: FaMoon,
    imagePosition: "center",
  },
  {
    slug: "amor",
    name: "Tarot del Amor y las Relaciones",
    description:
      "Una lectura enfocada en los vínculos afectivos, la comunicación y las decisiones sentimentales.",
    image: "/assets/images/amor.jpg",
    icon: FaHeart,
    imagePosition: "center",
  },
  {
    slug: "prosperidad",
    name: "Tarot de Prosperidad y Trabajo",
    description:
      "Un espacio para reflexionar sobre proyectos, oportunidades y decisiones profesionales.",
    image: "/assets/images/dinero.jpg",
    icon: FaSeedling,
    imagePosition: "center",
  },
];

const normalize = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getCategory = (service) => {
  const name = normalize(service?.nombre);
  if (/amor|relacion|pareja|sentimental/.test(name)) return "amor";
  if (/prosper|trabajo|laboral|dinero|abundancia/.test(name)) {
    return "prosperidad";
  }
  if (/tarot|general/.test(name)) return "general";
  return null;
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Por confirmar";
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return "Por confirmar";
  // La moneda definitiva se validará con la configuración del backend.
  return `$${new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(number)}`;
};

function Consultas() {
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("general");

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      try {
        const response = await getServices();
        if (!active) return;
        setServices(response);
        setError("");
      } catch (err) {
        console.error("No fue posible cargar los servicios:", err);
        if (active) {
          setError("No fue posible consultar los servicios disponibles.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  const catalog = useMemo(() => {
    const matchedIds = new Set();
    const main = suggestedServices.map((suggestion) => {
      const match = services.find((service) => {
        if (matchedIds.has(service._id)) return false;
        return getCategory(service) === suggestion.slug;
      });

      if (match) matchedIds.add(match._id);

      return {
        ...suggestion,
        id: match?._id ?? suggestion.slug,
        name: match?.nombre || suggestion.name,
        description: match?.descripcion || suggestion.description,
        duration: match?.duracion,
        price: match?.precio,
        available: Boolean(match),
      };
    });

    // Preservar otros servicios que puedan añadirse desde MongoDB.
    const additional = services
      .filter((service) => !matchedIds.has(service._id))
      .map((service, index) => ({
        id: service._id ?? `adicional-${index}`,
        slug: `adicional-${service._id ?? index}`,
        name: service.nombre,
        description: service.descripcion,
        duration: service.duracion,
        price: service.precio,
        image: "/assets/images/card-rubi.png",
        imagePosition: "center",
        icon: FaStar,
        available: true,
      }));

    return [...main, ...additional];
  }, [services]);

  const selectedService =
    catalog.find((service) => service.slug === selectedSlug) ?? catalog[0];

  const handleAgendaClick = () => {
    if (isLoggedIn) {
      navigate("/agenda");
      return;
    }
    navigate("/login", {
      state: { from: { pathname: "/agenda" } },
    });
  };

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-[#F8F6F0] font-inter">
      {/* HERO: mismo lenguaje visual que Home; sin sustituir su identidad. */}
      <section
        aria-labelledby="consultas-heading"
        className="relative isolate overflow-hidden bg-[#101827] text-[#F8F6F0]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage: "url('/assets/images/hero-bg-spiritual.jpg')",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,17,33,0.97)_0%,rgba(13,27,48,0.94)_47%,rgba(19,37,64,0.72)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-[400px] w-[400px] rounded-full bg-[#BB9B49]/10 blur-[100px]"
        />

        <div className="ldr-container relative z-10 grid min-h-[370px] min-w-0 items-center gap-8 py-14 sm:min-h-[420px] sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 lg:py-16">
          <div className="min-w-0 text-center lg:text-left">
            <p className="mb-5 inline-flex max-w-full items-center gap-3 rounded-full border border-[#BB9B49]/45 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#E8D8B5] sm:text-xs">
              <FaStar size={10} aria-hidden="true" />
              Luz de Rubí · Consultas
            </p>
            <h1
              id="consultas-heading"
              className="font-Abhaya text-[clamp(3rem,7.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[#F8F6F0]"
            >
              Consultas
              <span className="block italic text-[#D6B967]">espirituales</span>
            </h1>
            <div
              aria-hidden="true"
              className="mx-auto mt-6 h-px w-16 bg-[#BB9B49] lg:mx-0"
            />
            <p className="mx-auto mt-6 max-w-[550px] text-[14px] leading-[1.85] text-white/80 sm:text-[15px] lg:mx-0">
              Un espacio para explorar tus inquietudes, conocer cada experiencia
              y encontrar una consulta que conecte contigo.
            </p>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[365px] items-center justify-center lg:flex">
            <div
              aria-hidden="true"
              className="absolute inset-4 rounded-full bg-[#D6B967]/15 blur-[65px]"
            />
            <div className="relative w-full rotate-[4deg] overflow-hidden rounded-[28px] border border-[#BB9B49]/45 bg-[#142643] p-3 shadow-[0_26px_80px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:rotate-0">
              <img
                src="/assets/images/card-rubi.png"
                alt=""
                className="h-[280px] w-full rounded-[20px] object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRANSICIÓN EDITORIAL */}
      <section className="bg-[linear-gradient(180deg,#EDE5D8_0%,#F8F6F0_90%)] px-4 pb-10 pt-14 text-center sm:pb-12 sm:pt-16">
        <div className="mx-auto max-w-[770px]">
          <span className="ldr-eyebrow">Nuestras experiencias</span>
          <h2 className="mt-4 font-Abhaya text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#111827]">
            Encuentra tu espacio
            <span className="block italic text-[#94783F]">de conexión.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[570px] text-[14px] leading-[1.85] text-[#6F7480] sm:text-[15px]">
            Conoce las consultas, explora sus detalles y elige con calma.
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-8 flex max-w-[260px] items-center gap-3"
          >
            <span className="h-px flex-1 bg-[#BB9B49]/55" />
            <span className="h-2 w-2 rotate-45 border border-[#BB9B49]" />
            <span className="h-px flex-1 bg-[#BB9B49]/55" />
          </div>
        </div>
      </section>

      {/* CATÁLOGO: tarjetas visuales, no botones de compra insistentes. */}
      <section className="bg-[#F8F6F0] pb-20 pt-3 sm:pb-24">
        <div className="ldr-container">
          {error && (
            <p
              role="alert"
              className="mb-6 rounded-xl border border-[#BB9B49]/30 bg-white px-5 py-4 text-center text-sm text-[#554621]"
            >
              {error} Las propuestas de consulta se muestran solo como
              referencia.
            </p>
          )}
          {loading ? (
            <div
              role="status"
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-[380px] animate-pulse rounded-[24px] bg-[#EBE6DC]"
                />
              ))}
              <span className="sr-only">Cargando servicios disponibles...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {catalog.map((service, index) => {
                  const Icon = service.icon;
                  const selected = selectedService?.slug === service.slug;

                  return (
                    <button
                      type="button"
                      key={service.id}
                      aria-pressed={selected}
                      aria-controls="consulta-detalle"
                      onClick={() => setSelectedSlug(service.slug)}
                      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border bg-white text-left shadow-[0_14px_40px_rgba(17,24,39,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(17,24,39,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BB9B49] ${selected ? "border-[#BB9B49]" : "border-[#BB9B49]/25"}`}
                    >
                      <div className="relative h-[176px] w-full overflow-hidden bg-[#192846] sm:h-[195px]">
                        <img
                          src={service.image}
                          alt=""
                          loading="lazy"
                          style={{ objectPosition: service.imagePosition }}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/55 via-transparent to-transparent" />
                        <span className="absolute left-5 top-4 rounded-full border border-white/25 bg-[#101827]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                          {service.available ? "Disponible" : "Próximamente"}
                        </span>
                        <span className="absolute bottom-3 right-5 font-Abhaya text-3xl text-white/85">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#BB9B49]/10 text-[#94783F] transition-transform duration-300 group-hover:rotate-[-7deg]">
                          <Icon size={18} aria-hidden="true" />
                        </div>
                        <h3 className="font-Abhaya text-[27px] font-semibold leading-[1.12] text-[#192846]">
                          {service.name}
                        </h3>
                        <p className="mt-3 flex-1 text-[13px] leading-[1.8] text-[#6F7480] sm:text-sm">
                          {service.description}
                        </p>
                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#BB9B49]/20 pt-4 text-[12px]">
                          <span className="inline-flex items-center gap-2 text-[#7A6A48]">
                            <FaRegClock aria-hidden="true" />
                            {service.available && service.duration
                              ? `${service.duration} min`
                              : "Duración por definir"}
                          </span>
                          <span className="font-semibold text-[#927337]">
                            {service.available
                              ? formatPrice(service.price)
                              : "Por definir"}
                          </span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#8B733D]">
                          Ver detalles
                          <FaArrowRight
                            size={11}
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* La selección muestra detalles; no reserva automáticamente. */}
              <div
                id="consulta-detalle"
                aria-live="polite"
                className="mt-8 grid min-w-0 items-center gap-6 rounded-[26px] border border-[#BB9B49]/25 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(17,24,39,0.04)] sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94783F]">
                    Consulta seleccionada
                  </span>
                  <h3 className="mt-2 font-Abhaya text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-tight text-[#192846]">
                    {selectedService.name}
                  </h3>
                  <p className="mt-3 max-w-[700px] text-[14px] leading-[1.8] text-[#6F7480]">
                    {selectedService.description}
                  </p>
                  {!selectedService.available && (
                    <p className="mt-3 text-[12px] font-medium text-[#94783F]">
                      Estamos preparando esta experiencia. Todavía no está
                      habilitada para reservas.
                    </p>
                  )}
                </div>
                {selectedService.available ? (
                  <button
                    type="button"
                    onClick={handleAgendaClick}
                    className="ldr-button ldr-button--gold w-full shrink-0 lg:w-auto"
                  >
                    Ir a Agenda <FaArrowRight size={12} aria-hidden="true" />
                  </button>
                ) : (
                  <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#BB9B49]/35 px-6 text-[13px] font-medium text-[#8B733D]">
                    Próximamente
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#101827,#1C3051,#101827)] px-4 py-16 text-center text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-40 h-[330px] w-[330px] rounded-full bg-[#BB9B49]/10 blur-[85px]"
        />
        <div className="relative mx-auto max-w-[760px]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6B967]">
            Un momento para ti
          </span>
          <h2 className="mt-4 font-Abhaya text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.1]">
            Tu camino comienza{" "}
            <span className="italic text-[#D6B967]">aquí.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[530px] text-[14px] leading-[1.85] text-white/75 sm:text-[15px]">
            Explora las experiencias a tu ritmo. Cuando lo decidas, podrás
            consultar fechas y horarios disponibles.
          </p>
          <button
            type="button"
            onClick={handleAgendaClick}
            className="ldr-button ldr-button--gold mt-8"
          >
            Consultar disponibilidad{" "}
            <FaArrowRight size={12} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Consultas;

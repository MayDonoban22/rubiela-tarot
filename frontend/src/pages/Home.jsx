import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaHeart,
  FaHeartbeat,
  FaMoneyBillWave,
  FaStar,
  FaBookOpen,
  FaPlay,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

import AppContext from "../contexts/AppContext";
import SidebarHoroscopo from "../components/SidebarHoroscopo";

// =====================================
// TEMAS DE ORIENTACIÓN ESPIRITUAL
// =====================================

const spiritualTopics = [
  {
    title: "Amor y relaciones",
    description:
      "Un espacio de reflexión para comprender tus vínculos, emociones y decisiones.",
    icon: FaHeart,
    number: "01",
  },
  {
    title: "Bienestar personal",
    description:
      "Encuentra un momento de tranquilidad, escucha y conexión contigo mismo.",
    icon: FaHeartbeat,
    number: "02",
  },
  {
    title: "Prosperidad",
    description:
      "Explora tus aspiraciones, oportunidades y proyectos desde una mirada espiritual.",
    icon: FaMoneyBillWave,
    number: "03",
  },
  {
    title: "Nuevos caminos",
    description:
      "Reflexiona sobre los cambios, las posibilidades y las decisiones importantes.",
    icon: FaStar,
    number: "04",
  },
  {
    title: "Oraciones personalizadas",
    description:
      "Conoce un acompañamiento espiritual pensado para tus intenciones personales.",
    icon: FaBookOpen,
    number: "05",
  },
];

// =====================================
// COMPONENTE HOME
// =====================================

function Home() {
  const { isLoggedIn } = useContext(AppContext);

  const navigate = useNavigate();

  const handleAgendaClick = () => {
    if (isLoggedIn) {
      navigate("/agenda");
      return;
    }

    navigate("/login", {
      state: {
        from: {
          pathname: "/agenda",
        },
      },
    });
  };

  return (
    <main className="w-full min-w-0 overflow-x-clip">
      {/* CONSERVAMOS EL HORÓSCOPO ORIGINAL */}
      <SidebarHoroscopo />

      {/* ===================================
          HERO — BANNER EDITORIAL
          Fondo real + retrato temporal de Rubiela
         =================================== */}
      <section
        className="relative isolate overflow-hidden bg-[#101827] text-[#F8F6F0]"
        aria-labelledby="home-heading"
      >
        {/* Fondo decorativo independiente del contenido */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/hero-bg-spiritual.jpg')",
          }}
        />

        {/* Overlay para mantener legibilidad sin ocultar la fotografía */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,17,35,0.96)_0%,rgba(12,23,46,0.87)_43%,rgba(16,29,53,0.57)_74%,rgba(16,29,53,0.34)_100%)]"
        />

        <div className="ldr-container relative z-10 grid w-full min-w-0 items-center gap-10 py-12 sm:py-16 md:py-20 lg:min-h-[610px] lg:grid-cols-2 lg:gap-10 lg:py-20">
          {/* Texto siempre al frente y alineado a la izquierda en escritorio */}
          <div className="ldr-animate-enter min-w-0 w-full max-w-[620px] text-center lg:text-left">
            <span className="mb-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#D6B967]/30 bg-[#101827]/40 px-3 py-2 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-[#E8D8B5] backdrop-blur-sm sm:px-5 sm:text-[11px] sm:tracking-[0.19em]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#D6B967]"
              />
              Un espacio para conectar contigo
            </span>

            <h1
              id="home-heading"
              className="max-w-full text-[clamp(2.7rem,9vw,5.6rem)] font-normal leading-[1.08] tracking-[-0.045em] text-[#F8F6F0] [overflow-wrap:break-word]"
              style={{
                fontFamily:
                  '"Baskerville", "Iowan Old Style", "Palatino Linotype", Georgia, serif',
              }}
            >
              Luz de{" "}
              <span className="font-normal italic text-[#E5C776]">Rubí</span>
            </h1>

            <div
              aria-hidden="true"
              className="mt-6 h-px w-20 bg-gradient-to-r from-[#D6B967] to-transparent mx-auto lg:mx-0"
            />

            <p
              className="mt-6 text-[clamp(1.25rem,4.5vw,1.9rem)] font-normal leading-[1.3] tracking-[-0.01em] text-[#E8D8B5]"
              style={{
                fontFamily:
                  '"Baskerville", "Iowan Old Style", "Palatino Linotype", Georgia, serif',
              }}
            >
              Orientación espiritual y conexión interior
            </p>

            <p className="mx-auto mt-5 max-w-[540px] text-[14px] leading-[1.75] text-white/80 sm:text-[15px] sm:leading-[1.9] lg:mx-0">
              Descubre un espacio de acompañamiento junto a Rubiela, donde el
              tarot y la reflexión espiritual te invitan a mirar tu camino desde
              una perspectiva diferente.
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 min-[420px]:items-center sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={handleAgendaClick}
                className="group inline-flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full border border-[#D9BC71] bg-gradient-to-r from-[#B99547] via-[#E2C476] to-[#BA964B] px-7 py-3 text-[13px] font-semibold tracking-[0.01em] text-[#111827] shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(187,155,73,0.24)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2C476] sm:w-auto"
              >
                Agendar consulta
                <FaArrowRight
                  aria-hidden="true"
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
              <Link
                to="/sobre-mi"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#E2C476]/65 bg-[#101827]/35 px-7 py-3 text-[13px] font-medium tracking-[0.02em] text-[#F8F6F0] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E2C476] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2C476] sm:w-auto"
              >
                Conoce a Rubiela
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-[11px] text-white/70 sm:text-xs lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <FaCalendarAlt aria-hidden="true" className="text-[#D6B967]" />
                Consultas con cita previa
              </span>
              <span className="inline-flex items-center gap-2">
                <FaShieldAlt aria-hidden="true" className="text-[#D6B967]" />
                Atención personalizada
              </span>
            </div>
          </div>

          {/* Imagen temporal: reemplazaremos SOLO esta ruta por la foto oficial */}
          <div className="relative mx-auto w-full min-w-0 max-w-[260px] sm:max-w-[330px] lg:ml-auto lg:max-w-[390px]">
            <div
              aria-hidden="true"
              className="absolute inset-8 rounded-full bg-[#BB9B49]/20 blur-[65px]"
            />
            <div className="relative overflow-hidden rounded-[28px] border border-[#D6B967]/30 bg-[#192846]/55 p-2 shadow-[0_25px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-3">
              <img
                src="/assets/images/profile-avatar.png"
                alt="Ilustración temporal de Luz de Rubí, pendiente de fotografía de Rubiela"
                className="aspect-[4/5] w-full rounded-[20px] object-cover object-center"
                fetchPriority="high"
              />
            </div>
            <div className="relative mx-auto -mt-5 w-fit rounded-xl border border-[#BB9B49]/40 bg-[#101827]/95 px-6 py-3 text-center shadow-xl backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8D8B5]/70">
                Luz de Rubí
              </p>
              <p
                className="mt-1 text-[22px] font-normal italic text-[#D6B967]"
                style={{
                  fontFamily:
                    '"Baskerville", "Iowan Old Style", "Palatino Linotype", Georgia, serif',
                }}
              >
                Guía espiritual
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          INTRODUCCIÓN
         =================================== */}

      <section
        className="relative overflow-hidden bg-[linear-gradient(180deg,#E9E2D5_0%,#F3EDE4_48%,#F8F6F0_100%)] py-16 sm:py-20 lg:py-24"
        aria-labelledby="welcome-heading"
      >
        <div
          className="
            ldr-container
            mx-auto max-w-[900px]
            text-center
          "
        >
          <span className="ldr-eyebrow">Un momento para ti</span>

          <h2
            id="welcome-heading"
            className="ldr-heading mt-5 text-[clamp(2.25rem,7.5vw,4.5rem)]"
          >
            Cada historia merece
            <span className="block text-[#8B733D]">ser escuchada.</span>
          </h2>

          <div
            aria-hidden="true"
            className="
              ldr-gold-line
              mx-auto mt-7
            "
          />

          <p
            className="
              ldr-lead
              mx-auto mt-7
            "
          >
            Hay momentos en los que buscamos claridad, tranquilidad o
            simplemente un espacio para reflexionar. Luz de Rubí nace con el
            propósito de ofrecer una experiencia cercana, respetuosa y llena de
            significado.
          </p>
        </div>
      </section>

      {/* DIVISOR VISUAL ENTRE INTRODUCCIÓN Y SERVICIOS */}
      <div
        aria-hidden="true"
        className="relative h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(187,155,73,0.18)_20%,rgba(187,155,73,0.70)_50%,rgba(187,155,73,0.18)_80%,transparent_100%)]"
      >
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#BB9B49]/70 bg-[#F8F6F0]" />
      </div>

      {/* ===================================
          TEMAS ESPIRITUALES
         =================================== */}

      <section
        className="bg-[linear-gradient(180deg,#F8F6F0_0%,#FCFAF6_48%,#F5F0E8_100%)] pb-16 pt-14 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-20"
        aria-labelledby="services-heading"
      >
        <div className="ldr-container">
          <div className="mx-auto mb-9 max-w-[760px] text-center sm:mb-12">
            <span className="ldr-eyebrow">Explora tus inquietudes</span>

            <h2
              id="services-heading"
              className="ldr-heading mt-4 text-[clamp(2.25rem,7.5vw,4.5rem)]"
            >
              Nuestros espacios
              <span className="block text-[#8B733D]">de orientación</span>
            </h2>

            <p
              className="
                ldr-lead
                mx-auto mt-5
              "
            >
              Conoce algunos de los temas que pueden formar parte de una
              conversación espiritual.
            </p>
          </div>

          <div
            className="
              grid gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {spiritualTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <article
                  key={topic.number}
                  className="
                    ldr-card
                    ldr-card--interactive
                    group relative
                    flex min-h-[275px]
                    flex-col p-7
                    sm:p-8
                  "
                >
                  <div
                    className="
                      mb-7 flex
                      items-start justify-between
                    "
                  >
                    <div
                      className="
                        flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        bg-[#BB9B49]/10
                        text-[#9A7B36]
                        transition-colors
                        duration-300
                        group-hover:bg-[#BB9B49]/20
                      "
                    >
                      <Icon aria-hidden="true" size={23} />
                    </div>

                    <span
                      className="
                        font-Abhaya
                        text-2xl
                        text-[#BB9B49]/55
                      "
                    >
                      {topic.number}
                    </span>
                  </div>

                  <h3
                    className="
                      font-Abhaya
                      text-[25px]
                      font-bold
                      leading-tight
                      text-[#192846]
                    "
                  >
                    {topic.title}
                  </h3>

                  <p
                    className="
                      mt-3 text-sm
                      leading-[1.8]
                      text-[#6F7480]
                    "
                  >
                    {topic.description}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-auto inline-flex items-center pt-5 text-[#BB9B49] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-125"
                  >
                    <FaStar size={12} />
                  </span>
                </article>
              );
            })}

            {/* TARJETA DE ACCIÓN */}
            <div
              className="
                ldr-card ldr-card--navy
                relative flex
                min-h-[275px]
                flex-col justify-between
                p-7 sm:p-8
              "
            >
              <div>
                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-[#D6B967]
                  "
                >
                  Consultas de Luz de Rubí
                </span>

                <h3
                  className="
                    mt-5 font-Abhaya
                    text-[28px]
                    font-bold
                    leading-tight
                  "
                >
                  Comienza tu experiencia espiritual.
                </h3>

                <p
                  className="
                    mt-3 text-sm
                    leading-[1.8]
                    text-white/70
                  "
                >
                  Descubre las consultas disponibles y elige la que mejor se
                  adapte a lo que buscas.
                </p>
              </div>

              <Link
                to="/consultas"
                className="
                  mt-8 inline-flex
                  items-center gap-3
                  text-sm font-semibold
                  text-[#D6B967]
                  transition-all duration-300
                  hover:gap-4
                "
              >
                Explorar consultas
                <FaArrowRight aria-hidden="true" size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          PRESENTACIÓN EN VIDEO
         =================================== */}

      <section
        className="relative bg-[linear-gradient(180deg,#192846_0%,#14213B_100%)] py-16 text-[#F8F6F0] sm:py-20 lg:py-24"
        aria-labelledby="video-heading"
      >
        <div className="ldr-container grid w-full min-w-0 items-center gap-9 lg:grid-cols-2 lg:gap-14">
          {/* MARCADOR VISUAL DEL FUTURO VIDEO */}
          <div
            className="
              relative flex
              aspect-video min-w-0
              items-center justify-center
              overflow-hidden
              rounded-[28px]
              border border-[#BB9B49]/30
              bg-gradient-to-br
              from-[#263D65]
              via-[#192846]
              to-[#101827]
              shadow-[0_25px_65px_rgba(0,0,0,0.24)]
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute inset-0
                bg-[radial-gradient(circle_at_center,rgba(187,155,73,0.15),transparent_55%)]
              "
            />

            <div
              className="
                relative z-10 flex
                flex-col items-center
                gap-5 text-center
                px-5
              "
            >
              <div
                className="
                  flex h-20 w-20
                  items-center justify-center
                  rounded-full
                  border border-[#D6B967]/60
                  bg-[#BB9B49]/10
                  text-[#D6B967]
                "
                aria-hidden="true"
              >
                <FaPlay size={22} />
              </div>

              <div>
                <p
                  className="
                    font-Abhaya
                    text-[27px]
                    text-[#E8D8B5]
                  "
                >
                  Conoce a Rubiela
                </p>

                <p
                  className="
                    mt-2 text-xs
                    text-white/60
                  "
                >
                  Próximamente, su video de presentación
                </p>
              </div>
            </div>
          </div>

          {/* CONTENIDO */}
          <div>
            <span
              className="
                text-xs font-semibold
                uppercase
                tracking-[0.2em]
                text-[#D6B967]
              "
            >
              Detrás de Luz de Rubí
            </span>

            <h2
              id="video-heading"
              className="
                ldr-heading
                ldr-heading--light
                mt-5
              "
            >
              Una historia,
              <span
                className="
                  block text-[#D6B967]
                "
              >
                una esencia.
              </span>
            </h2>

            <p
              className="
                mt-6 max-w-[530px]
                text-[15px]
                leading-[1.9]
                text-white/70
              "
            >
              Luz de Rubí tiene una persona y una historia detrás. Muy pronto
              podrás conocer a Rubiela a través de un video en el que ella misma
              compartirá su recorrido y su visión de la espiritualidad.
            </p>

            <Link
              to="/sobre-mi"
              className="
                ldr-button ldr-button--light
                mt-8
              "
            >
              Descubrir su historia
              <FaArrowRight aria-hidden="true" size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================
          INVITACIÓN FINAL
         =================================== */}

      <section
        className="bg-[linear-gradient(180deg,#F2ECE3_0%,#F8F6F0_38%,#F8F6F0_100%)] py-16 sm:py-20 lg:py-24"
        aria-labelledby="closing-heading"
      >
        <div
          className="
            ldr-container
            mx-auto max-w-[850px]
            text-center
          "
        >
          <span className="ldr-eyebrow">Tu espacio comienza aquí</span>

          <h2
            id="closing-heading"
            className="ldr-heading mt-5 text-[clamp(2.25rem,7.5vw,4.5rem)]"
          >
            Date un momento
            <span className="block text-[#8B733D]">para escucharte.</span>
          </h2>

          <p
            className="
              ldr-lead
              mx-auto mt-6
            "
          >
            Explora nuestras consultas y descubre una experiencia de orientación
            espiritual creada para acompañarte con cercanía y respeto.
          </p>

          <button
            type="button"
            onClick={handleAgendaClick}
            className="
              ldr-button ldr-button--gold
              mt-8
            "
          >
            Agendar mi consulta
            <FaArrowRight aria-hidden="true" size={13} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;

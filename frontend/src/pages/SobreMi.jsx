import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaQuoteLeft,
  FaStar,
  FaTimes,
  FaUser,
} from "react-icons/fa";

// Sustituye los campos vacíos SOLO cuando cuentes con testimonios auténticos
// y tengas autorización para publicar sus fotografías y videos.
const testimonials = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: "",
  location: "",
  image: "",
  videoUrl: "", // Usa un archivo MP4/WebM propio; no enlaces de páginas externas.
  comment: "",
}));

const missionItems = [
  {
    number: "01",
    title: "Compromiso",
    description:
      "Acompañamiento cercano y dedicado, respetando el proceso y las inquietudes de cada persona.",
  },
  {
    number: "02",
    title: "Experiencia",
    description:
      "Una trayectoria de más de 32 años de práctica y conocimiento en la lectura del tarot.",
  },
  {
    number: "03",
    title: "Confianza",
    description:
      "Un espacio de escucha, respeto y confidencialidad para compartir tus preguntas con tranquilidad.",
  },
];

function SobreMi() {
  const [flipped, setFlipped] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const carouselRef = useRef(null);
  const closeButtonRef = useRef(null);

  const changeSlide = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector("[data-testimonial-card]");
    const distance = (card?.getBoundingClientRect().width ?? 300) + 20;
    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedTestimonial) return undefined;
    const handleEscape = (event) => {
      if (event.key === "Escape") setSelectedTestimonial(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedTestimonial]);

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-[#F8F6F0] font-inter">
      {/* HERO: coherente con el de Consultas, pero con identidad propia. */}
      <section
        aria-labelledby="sobre-mi-heading"
        className="relative isolate flex min-h-[410px] items-center overflow-hidden bg-[#101827] text-[#F8F6F0] sm:min-h-[430px] lg:min-h-[450px]"
      >
        <picture
          aria-hidden="true"
          className="absolute inset-0 z-0 block h-full w-full"
        >
          <source
            media="(max-width: 639px)"
            srcSet="/assets/images/sobre-mi-banner-mobile.jpg"
          />
          <img
            src="/assets/images/sobre-mi-banner-desktop.jpg"
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(7,15,30,0.91)_0%,rgba(10,20,39,0.79)_43%,rgba(11,24,45,0.25)_85%)] max-sm:bg-[linear-gradient(180deg,rgba(8,16,32,0.89)_0%,rgba(8,16,32,0.72)_55%,rgba(8,16,32,0.32)_100%)]"
        />
        <div className="ldr-container relative z-10 w-full py-16 sm:py-20">
          <div className="ldr-animate-enter max-w-[670px]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BB9B49]/50 bg-[#101827]/40 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#E8D8B5] backdrop-blur-sm sm:text-xs">
              <FaStar size={10} aria-hidden="true" className="text-[#D6B967]" />
              Luz de Rubí · Nuestra historia
            </p>
            <h1
              id="sobre-mi-heading"
              className="font-Abhaya text-[clamp(2.65rem,4.7vw,4rem)] font-medium leading-[1.05] tracking-[-0.025em] text-[#F8F6F0]"
            >
              Sobre <span className="italic text-[#E2BE66]">mí</span>
            </h1>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-[#D6B967] to-transparent" />
            <p className="mt-5 max-w-[510px] text-[14px] leading-[1.85] text-[#F8F6F0]/85 sm:text-[15px]">
              Detrás de cada consulta hay una historia de aprendizaje,
              sensibilidad y vocación por acompañar a los demás.
            </p>
          </div>
        </div>
      </section>

      {/* PRESENTACIÓN + CARTA INTERACTIVA */}
      <section className="bg-[#F8F6F0] px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <span className="ldr-eyebrow">Conoce a Rubiela</span>
            <h2 className="mt-4 max-w-[670px] font-Abhaya text-[clamp(2.1rem,4vw,3.5rem)] font-medium leading-[1.13] tracking-[-0.02em] text-[#192846]">
              Una guía espiritual con{" "}
              <span className="italic text-[#9B7D3E]">
                experiencia, intuición y propósito.
              </span>
            </h2>
            <div className="mt-6 h-px w-20 bg-gradient-to-r from-[#BB9B49] to-transparent" />
            <div className="mt-6 max-w-[640px] space-y-5 text-[15px] leading-[1.95] text-[#596372] sm:text-[16px]">
              <p>
                Soy{" "}
                <strong className="font-semibold text-[#192846]">
                  Rubiela Pineda Cortés
                </strong>
                , guía espiritual y lectora de tarot con más de 32 años de
                experiencia. Desde muy joven descubrí mi don, heredado de mi
                abuela, quien me enseñó a leer las cartas y a conectar con la
                energía de cada ser.
              </p>
              <p>
                Mi propósito es acompañarte a encontrar claridad, amor y
                abundancia, iluminando tu camino con mensajes positivos y
                sabiduría ancestral.
              </p>
              <p>
                Para mí, cada consulta es un espacio especial de escucha,
                reflexión y confianza, en el que puedes acercarte a tus
                inquietudes con esperanza.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-[#BB9B49]/25 pt-6">
              <span className="font-Abhaya text-[42px] leading-none text-[#9B7D3E]">
                32+
              </span>
              <p className="max-w-[230px] text-[13px] leading-relaxed text-[#667080]">
                Años de experiencia dedicados al tarot y la orientación
                espiritual
              </p>
            </div>
          </div>

          <div className="order-1 flex flex-col items-center lg:order-2">
            <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.17em] text-[#8B733D]">
              Toca la carta para descubrir más
            </p>
            <button
              type="button"
              aria-label={
                flipped
                  ? "Mostrar el frente de La Emperatriz"
                  : "Descubrir el mensaje de La Emperatriz"
              }
              aria-pressed={flipped}
              onClick={() => setFlipped((current) => !current)}
              className="group w-full max-w-[375px] cursor-pointer rounded-[22px] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#BB9B49]/60 [perspective:1400px]"
            >
              <div
                className={`relative aspect-[2/3] w-full transition-transform duration-700 motion-reduce:transition-none [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
              >
                {/* Frente: imagen temporal, sustituible por el retrato real de Rubiela. */}
                <div className="absolute inset-0 overflow-hidden rounded-[22px] border-2 border-[#BB9B49]/65 bg-[#101827] shadow-[0_25px_65px_rgba(17,24,39,0.22)] [backface-visibility:hidden]">
                  <img
                    src="/assets/images/card-la-emperatriz.png"
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101827]/95 via-[#101827]/65 to-transparent px-7 pb-7 pt-16 text-center">
                    <span className="text-[10px] uppercase tracking-[0.19em] text-[#E8D8B5]">
                      La esencia de Luz de Rubí
                    </span>
                    <p className="mt-2 font-Abhaya text-[clamp(1.6rem,3vw,2.2rem)] italic leading-tight text-[#F3D98C]">
                      Rubiela Pineda Cortés
                    </p>
                  </div>
                </div>

                {/* Reverso: misma imagen, overlay místico y tipografía editorial. */}
                <div className="absolute inset-0 overflow-hidden rounded-[22px] border-2 border-[#BB9B49]/65 bg-[#101827] shadow-[0_25px_65px_rgba(17,24,39,0.22)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <img
                    src="/assets/images/card-la-emperatriz.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,21,43,0.78),rgba(11,21,43,0.89))]" />
                  <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center text-[#F8F6F0] sm:px-9">
                    <FaStar
                      className="mb-5 text-[#D6B967]"
                      size={17}
                      aria-hidden="true"
                    />
                    <span className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#E8D8B5]">
                      Mi esencia
                    </span>
                    <h3 className="font-Abhaya text-[clamp(1.85rem,3.6vw,2.65rem)] italic leading-[1.12] text-[#F3D98C]">
                      La luz detrás de cada consulta
                    </h3>
                    <div className="my-5 h-px w-14 bg-[#D6B967]/65" />
                    <p className="max-w-[280px] text-[13px] leading-[1.85] text-white/85 sm:text-[14px]">
                      Mi vocación nace de una tradición familiar y del deseo de
                      acompañar a quienes buscan orientación y serenidad.
                    </p>
                    <span className="mt-7 font-Abhaya text-[23px] italic text-[#F3D98C]">
                      Con cariño, Rubiela
                    </span>
                  </div>
                </div>
              </div>
            </button>
            <p className="mt-4 text-center text-[12px] text-[#7A7D81]">
              Haz clic nuevamente para regresar a la carta.
            </p>
          </div>
        </div>
      </section>

      {/* MISIÓN */}
      <section className="bg-[linear-gradient(180deg,#EDE5D8_0%,#F8F6F0_100%)] px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="ldr-eyebrow">Lo que nos inspira</span>
            <h2 className="mt-4 font-Abhaya text-[clamp(2.4rem,5vw,3.7rem)] font-medium leading-tight text-[#192846]">
              Mi <span className="italic text-[#9B7D3E]">misión</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-[1.9] text-[#667080] sm:text-[16px]">
              Mi misión es ofrecer un acompañamiento espiritual auténtico y
              profundo. A través de valores sólidos, brindo confianza,
              comprensión y guía a cada persona que acude a mí.
            </p>
          </div>
          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {missionItems.map((item) => (
              <article
                key={item.number}
                className="group rounded-[24px] border border-[#BB9B49]/25 bg-white p-7 shadow-[0_12px_35px_rgba(17,24,39,0.05)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none sm:p-8"
              >
                <span className="font-Abhaya text-[23px] text-[#BB9B49]/70">
                  {item.number}
                </span>
                <h3 className="mt-4 font-Abhaya text-[30px] text-[#192846]">
                  {item.title}
                </h3>
                <div className="mt-3 h-px w-12 bg-[#BB9B49]/70" />
                <p className="mt-4 text-[14px] leading-[1.85] text-[#667080]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS: seis posiciones listas para contenido real. */}
      <section className="bg-[#F8F6F0] px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-[650px]">
              <span className="ldr-eyebrow">Voces que nos acompañan</span>
              <h2 className="mt-3 font-Abhaya text-[clamp(2.4rem,5vw,3.7rem)] font-medium text-[#192846]">
                Historias{" "}
                <span className="italic text-[#9B7D3E]">compartidas</span>
              </h2>
              <p className="mt-3 max-w-[580px] text-[14px] leading-[1.85] text-[#667080] sm:text-[15px]">
                Este espacio está preparado para presentar experiencias de
                quienes deseen compartirlas, con su autorización.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                aria-label="Ver testimonios anteriores"
                onClick={() => changeSlide(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BB9B49]/45 text-[#8B733D] transition-colors hover:bg-[#EEE5D4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BB9B49]"
              >
                <FaChevronLeft size={13} />
              </button>
              <button
                type="button"
                aria-label="Ver siguientes testimonios"
                onClick={() => changeSlide(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BB9B49]/45 text-[#8B733D] transition-colors hover:bg-[#EEE5D4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BB9B49]"
              >
                <FaChevronRight size={13} />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            aria-label="Carrusel de testimonios"
            className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:thin]"
          >
            {testimonials.map((item) => {
              const hasContent = Boolean(
                item.name && (item.comment || item.videoUrl),
              );
              return (
                <div
                  key={item.id}
                  data-testimonial-card
                  className="w-[min(82vw,350px)] shrink-0 snap-start overflow-hidden rounded-[24px] border border-[#BB9B49]/30 bg-white shadow-[0_15px_40px_rgba(17,24,39,0.06)] sm:w-[350px]"
                >
                  <div className="relative flex h-[190px] items-center justify-center overflow-hidden bg-[linear-gradient(130deg,#111827,#263D65,#554621)]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D6B967]/50 bg-white/10 text-[#E8D8B5]">
                        <FaUser size={31} aria-hidden="true" />
                      </div>
                    )}
                    <span className="absolute bottom-4 right-5 font-Abhaya text-[33px] text-white/65">
                      {String(item.id).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex min-h-[185px] flex-col p-6">
                    <FaQuoteLeft
                      size={17}
                      className="text-[#BB9B49]"
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 font-Abhaya text-[26px] leading-tight text-[#192846]">
                      {hasContent ? item.name : "Un espacio para tu historia"}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.8] text-[#667080]">
                      {hasContent
                        ? item.comment || "Testimonio en video"
                        : "Próximamente compartiremos aquí testimonios auténticos y autorizados."}
                    </p>
                    {hasContent ? (
                      <button
                        type="button"
                        onClick={() => setSelectedTestimonial(item)}
                        className="mt-5 inline-flex items-center gap-2 self-start text-[12px] font-semibold text-[#8B733D] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BB9B49]"
                      >
                        {item.videoUrl
                          ? "Ver video e historia"
                          : "Leer historia"}
                        {item.videoUrl ? (
                          <FaPlay size={10} />
                        ) : (
                          <FaArrowRight size={11} />
                        )}
                      </button>
                    ) : (
                      <span className="mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#9B7D3E]">
                        Espacio reservado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[12px] text-[#7A7D81] sm:text-left">
            Desliza horizontalmente para explorar las seis posiciones.
          </p>
        </div>
      </section>

      {/* Modal solo disponible cuando agregues un testimonio real. */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#080E1C]/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setSelectedTestimonial(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-dialog-title"
            className="relative max-h-[90dvh] w-full max-w-[750px] overflow-y-auto rounded-[25px] border border-[#BB9B49]/30 bg-[#F8F6F0] shadow-[0_25px_90px_rgba(0,0,0,0.35)]"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedTestimonial(null)}
              aria-label="Cerrar testimonio"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#101827] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BB9B49]"
            >
              <FaTimes size={15} />
            </button>
            <div className="bg-[linear-gradient(120deg,#101827,#263D65)] px-7 py-10 text-white sm:px-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#D6B967]">
                Una historia compartida
              </p>
              <h2
                id="testimonial-dialog-title"
                className="mt-2 pr-12 font-Abhaya text-[clamp(2rem,4vw,3rem)] text-[#F3D98C]"
              >
                {selectedTestimonial.name}
              </h2>
              {selectedTestimonial.location && (
                <p className="mt-1 text-[13px] text-white/70">
                  {selectedTestimonial.location}
                </p>
              )}
            </div>
            <div className="space-y-5 p-7 sm:p-10">
              {selectedTestimonial.videoUrl && (
                <video
                  key={selectedTestimonial.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  poster={selectedTestimonial.image || undefined}
                  className="aspect-video w-full rounded-xl bg-[#101827]"
                >
                  <source src={selectedTestimonial.videoUrl} />
                  Tu navegador no admite este formato de video.
                </video>
              )}
              {selectedTestimonial.comment && (
                <blockquote className="border-l-2 border-[#BB9B49] pl-5 text-[15px] leading-[1.95] text-[#596372]">
                  “{selectedTestimonial.comment}”
                </blockquote>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default SobreMi;

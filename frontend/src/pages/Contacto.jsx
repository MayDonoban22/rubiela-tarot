import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaHeart,
  FaEnvelope,
  FaPhoneAlt,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import { contactSchema } from "../schemas";
import AppContext from "../contexts/AppContext";
import { sendContactMessage } from "../services/contact";

const WHATSAPP_NUMBER = "573209821747";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const inputClass =
  "mt-2 block w-full rounded-xl border border-[#D8C8AA] bg-[#FFFEFA] px-4 py-3.5 text-[14px] text-[#192846] outline-none transition placeholder:text-[#92959C] focus:border-[#BB9B49] focus:ring-2 focus:ring-[#BB9B49]/20";

function Contacto() {
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contactSchema),
    mode: "onTouched",
  });

  // Guardamos la solicitud en MongoDB mediante Express.
  // WhatsApp permanece como canal independiente de contacto directo.
  const onSubmit = async (data) => {
    setSubmitStatus({ type: "", message: "" });

    try {
      await sendContactMessage(data);
      setSubmitStatus({
        type: "success",
        message:
          "¡Gracias por escribirnos! Hemos recibido tu mensaje correctamente. Revisaremos tu solicitud y te responderemos lo antes posible.",
      });
      reset();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          "No pudimos confirmar la recepción del mensaje. Verifica tu conexión e inténtalo nuevamente. Si el problema continúa, escríbenos por WhatsApp.",
      });
      console.error("No fue posible registrar el contacto:", error);
    }
  };

  const handleAgendaClick = () => {
    if (isLoggedIn) {
      navigate("/agenda");
    } else {
      navigate("/login", { state: { from: { pathname: "/agenda" } } });
    }
  };

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F8F6F0] font-inter">
      {/* HERO: tipografía consistente con Consultas y Sobre mí. */}
      <section
        aria-labelledby="contacto-heading"
        className="relative isolate flex min-h-[350px] items-center overflow-hidden bg-[#101827] text-[#F8F6F0] sm:min-h-[390px] lg:min-h-[430px]"
      >
        <picture
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full"
        >
          <source
            media="(max-width: 639px)"
            srcSet="/assets/images/sobre-mi-banner-mobile.jpg"
          />
          <img
            src="/assets/images/sobre-mi-banner-desktop.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,32,0.94)_0%,rgba(11,23,44,0.82)_47%,rgba(12,26,45,0.35)_100%)] max-sm:bg-[linear-gradient(180deg,rgba(8,16,32,0.84),rgba(8,16,32,0.72))]"
        />
        <div className="ldr-container relative z-10 w-full py-16 sm:py-20">
          <div className="ldr-animate-enter max-w-[640px]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BB9B49]/45 bg-[#111827]/45 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#E8D8B5] backdrop-blur-sm sm:text-xs">
              <FaStar size={10} aria-hidden="true" className="text-[#D6B967]" />
              Luz de Rubí · Contacto
            </p>
            <h1
              id="contacto-heading"
              className="font-Abhaya text-[clamp(2.65rem,4.7vw,4rem)] font-medium leading-[1.02] tracking-[-0.025em] text-[#F8F6F0]"
            >
              Hablemos <span className="italic text-[#E2BE66]">con calma.</span>
            </h1>
            <div
              aria-hidden="true"
              className="mt-6 h-px w-16 bg-gradient-to-r from-[#D6B967] to-transparent"
            />
            <p className="mt-5 max-w-[540px] text-[14px] leading-[1.85] text-white/85 sm:text-[15px]">
              A veces, todo comienza con una conversación. Cuéntame qué te
              gustaría consultar y encontremos juntos un espacio para
              escucharte.
            </p>
          </div>
        </div>
      </section>

      {/* PRESENTACIÓN */}
      <section className="bg-[linear-gradient(180deg,#EDE5D8_0%,#F8F6F0_100%)] px-4 pb-10 pt-14 text-center sm:pt-16">
        <div className="ldr-animate-enter mx-auto max-w-[700px]">
          <span className="ldr-eyebrow">Estamos para escucharte</span>
          <h2 className="mt-4 font-Abhaya text-[clamp(2.1rem,4.5vw,3.5rem)] font-medium leading-[1.1] text-[#192846]">
            Un mensaje puede ser el{" "}
            <span className="italic text-[#94783F]">primer paso.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[590px] text-[14px] leading-[1.85] text-[#6F7480] sm:text-[15px]">
            Escríbenos por WhatsApp o solicita una cita desde nuestra agenda. La
            atención es personalizada y con cita previa.
          </p>
        </div>
      </section>

      {/* FORMULARIO Y CONTACTO DIRECTO */}
      <section className="bg-[#F8F6F0] pb-20 pt-4 sm:pb-24">
        <div className="ldr-container grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(310px,0.85fr)] lg:items-start">
          <div className="min-w-0 rounded-[26px] border border-[#BB9B49]/25 bg-white p-6 shadow-[0_16px_48px_rgba(17,24,39,0.06)] sm:p-9">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94783F]">
              Escríbenos
            </span>
            <h2 className="mt-3 font-Abhaya text-[clamp(2rem,3.5vw,2.8rem)] font-medium leading-[1.12] text-[#192846]">
              Cuéntame tu inquietud
            </h2>
            <p className="mt-3 max-w-[540px] text-[14px] leading-[1.8] text-[#69717F]">
              Completa los campos y envía tu mensaje de forma segura. Recibirás
              una confirmación aquí cuando tu solicitud quede registrada.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="contacto-name"
                  className="text-[13px] font-semibold text-[#34415A]"
                >
                  Tu nombre
                </label>
                <input
                  id="contacto-name"
                  type="text"
                  autoComplete="name"
                  placeholder="¿Cómo te llamas?"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "contacto-name-error" : undefined
                  }
                  {...register("name")}
                  className={inputClass}
                />
                {errors.name && (
                  <p
                    id="contacto-name-error"
                    role="alert"
                    className="mt-2 text-[12px] text-[#A13F3F]"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contacto-email"
                  className="text-[13px] font-semibold text-[#34415A]"
                >
                  Correo electrónico
                </label>
                <input
                  id="contacto-email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "contacto-email-error" : undefined
                  }
                  {...register("email")}
                  className={inputClass}
                />
                {errors.email && (
                  <p
                    id="contacto-email-error"
                    role="alert"
                    className="mt-2 text-[12px] text-[#A13F3F]"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contacto-message"
                  className="text-[13px] font-semibold text-[#34415A]"
                >
                  Tu mensaje
                </label>
                <textarea
                  id="contacto-message"
                  rows={5}
                  placeholder="Escribe aquí lo que deseas consultar..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contacto-message-error" : undefined
                  }
                  {...register("message")}
                  className={`${inputClass} min-h-[145px] resize-y`}
                />
                {errors.message && (
                  <p
                    id="contacto-message-error"
                    role="alert"
                    className="mt-2 text-[12px] text-[#A13F3F]"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div aria-live="polite" aria-atomic="true">
                {submitStatus.message && (
                  <div
                    role={submitStatus.type === "error" ? "alert" : "status"}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-[13px] leading-[1.7] ${
                      submitStatus.type === "success"
                        ? "border-[#BB9B49]/40 bg-[#F8F6F0] text-[#34415A]"
                        : "border-[#B95757]/35 bg-[#FFF6F5] text-[#983E3E]"
                    }`}
                  >
                    {submitStatus.type === "success" && (
                      <FaCheckCircle
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-[#94783F]"
                      />
                    )}
                    <p>{submitStatus.message}</p>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ldr-button ldr-button--gold inline-flex w-full items-center justify-center gap-3 disabled:cursor-wait disabled:opacity-60"
              >
                <FaEnvelope size={17} aria-hidden="true" />
                {isSubmitting ? "Enviando mensaje..." : "Enviar mensaje"}
                {!isSubmitting && <FaArrowRight size={12} aria-hidden="true" />}
              </button>
              <p className="text-center text-[11px] leading-[1.7] text-[#777C87]">
                Tus datos se utilizarán para atender esta solicitud. No incluyas
                información confidencial en el mensaje.
              </p>
            </form>
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-[26px] border border-[#BB9B49]/25 bg-[linear-gradient(145deg,#17253D,#263D65)] p-7 text-[#F8F6F0] shadow-[0_16px_48px_rgba(17,24,39,0.1)] sm:p-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D6B967]">
                Contacto directo
              </span>
              <h2 className="mt-3 font-Abhaya text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.1] text-white">
                Cerca de ti,{" "}
                <span className="italic text-[#D6B967]">donde estés.</span>
              </h2>
              <p className="mt-4 text-[14px] leading-[1.8] text-white/75">
                Si prefieres conversar directamente, escríbenos por WhatsApp
                para resolver tus inquietudes sobre las consultas.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B967]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#BB9B49]/20 text-[#E2BE66]">
                  <FaWhatsapp size={23} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-[0.1em] text-white/65">
                    WhatsApp
                  </span>
                  <span className="block text-[16px] font-semibold text-white">
                    +57 320 982 1747
                  </span>
                </span>
                <FaArrowRight
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-[#D6B967]"
                />
              </a>
              <a
                href="tel:+573209821747"
                className="mt-4 inline-flex items-center gap-2 text-[13px] text-[#E8D8B5] underline-offset-4 transition hover:underline"
              >
                <FaPhoneAlt size={12} aria-hidden="true" />
                Llamar a este número
              </a>
            </div>

            <div className="rounded-[26px] border border-[#BB9B49]/25 bg-white p-7 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-8">
              <div className="flex items-center gap-3 text-[#94783F]">
                <FaCalendarAlt aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                  Consultas personalizadas
                </span>
              </div>
              <h2 className="mt-4 font-Abhaya text-[clamp(1.8rem,3vw,2.3rem)] leading-[1.1] text-[#192846]">
                Reserva tu momento
              </h2>
              <p className="mt-3 text-[14px] leading-[1.8] text-[#69717F]">
                Explora las fechas y los horarios disponibles para tu próxima
                consulta espiritual.
              </p>
              <button
                type="button"
                onClick={handleAgendaClick}
                className="ldr-button ldr-button--gold mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                Agendar consulta <FaArrowRight size={12} aria-hidden="true" />
              </button>
            </div>

            <div className="flex gap-3 rounded-2xl border border-[#BB9B49]/20 bg-[#EDE5D8]/60 px-5 py-4 text-[#6C664F]">
              <FaHeart
                className="mt-1 shrink-0 text-[#A88A4D]"
                size={14}
                aria-hidden="true"
              />
              <p className="text-[12px] leading-[1.7]">
                Cada persona y cada historia merecen ser escuchadas con respeto,
                atención y discreción.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* CIERRE */}
      <section className="bg-[linear-gradient(120deg,#101827,#1C3051,#101827)] px-4 py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-[700px]">
          <FaCheckCircle
            aria-hidden="true"
            className="mx-auto text-[#D6B967]"
            size={20}
          />
          <h2 className="mt-4 font-Abhaya text-[clamp(2rem,4vw,3.3rem)] font-medium leading-tight">
            Tu camino merece{" "}
            <span className="italic text-[#D6B967]">ser escuchado.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-[14px] leading-[1.8] text-white/75">
            Escríbenos cuando estés listo. Estamos aquí para acompañarte.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Contacto;

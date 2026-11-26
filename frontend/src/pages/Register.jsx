import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import HeaderAuthSimple from "../components/Header/HeaderAuthSimple";
import Footer from "../components/Footer/Footer";
import { registerSchema } from "../schemas";

// =====================================
// CAMPOS DEL FORMULARIO
// =====================================

const fields = [
  {
    name: "nombre",
    label: "Nombre completo",
    type: "text",
    autoComplete: "name",
    placeholder: "¿Cómo te llamas?",
    icon: <FaUser />,
  },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    autoComplete: "email",
    placeholder: "nombre@correo.com",
    icon: <FaEnvelope />,
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Crea una contraseña segura",
    icon: <FaLock />,
  },
];

// =====================================
// COMPONENTE REGISTER
// =====================================

function Register() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  // =====================================
  // REGISTRAR USUARIO EN EXPRESS
  // =====================================

  const onSubmit = async (data) => {
    setServerError("");
    setSuccess(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("La URL del servidor no está configurada.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.nombre.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "No fue posible completar el registro.",
        );
      }

      // Express confirmó la creación de la cuenta.
      // No iniciamos sesión con un token ficticio.
      setSuccess(true);
    } catch (error) {
      console.error("Error durante el registro:", error.message);

      setServerError(
        error.message || "Ocurrió un error inesperado. Inténtalo nuevamente.",
      );
    }
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <>
      <HeaderAuthSimple variant="register" />

      <main className="min-w-0 overflow-hidden bg-[#F8F6F0] font-inter">
        <section className="grid min-h-[min(780px,calc(100svh-90px))] lg:grid-cols-2">
          {/* FORMULARIO IZQUIERDO */}

          <div className="flex min-w-0 items-center justify-center px-5 py-12 sm:px-9 sm:py-16 lg:px-12">
            <div className="ldr-animate-enter w-full max-w-[480px]">
              {/* Misma jerarquía de títulos y espaciados que Login. */}
              <div className="mb-8">
                <span className="ldr-eyebrow">Bienvenido a Luz de Rubí</span>
                <h1 className="mt-3 font-Abhaya text-[clamp(2.35rem,4vw,3.4rem)] font-medium leading-tight text-[#192846]">
                  Crea tu <span className="italic text-[#94783F]">cuenta</span>
                </h1>
                <p className="mt-2 text-sm leading-7 text-[#69717F]">
                  Regístrate para comenzar tu experiencia en Luz de Rubí.
                </p>
              </div>

              <div>
                {success ? (
                  /* REGISTRO EXITOSO */

                  <div role="status" className="py-8 text-center">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#BB9B49]/10 text-[#A88A4D]">
                      <FaCheckCircle size={30} />
                    </span>

                    <h2 className="mt-6 font-Abhaya text-[clamp(2rem,3vw,2.5rem)] text-[#192846]">
                      ¡Bienvenido a{" "}
                      <span className="italic text-[#A88A4D]">
                        Luz de Rubí!
                      </span>
                    </h2>

                    <p className="mt-4 text-[14px] leading-[1.85] text-[#69717F]">
                      Tu cuenta fue creada correctamente. Ahora puedes iniciar
                      sesión y continuar con tu experiencia.
                    </p>

                    <Link
                      to="/login"
                      className="ldr-button ldr-button--gold mt-8 inline-flex w-full items-center justify-center gap-3"
                    >
                      Iniciar sesión
                      <FaArrowRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  /* FORMULARIO */

                  <>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="space-y-5"
                    >
                      {/* CAMPOS DINÁMICOS */}

                      {fields.map((field) => {
                        const isPassword = field.name === "password";

                        const inputType =
                          isPassword && showPassword ? "text" : field.type;

                        const error = errors[field.name];

                        return (
                          <div key={field.name}>
                            <label
                              htmlFor={`registro-${field.name}`}
                              className="block text-[13px] font-semibold text-[#34415A]"
                            >
                              {field.label}
                            </label>

                            <div className="relative mt-2">
                              {/* ICONO */}

                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94783F]"
                              >
                                {field.icon}
                              </span>

                              {/* INPUT */}

                              <input
                                id={`registro-${field.name}`}
                                type={inputType}
                                autoComplete={field.autoComplete}
                                placeholder={field.placeholder}
                                {...register(field.name)}
                                aria-invalid={Boolean(error)}
                                aria-describedby={
                                  error
                                    ? `registro-${field.name}-error`
                                    : undefined
                                }
                                className={`block min-h-[50px] w-full rounded-xl border bg-[#FFFEFA] py-3 pl-11 text-[14px] text-[#192846] outline-none transition placeholder:text-[#92959C] focus:ring-2 ${
                                  isPassword ? "pr-12" : "pr-4"
                                } ${
                                  error
                                    ? "border-[#B74A4A] focus:border-[#B74A4A] focus:ring-[#B74A4A]/15"
                                    : "border-[#D8C8AA] focus:border-[#BB9B49] focus:ring-[#BB9B49]/20"
                                }`}
                              />

                              {/* MOSTRAR CONTRASEÑA */}

                              {isPassword && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowPassword((previous) => !previous)
                                  }
                                  aria-label={
                                    showPassword
                                      ? "Ocultar contraseña"
                                      : "Mostrar contraseña"
                                  }
                                  aria-pressed={showPassword}
                                  className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#94783F] transition hover:bg-[#BB9B49]/10 focus-visible:outline-2 focus-visible:outline-[#BB9B49]"
                                >
                                  {showPassword ? (
                                    <FaEyeSlash aria-hidden="true" />
                                  ) : (
                                    <FaEye aria-hidden="true" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* ERROR DE VALIDACIÓN */}

                            {error && (
                              <p
                                id={`registro-${field.name}-error`}
                                role="alert"
                                className="mt-2 text-[12px] leading-relaxed text-[#A13F3F]"
                              >
                                {error.message}
                              </p>
                            )}
                          </div>
                        );
                      })}

                      {/* ERROR DEL SERVIDOR */}

                      {serverError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-[#B74A4A]/30 bg-[#FFF5F3] px-4 py-3 text-[13px] leading-[1.7] text-[#9F3636]"
                        >
                          {serverError}
                        </div>
                      )}

                      {/* BOTÓN DE REGISTRO */}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ldr-button ldr-button--gold mt-3 flex min-h-12 w-full items-center justify-center gap-3 disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSubmitting ? "Creando tu cuenta..." : "Crear cuenta"}

                        {!isSubmitting && (
                          <FaArrowRight size={12} aria-hidden="true" />
                        )}
                      </button>

                      {/* ENLACE LOGIN */}

                      <p className="pt-3 text-center text-[13px] text-[#69717F]">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                          to="/login"
                          className="font-semibold text-[#94783F] underline-offset-4 transition hover:underline"
                        >
                          Inicia sesión
                        </Link>
                      </p>
                    </form>
                  </>
                )}
              </div>

              <p className="mt-7 text-center text-[11px] leading-[1.8] text-[#777C87]">
                Un espacio creado para acompañarte con respeto, confianza y
                discreción.
              </p>
            </div>
          </div>

          {/* IMAGEN DERECHA: misma entrada editorial que Login */}

          <section className="relative isolate hidden min-h-[690px] overflow-hidden bg-[#101827] text-white lg:block">
            <img
              src="/assets/images/registro-tarot-luz-de-rubi.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
              fetchPriority="high"
            />

            {/* Contraste para que se lea el texto sin ocultar el tarot. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#101827]/95 via-[#101827]/5 to-[#101827]/20 lg:from-[#101827]/90 lg:via-transparent"
            />

            {/* Animación y jerarquía idénticas a las del panel de Login. */}
            <div className="ldr-animate-enter relative flex h-full min-h-[690px] flex-col justify-end p-6 sm:p-10 lg:p-14">
              <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.21em] text-[#E8D8B5] sm:text-xs">
                <FaStar aria-hidden="true" size={11} /> Luz de Rubí
              </p>

              <h2 className="max-w-[500px] font-Abhaya text-[clamp(2.2rem,4.4vw,3.7rem)] font-medium leading-[1.04] text-white">
                Cada camino{" "}
                <span className="italic text-[#E2BE66]">
                  comienza con una luz.
                </span>
              </h2>

              <p className="mt-3 hidden max-w-[470px] text-sm leading-[1.8] text-white/80 sm:block">
                Descubre una experiencia de conexión y orientación espiritual.
              </p>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Register;

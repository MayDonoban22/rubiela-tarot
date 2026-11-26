import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import HeaderAuthSimple from "../components/Header/HeaderAuthSimple";
import Footer from "../components/Footer/Footer";
import { loginSchema } from "../schemas";

const inputBase =
  "block min-h-12 w-full rounded-xl border bg-[#FFFEFA] py-3 pl-11 pr-12 text-[14px] text-[#192846] outline-none transition placeholder:text-[#90959F] focus:ring-2 disabled:opacity-60";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema), mode: "onTouched" });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error("La URL del servidor no está configurada.");

      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result.message || "No pudimos iniciar sesión. Revisa tus datos.",
        );
      }
      if (!result.token)
        throw new Error("El servidor no devolvió un token válido.");

      login(result.token);
      const requestedPath = location.state?.from?.pathname;
      const redirectTo =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/agenda";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(error.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <>
      <HeaderAuthSimple variant="login" />
      <main className="min-w-0 overflow-hidden bg-[#F8F6F0] font-inter">
        <div className="grid min-h-[min(780px,calc(100svh-90px))] lg:grid-cols-2">
          {/* Misma familia visual que Registro; solo cambia el arte. */}
          <section className="relative isolate min-h-[210px] overflow-hidden bg-[#101827] text-white sm:min-h-[260px] lg:min-h-[690px]">
            <img
              src="/assets/images/login-rubi-exclusivo.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_48%] lg:object-center"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/95 via-[#101827]/5 to-[#101827]/20 lg:from-[#101827]/90 lg:via-transparent" />
            <div className="ldr-animate-enter relative flex h-full min-h-[210px] flex-col justify-end p-6 sm:min-h-[260px] sm:p-10 lg:min-h-[690px] lg:p-14">
              <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.21em] text-[#E8D8B5] sm:text-xs">
                <FaStar aria-hidden="true" size={11} /> Luz de Rubí
              </p>
              <h1 className="max-w-[500px] font-Abhaya text-[clamp(2.2rem,4.4vw,3.7rem)] font-medium leading-[1.04] text-white">
                Vuelve a tu{" "}
                <span className="italic text-[#E2BE66]">espacio de luz.</span>
              </h1>
              <p className="mt-3 hidden max-w-[470px] text-sm leading-[1.8] text-white/80 sm:block">
                Un lugar para reconectar, encontrar claridad y reservar tu
                próxima consulta.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-12 sm:px-9 sm:py-16 lg:px-12">
            <div className="ldr-animate-enter w-full max-w-[480px]">
              <div className="mb-8">
                <span className="ldr-eyebrow">Bienvenido de nuevo</span>
                <h2 className="mt-3 font-Abhaya text-[clamp(2.35rem,4vw,3.4rem)] font-medium leading-tight text-[#192846]">
                  Iniciar <span className="italic text-[#94783F]">sesión</span>
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#69717F]">
                  Accede a tu cuenta para continuar con tu experiencia en Luz de
                  Rubí.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-[13px] font-semibold text-[#34415A]"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative mt-2">
                    <FaEnvelope
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94783F]"
                    />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="nombre@correo.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "login-email-error" : undefined
                      }
                      {...register("email")}
                      className={`${inputBase} ${errors.email ? "border-[#B35050] focus:border-[#B35050] focus:ring-[#B35050]/20" : "border-[#D8C8AA] focus:border-[#BB9B49] focus:ring-[#BB9B49]/20"}`}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="login-email-error"
                      role="alert"
                      className="mt-2 text-xs text-[#A13F3F]"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-[13px] font-semibold text-[#34415A]"
                  >
                    Contraseña
                  </label>
                  <div className="relative mt-2">
                    <FaLock
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94783F]"
                    />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Tu contraseña"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "login-password-error" : undefined
                      }
                      {...register("password")}
                      className={`${inputBase} ${errors.password ? "border-[#B35050] focus:border-[#B35050] focus:ring-[#B35050]/20" : "border-[#D8C8AA] focus:border-[#BB9B49] focus:ring-[#BB9B49]/20"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#69717F] hover:bg-[#EDE5D8] focus-visible:outline-2 focus-visible:outline-[#BB9B49]"
                    >
                      {showPassword ? (
                        <FaEyeSlash aria-hidden="true" />
                      ) : (
                        <FaEye aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="login-password-error"
                      role="alert"
                      className="mt-2 text-xs text-[#A13F3F]"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-[#B35050]/30 bg-[#FFF4F2] px-4 py-3 text-[13px] leading-6 text-[#913F3F]"
                  >
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ldr-button ldr-button--gold mt-3 flex min-h-12 w-full items-center justify-center gap-3 disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? "Iniciando sesión..." : "Entrar a mi cuenta"}
                  {!isSubmitting && (
                    <FaArrowRight size={12} aria-hidden="true" />
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-[13px] text-[#69717F]">
                ¿Aún no tienes cuenta?{" "}
                <Link
                  to="/registro"
                  className="font-semibold text-[#94783F] underline underline-offset-4 hover:text-[#192846]"
                >
                  Regístrate aquí
                </Link>
              </p>
              <p className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#7D8290]">
                <FaShieldAlt aria-hidden="true" className="text-[#94783F]" />{" "}
                Acceso a tu espacio personal
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;

import { Link } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import HeaderAuthSimple from "../components/Header/HeaderAuthSimple";
import Footer from "../components/Footer/Footer";
import { registerSchema } from "../schemas";

const Register = () => {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccess(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("La URL del servidor no está configurada.");
      }

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.nombre.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "No fue posible completar el registro.",
        );
      }

      // El usuario fue creado en MongoDB.
      // No iniciamos sesión con tokens ficticios.
      setSuccess(true);
    } catch (error) {
      setServerError(error.message || "Ocurrió un error inesperado.");
    }
  };

  const fields = [
    {
      label: "Nombre",
      name: "nombre",
      type: "text",
      icon: <FaUser />,
      autoComplete: "name",
    },
    {
      label: "Correo electrónico",
      name: "email",
      type: "email",
      icon: <FaEnvelope />,
      autoComplete: "email",
    },
    {
      label: "Contraseña",
      name: "password",
      type: "password",
      icon: <FaLock />,
      autoComplete: "new-password",
    },
  ];

  return (
    <>
      <HeaderAuthSimple variant="register" />

      <div className="bg-primary flex flex-col min-h-screen">
        <div className="flex flex-col lg:flex-row flex-grow border border-[var(--color-goldLight)]">
          <div className="lg:w-1/2 flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-[526px]">
              <h2 className="text-3xl md:text-4xl font-[abhaya] text-[#BB9B49] text-center mb-4">
                Crea tu cuenta
              </h2>

              <p className="text-tertiary text-center mb-10">
                Comienza tu experiencia con Luz de Rubí.
              </p>

              {success ? (
                <div
                  role="status"
                  className="border border-[#BB9B49] rounded-xl p-7 text-center"
                >
                  <h3 className="text-[#BB9B49] font-[abhaya] text-2xl mb-3">
                    ¡Registro exitoso!
                  </h3>

                  <p className="text-tertiary mb-6">
                    Tu cuenta fue creada correctamente. Ya puedes iniciar
                    sesión.
                  </p>

                  <Link
                    to="/login"
                    className="inline-block bg-[#BB9B49] text-[#111827] font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                  noValidate
                >
                  {fields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label
                        htmlFor={field.name}
                        className="text-lg font-[abhaya] text-[#BB9B49]"
                      >
                        {field.label}
                      </label>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BB9B49]">
                          {field.icon}
                        </span>

                        <input
                          id={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          {...register(field.name)}
                          aria-invalid={Boolean(errors[field.name])}
                          className={`w-full min-h-11 rounded-lg bg-tertiary text-[#111827] border pl-10 pr-4 outline-none focus:ring-2 ${
                            errors[field.name]
                              ? "border-red-500 focus:ring-red-500"
                              : "border-[#BB9B49] focus:ring-[#BB9B49]"
                          }`}
                        />
                      </div>

                      {errors[field.name] && (
                        <p className="text-red-400 text-sm" role="alert">
                          {errors[field.name].message}
                        </p>
                      )}
                    </div>
                  ))}

                  {serverError && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-500 p-3 text-red-400 text-sm"
                    >
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-11 bg-[#BB9B49] text-[#111827] font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                  </button>

                  <p className="text-tertiary text-center">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-[#BB9B49] underline">
                      Inicia sesión
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 hidden lg:flex items-center justify-center">
            <img
              src="/assets/images/card-rubi.png"
              alt="Luz de Rubí"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Register;

import { Link, useNavigate } from "react-router-dom";
import HeaderAuthSimple from "../components/Header/HeaderAuthSimple";
import Footer from "../components/Footer/Footer";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../schemas";
import { useContext, useState } from "react";
import AppContext from "../contexts/AppContext";
import { setToken } from "../utils/token";
import InfoTooltip from "../components/InfoTooltip";

const tokenRegister = async (data) => {
  console.log("tokenRegister:", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ token: "jwt-token" });
    }, 1000);
  });
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await tokenRegister(data);
      setToken(response.token);
      setIsLoggedIn(true);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        navigate("/login", { replace: true });
      }, 2500);
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <>
      <HeaderAuthSimple variant="register" />
      <div className="bg-primary flex flex-col min-h-screen relative">
        {showTooltip && (
          <InfoTooltip message="¡Registro exitoso! Inicia sesión para continuar." />
        )}
        <div className="flex flex-col lg:flex-row border border-[var(--color-goldLight)] flex-grow min-h-[92vh]">
          <div className="lg:w-1/2 flex items-center justify-center border-r border-[var(--color-goldLight)] px-6 py-40">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-[526px] flex flex-col gap-14"
              noValidate
            >
              <h2 className="text-3xl md:text-4xl font-[abhaya] text-[#9E874D] text-center mb-4">
                Regístrate
              </h2>

              {[
                {
                  label: "Nombre",
                  name: "nombre",
                  type: "text",
                  icon: <FaUser className="text-[#9E874D]" />,
                },
                {
                  label: "Correo electrónico",
                  name: "email",
                  type: "email",
                  icon: <FaEnvelope className="text-[#9E874D]" />,
                },
                {
                  label: "Contraseña",
                  name: "password",
                  type: "password",
                  icon: <FaLock className="text-[#9E874D]" />,
                },
              ].map((field, i) => (
                <div key={i} className="flex flex-col">
                  <label
                    className="text-lg md:text-xl font-[abhaya] text-[#9E874D] mb-2"
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {field.icon}
                    </span>
                    <input
                      id={field.name}
                      {...register(field.name)}
                      type={field.type}
                      className={`block w-full h-[35px] bg-tertiary border rounded-md pl-10 pr-3 focus:outline-none focus:ring-2 ${
                        errors[field.name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-goldLight focus:ring-goldLight"
                      } text-black text-sm md:text-base`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1 font-inter">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex flex-col items-center mt-8 space-y-5">
                <button
                  type="submit"
                  className="w-full md:w-[170px] h-[35px] bg-goldLight text-tertiary font-inter text-sm md:text-base rounded-md hover:opacity-90 cursor-pointer transition"
                >
                  Registrarse
                </button>

                <p className="text-tertiary text-sm md:text-base font-inter text-center">
                  ¿Ya eres miembro?{" "}
                  <Link to="/login" className="underline">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <div className="lg:w-1/2 hidden lg:flex items-center justify-center">
            <img
              src="/assets/images/card-rubi.png"
              alt="Carta Luz de Rubí"
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

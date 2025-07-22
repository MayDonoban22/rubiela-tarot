import { useNavigate, useLocation } from "react-router-dom";
import { setToken } from "../utils/token";
import { useContext } from "react";
import AppContext from "../contexts/AppContext";
import { Link } from "react-router-dom";
import HeaderAuthSimple from "../components/Header/HeaderAuthSimple";
import Footer from "../components/Footer/Footer";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn } = useContext(AppContext);

  const onSubmit = (data) => {
    console.log("Datos válidos:", data);

    // aquí iría la llamada real a una API
    const token = "jwt_simulado_luz_de_rubi";
    setToken(token);
    setIsLoggedIn(true);

    const redirectTo = location.state?.from?.pathname || "/agenda";
    navigate(redirectTo, { replace: true });
  };

  return (
    <>
      <HeaderAuthSimple variant="login" />
      <div className="bg-primary flex flex-col min-h-screen">
        <div className="flex flex-col lg:flex-row border border-[var(--color-goldLight)] flex-grow min-h-[92vh]">
          <div className="lg:w-1/2 hidden lg:flex items-center justify-center">
            <img
              src="/assets/images/card-rubi.png"
              alt="Carta Luz de Rubí"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:w-1/2 flex items-center justify-center border-l border-[var(--color-goldLight)] px-6 py-40">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-[526px] flex flex-col gap-14"
              noValidate
            >
              <h2 className="text-3xl md:text-4xl font-[abhaya] text-[#9E874D] text-center mb-4">
                Iniciar sesión
              </h2>

              <div className="flex flex-col">
                <label className="text-lg md:text-xl font-[abhaya] text-[#9E874D] mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E874D]" />
                  <input
                    type="email"
                    {...register("email")}
                    className={`pl-10 pr-3 block w-full h-[35px] bg-tertiary border rounded-md focus:outline-none focus:ring-2 text-black text-sm md:text-base ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-goldLight focus:ring-goldLight"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-lg md:text-xl font-[abhaya] text-[#9E874D] mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E874D]" />
                  <input
                    type="password"
                    {...register("password")}
                    className={`pl-10 pr-3 block w-full h-[35px] bg-tertiary border rounded-md focus:outline-none focus:ring-2 text-black text-sm md:text-base ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-goldLight focus:ring-goldLight"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center mt-8 space-y-5">
                <button
                  type="submit"
                  className="w-full md:w-[170px] h-[35px] bg-goldLight text-tertiary font-inter text-sm md:text-base rounded-md hover:opacity-90 cursor-pointer transition"
                >
                  Iniciar sesión
                </button>
                <p className="text-tertiary text-sm md:text-base font-inter text-center">
                  ¿Aún no eres miembro?{" "}
                  <Link to="/registro" className="underline">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;

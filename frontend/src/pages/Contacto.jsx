import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { contactSchema } from "../schemas";
import AppContext from "../contexts/AppContext";

function Contacto() {
  const [showPopup, setShowPopup] = useState(false);
  const { isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
    setShowPopup(true);
    reset();
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleAgendaClick = () => {
    if (isLoggedIn) {
      navigate("/agenda");
    } else {
      navigate("/login", { state: { from: { pathname: "/agenda" } } });
    }
  };

  return (
    <>
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full object-cover object-center absolute h-full"
        />
        <div
          className="relative inset-0 flex flex-col justify-center items-center text-tertiary
                        px-4 sm:px-6 md:px-10 lg:px-[65px] py-[44px]
                        gap-6 md:gap-8 lg:gap-10 z-10
                        text-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center max-w-[800px] px-2 mx-auto">
            <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Contacto
            </h1>
            <p className="text-[15px] md:text-[18px] lg:text-[22px] font-Abhaya leading-tight mt-4">
              Estoy aquí para guiarte en tu camino espiritual.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-[45px]">
        <div className="flex flex-col lg:flex-row gap-10 w-full max-w-[1200px] mt-[74px] mb-[106px]">
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md" />
            <div className="relative z-10 p-6 sm:p-8">
              <h3 className="text-[24px] md:text-[28px] font-Abhaya text-[#9E874D] mb-6">
                Envíame un mensaje
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-[14px] md:text-[15px] font-inter text-[#7C7C70]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="block w-full h-[35px] bg-tertiary border border-goldLight rounded-md mt-1 px-3 focus:outline-none focus:ring-2 focus:ring-goldLight"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[14px] md:text-[15px] font-inter text-[#7C7C70]">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="block w-full h-[35px] bg-tertiary border border-goldLight rounded-md mt-1 px-3 focus:outline-none focus:ring-2 focus:ring-goldLight"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[14px] md:text-[15px] font-inter text-[#7C7C70]">
                    Mensaje
                  </label>
                  <textarea
                    {...register("message")}
                    className="block w-full h-[120px] sm:h-[130px] bg-tertiary border border-goldLight rounded-md mt-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-[42px] bg-[#9E874D] text-tertiary font-inter text-[16px] rounded-md hover:opacity-90 transition cursor-pointer"
                >
                  Enviar Mensaje
                </button>
              </form>

              {showPopup && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white border border-goldLight text-center rounded-lg shadow-lg p-4 animate-fade-in-out z-20">
                  <p className="text-[16px] font-inter text-[#7C7C70]">
                    ¡Gracias por tu mensaje! Pronto te contactaremos por correo
                    electrónico.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="relative h-[auto]">
              <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md" />
              <div className="relative z-10 p-6 sm:p-8">
                <h3 className="text-[24px] md:text-[28px] font-Abhaya text-[#9E874D] mb-4">
                  Información de contacto
                </h3>
                {[
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: "rubiela@luzderubi.com",
                  },
                  {
                    icon: FaPhone,
                    label: "Teléfono",
                    value: "+57 (123) 456-7890",
                  },
                  {
                    icon: FaMapMarkerAlt,
                    label: "Ubicación",
                    value: "Bogotá, Colombia",
                  },
                  {
                    icon: FaClock,
                    label: "Horario de atención",
                    value: "Lunes a Sábado: 9:00 AM - 6:00 PM",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-3">
                    <item.icon className="text-[#9E874D] text-[18px]" />
                    <div>
                      <h4 className="text-[18px] md:text-[20px] font-Abhaya text-[#9E874D]">
                        {item.label}
                      </h4>
                      <p className="text-[14px] md:text-[16px] font-inter text-[#7C7C70]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[auto]">
              <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md" />
              <div className="relative z-10 p-6 sm:p-8">
                <h3 className="text-[24px] md:text-[28px] font-Abhaya text-[#9E874D] mb-4">
                  Consultas personalizadas
                </h3>
                <p className="text-[14px] md:text-[16px] font-inter text-[#7C7C70] mb-6">
                  Para una experiencia más personalizada, agenda una consulta
                  directamente a través de nuestro sistema de reservas.
                </p>
                <button
                  onClick={handleAgendaClick}
                  className="w-full md:w-[170px] h-[35px] bg-goldLight text-tertiary font-inter text-[16px] rounded-md hover:opacity-90 cursor-pointer transition"
                >
                  Agendar consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contacto;

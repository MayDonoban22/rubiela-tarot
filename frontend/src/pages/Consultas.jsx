import { FaMoon, FaHashtag, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

function Consultas() {
  return (
    <div className="w-full">
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full object-cover object-center absolute h-full"
        />
        <div
          className="relative inset-0 flex flex-col justify-center items-center text-tertiary px-4 sm:px-6 md:px-10 lg:px-[65px] py-[44px] gap-6 md:gap-8 
        lg:gap-10 z-10 text-shadow-[0_2px_4px_rgba(0,0,0,0.5)"
        >
          <div className="text-center max-w-[800px] px-2 mx-auto">
            <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Consultas Espirituales
            </h1>
            <p className="text-[15px] md:text-[18px] lg:text-[22px] font-Abhaya leading-tight mt-4">
              Descubre las respuestas que buscas con nuestras consultas
              personalizadas de tarot y guía espiritual.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-[50px] px-4 md:px-10 lg:px-[95px] text-center mb-[80px]">
        <h2 className="text-[36px] md:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] mb-10 mx-auto max-w-[800px]">
          Nuestros servicios
        </h2>

        <div className="flex flex-wrap justify-center gap-6 max-w-[1200px] mx-auto px-4">
          {[
            {
              icon: (
                <FaMoon className="text-[#B09245] w-[36px] h-[36px] mb-2" />
              ),
              title: "Lectura de Tarot",
              text: "Consulta completa con interpretación de cartas para resolver tus dudas.",
              duration: "60 min",
              price: "$80 USD",
            },
            {
              icon: (
                <FaHashtag className="text-[#B09245] w-[36px] h-[36px] mb-2" />
              ),
              title: "Numerología",
              text: "Análisis de los números que influyen en tu vida y destino.",
              duration: "30 min",
              price: "$50 USD",
            },
            {
              icon: (
                <FaStar className="text-[#B09245] w-[36px] h-[36px] mb-2" />
              ),
              title: "Rituales",
              text: "Rituales personalizados para atraer amor, prosperidad, salud o suerte.",
              duration: "60 min",
              price: "$140 USD",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="w-[95%] sm:w-[280px] md:w-[300px] lg:w-[340px] h-[230px] md:h-[250px] lg:h-[270px] rounded-xl bg-gradient-to-l from-primary to-secondary flex flex-col justify-between px-4 py-5 text-center"
            >
              <div className="flex flex-col items-center gap-2">
                {item.icon}
                <h3 className="text-[18px] md:text-[20px] text-[#B09245] font-Abhaya">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base lg:text-[17px] text-tertiary font-Abhaya px-1 leading-snug">
                  {item.text}
                </p>
              </div>
              <div className="flex justify-between items-end text-tertiary font-inter text-sm md:text-[14px] px-2 mt-3">
                <span>Duración: {item.duration}</span>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            to="/agenda"
            className="text-[20px] md:text-[24px] lg:text-[30px] font-inter text-[#7C7C70] hover:text-primary transition"
          >
            Selecciona un servicio para continuar con tu reserva
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Consultas;

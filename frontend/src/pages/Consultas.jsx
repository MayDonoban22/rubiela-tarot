import { FaMoon, FaHashtag, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

function Consultas() {
  return (
    <div className="w-full">
      <section className="relative w-full ">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between items-center text-tertiary">
          <div className="mt-[76px] px-[310px] text-center">
            <h1 className="text-[60px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Consultas Espirituales
            </h1>
          </div>

          <div className="mb-[71px] px-[350px] text-center">
            <p className="text-[24px] font-Abhaya">
              Descubre las respuestas que buscas con nuestras consultas
              personalizadas de tarot y guía espiritual.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-[71px] px-[95px] text-center mb-[98px]">
        <h2 className="text-[60px] font-Abhaya text-[#7C7C70] mb-10 mx-[338px]">
          Nuestros servicios
        </h2>
        <div className="flex flex-wrap justify-center gap-[30px] max-w-[1400px] mx-auto">
          {[
            {
              icon: (
                <FaMoon className="text-[#B09245] w-[60px] h-[60px] mb-4" />
              ),
              title: "Lectura de Tarot",
              text: "Consulta completa con interpretación de cartas para resolver tus dudas.",
              duration: "60 min",
              price: "$80 USD",
            },
            {
              icon: (
                <FaHashtag className="text-[#B09245] w-[60px] h-[60px] mb-4" />
              ),
              title: "Numerología",
              text: "Análisis de los números que influyen en tu vida y destino.",
              duration: "30 min",
              price: "$50 USD",
            },
            {
              icon: (
                <FaStar className="text-[#B09245] w-[60px] h-[60px] mb-4" />
              ),
              title: "Rituales",
              text: "Rituales personalizados para atraer amor, prosperidad, salud o suerte.",
              duration: "60 min",
              price: "$140 USD",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="w-[390px] h-[300px] rounded-xl bg-gradient-to-l from-primary to-secondary flex flex-col justify-between px-6 py-6 text-center"
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <h3 className="text-[24px] text-[#B09245] font-Abhaya mb-2">
                  {item.title}
                </h3>
                <p className="text-[18px] text-tertiary font-Abhaya">
                  {item.text}
                </p>
              </div>
              <div className="flex justify-between items-end text-tertiary font-inter text-[14px] px-2">
                <span>Duración: {item.duration}</span>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-18">
          <Link
            to="/agenda"
            className="text-[30px] font-inter text-[#7C7C70] hover:text-primary transition"
          >
            Selecciona un servicio para continuar con tu reserva
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Consultas;

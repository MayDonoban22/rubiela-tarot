import { Link } from "react-router-dom";
import {
  FaHeart,
  FaAmbulance,
  FaMoneyBillWave,
  FaStar,
  FaBook,
} from "react-icons/fa";

function Home() {
  return (
    <div className="w-full">
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-first-page.png"
          alt="Banner"
          className="w-full max-h-[900px] object-cover object-center absolute h-full"
        />
        <div className="relative inset-0 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-10 lg:px-[65px] py-[44px] gap-6 md:gap-8 lg:gap-10 z-10">
          <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[298px] lg:h-[298px] overflow-hidden rounded-full">
            <img
              src="/assets/images/profile-avatar.png"
              alt="Rubiela Pineda"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div
            className="flex flex-col items-center justify-center text-tertiary text-center max-w-[600px] gap-1 md:gap-1.5 lg:gap-2 px-2 pr-0 
          lg:pr-[171px] text-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            <h1
              className="text-[32px] md:text-[48px] lg:text-[70px] font-Abhaya text-[var(--color-goldLight)] uppercase leading-tight
            "
            >
              LUZ DE RUBÍ
            </h1>
            <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Rubiela
            </h2>
            <p className="text-[15px] md:text-[18px] lg:text-[22px] font-Abhaya leading-tight">
              Descubre tu camino espiritual después
            </p>
            <p className="text-[13px] md:text-[15px] lg:text-[18px] font-Abhaya leading-tight">
              Tarot • Consejería espiritual
            </p>
            <p className="text-[12px] md:text-[13px] lg:text-[14px] font-Abhaya leading-tight">
              Atracción al dinero • Trabajo • Amor • Suerte • Salud
            </p>

            <div className="mt-4 md:mt-5 w-full flex justify-center">
              <Link to="/agenda">
                <button className="px-6 py-2 rounded-md text-tertiary text-[14px] md:text-[16px] lg:text-[18px] font-semibold bg-gradient-to-r from-[var(--color-goldLight)] to-[var(--color-goldDark)] hover:shadow-lg transition cursor-pointer w-full md:w-auto">
                  Agendar Consulta
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[50px] px-4 md:px-10 lg:px-[95px] text-center mb-[80px]">
        <h2 className="text-[36px] md:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] mb-10 mx-auto max-w-[800px]">
          Nuestros servicios
        </h2>

        <div className="flex flex-wrap justify-center gap-6 max-w-[1200px] mx-auto">
          {[
            {
              icon: (
                <FaHeart className="text-[#B09245] w-[40px] h-[45px] mb-2" />
              ),
              title: "Amor",
              text: "Encuentra claridad en tus relaciones y camino al amor verdadero.",
            },
            {
              icon: (
                <FaAmbulance className="text-[#B09245] w-[40px] h-[45px] mb-2" />
              ),
              title: "Salud",
              text: "Orientación espiritual para mantener el bienestar físico y mental.",
            },
            {
              icon: (
                <FaMoneyBillWave className="text-[#B09245] w-[40px] h-[45px] mb-2" />
              ),
              title: "Prosperidad",
              text: "Guía para atraer abundancia y prosperidad económica en tu vida.",
            },
            {
              icon: (
                <FaStar className="text-[#B09245] w-[40px] h-[45px] mb-2" />
              ),
              title: "Suerte",
              text: "Atrae la buena fortuna y las energías positivas a tu vida y destino.",
            },
            {
              icon: (
                <FaBook className="text-[#B09245] w-[30px] h-[40px] mb-2" />
              ),
              title: "Oraciones personalizadas",
              text: "Oraciones adaptadas a tus necesidades espirituales específicas.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="w-[90%] sm:w-[300px] h-[200px] rounded-xl bg-gradient-to-l from-primary to-secondary flex flex-col items-center justify-center px-6 py-4 text-center"
            >
              {item.icon}
              <h3 className="text-[20px] md:text-[22px] text-[#B09245] font-Abhaya mb-1">
                {item.title}
              </h3>
              <p className="text-[16px] md:text-[18px] text-tertiary font-Abhaya">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

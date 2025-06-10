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
      <section className="relative w-full ">
        <img
          src="/assets/images/Frame-first-page.png"
          alt="Banner"
          className="w-full h-auto object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-between px-[65px] py-[44px]">
          <div className="w-[298px] h-[298px] overflow-hidden ">
            <img
              src="/assets/images/profile-avatar.png"
              alt="Rubiela Pineda"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between h-full pr-[171px] text-tertiary">
            <div className="space-y-2 text-left">
              <h1 className="text-[80px] font-Abhaya text-[var(--color-goldLight)] uppercase leading-none text-center">
                LUZ DE RUBÍ
              </h1>
              <h2 className="text-[35px] font-Abhaya text-[var(--color-goldLight)] text-center">
                Rubiela
              </h2>
              <p className="text-[25px] font-Abhaya text-center">
                Descubre tu camino espiritual después
              </p>
              <p className="text-[20px] font-Abhaya text-center">
                Tarot • Consejería espiritual
              </p>
              <p className="text-[15px] font-Abhaya text-center">
                Atracción al dinero • Trabajo • Amor • Suerte • Salud
              </p>
            </div>

            <div className="text-center">
              <Link to="/agenda">
                <button className="mt-4 px-6 py-2 rounded-md text-tertiary text-[16px] font-semibold bg-gradient-to-r from-[var(--color-goldLight)] to-[var(--color-goldDark)] hover:shadow-lg transition cursor-pointer">
                  Agendar Consulta
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[71px] px-[95px] text-center mb-[107px]">
        <h2 className="text-[60px] font-Abhaya text-[#7C7C70] mb-10 mx-[338px]">
          Nuestros servicios
        </h2>

        <div className="flex flex-wrap justify-center gap-[20px] max-w-[1200px] mx-auto">
          <div className="flex justify-center gap-[20px] w-full ">
            {[
              {
                icon: (
                  <FaHeart className="text-[#B09245] w-[45px] h-[50px] mb-2" />
                ),
                title: "Amor",
                text: "Encuentra claridad en tus relaciones y camino al amor verdadero.",
              },
              {
                icon: (
                  <FaAmbulance className="text-[#B09245] w-[45px] h-[50px] mb-2" />
                ),
                title: "Salud",
                text: "Orientación espiritual para mantener el bienestar físico y mental.",
              },
              {
                icon: (
                  <FaMoneyBillWave className="text-[#B09245] w-[45px] h-[50px] mb-2" />
                ),
                title: "Prosperidad",
                text: "Guía para atraer abundancia y prosperidad económica en tu vida.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="w-[300px] h-[200px] rounded-xl bg-gradient-to-l from-primary to-secondary flex flex-col items-center justify-center px-6 py-4 text-center"
              >
                {item.icon}
                <h3 className="text-[22px] text-[#B09245] font-Abhaya mb-1">
                  {item.title}
                </h3>
                <p className="text-[18px] text-tertiary font-Abhaya">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-[20px] w-full">
            {[
              {
                icon: (
                  <FaStar className="text-[#B09245] w-[45px] h-[55px] mb-2" />
                ),
                title: "Suerte",
                text: "Atrae la buena fortuna y las energías positivas a tu vida y destino.",
              },
              {
                icon: (
                  <FaBook className="text-[#B09245] w-[30px] h-[50px] mb-2" />
                ),
                title: "Oraciones personalizadas",
                text: "Oraciones adaptadas a tus necesidades espirituales específicas.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="w-[300px] h-[200px] rounded-xl bg-gradient-to-l from-primary to-secondary flex flex-col items-center justify-center px-6 py-4 text-center"
              >
                {item.icon}
                <h3 className="text-[22px] text-[#B09245] font-Abhaya mb-1">
                  {item.title}
                </h3>
                <p className="text-[18px] text-tertiary font-Abhaya">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

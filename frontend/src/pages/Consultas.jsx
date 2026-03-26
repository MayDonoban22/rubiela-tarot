import { FaMoon, FaHashtag, FaStar } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../contexts/AppContext";
import { getServices } from "../services/services";

function Consultas() {
  const { isLoggedIn } = useContext(AppContext);

  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const handleAgendaClick = () => {
    if (isLoggedIn) {
      navigate("/agenda");
    } else {
      navigate("/login", { state: { from: { pathname: "/agenda" } } });
    }
  };

  // cargar servicios backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();

        setServices(data);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar los servicios");
      }

      setLoading(false);
    };

    loadServices();
  }, []);

  // iconos por defecto (luego podemos hacer dinámico desde backend)
  const icons = [FaMoon, FaHashtag, FaStar];

  return (
    <div className="w-full">
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full object-cover object-center absolute h-full"
        />

        <div className="relative inset-0 flex flex-col justify-center items-center text-tertiary px-4 sm:px-6 md:px-10 lg:px-[65px] py-[44px] gap-6 md:gap-8 lg:gap-10 z-10">
          <div className="text-center max-w-[800px] px-2 mx-auto">
            <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-Abhaya text-[var(--color-goldLight)]">
              Consultas Espirituales
            </h1>

            <p className="text-[15px] md:text-[18px] lg:text-[22px] font-Abhaya mt-4">
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

        {/* loading */}

        {loading && (
          <p className="text-center text-lg">Cargando servicios...</p>
        )}

        {/* error */}

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-wrap justify-center gap-6 max-w-[1200px] mx-auto px-4">
          {services.map((item, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={item._id}
                className="w-[95%] sm:w-[280px] md:w-[300px] lg:w-[340px] h-[270px] rounded-xl bg-gradient-to-l from-primary to-secondary flex flex-col justify-between px-4 py-5 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="text-[#B09245] w-[36px] h-[36px] mb-2" />

                  <h3 className="text-[18px] md:text-[20px] text-[#B09245] font-Abhaya">
                    {item.nombre}
                  </h3>

                  <p className="text-sm md:text-base text-tertiary font-Abhaya px-1">
                    {item.descripcion}
                  </p>
                </div>

                <div className="flex justify-between items-end text-tertiary font-inter text-sm px-2">
                  <span>Duración: {item.duracion} min</span>

                  <strong>${item.precio}</strong>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <button
            onClick={handleAgendaClick}
            className="text-[20px] md:text-[24px] lg:text-[30px] font-inter text-[#7C7C70] cursor-pointer hover:text-primary transition underline"
          >
            Selecciona un servicio para continuar con tu reserva
          </button>
        </div>
      </section>
    </div>
  );
}

export default Consultas;

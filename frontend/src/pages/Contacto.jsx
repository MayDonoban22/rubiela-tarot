import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

function Contacto() {
  return (
    <>
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between items-center text-tertiary">
          <div className="mt-[76px] px-[310px] text-center">
            <h1 className="text-[60px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Contacto
            </h1>
          </div>
          <div className="mb-[71px] px-[350px] text-center">
            <p className="text-[24px] font-Abhaya">
              Estoy aquí para guiarte en tu camino espiritual.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center px-[45px]">
        <div className="flex gap-10">
          <div className="w-[610px] h-[640px] relative mt-[74px] mb-[106px]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md"></div>
            <div className="relative z-10 p-[30px]">
              <h3 className="text-[30px] font-Abhaya text-[#9E874D] mb-[27px]">
                Envíame un mensaje
              </h3>

              <div className="mb-[20px]">
                <label className="text-[15px] font-inter text-[#7C7C70]">
                  Nombre
                </label>
                <input
                  type="text"
                  className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
                />
              </div>

              <div className="mb-[20px]">
                <label className="text-[15px] font-inter text-[#7C7C70]">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
                />
              </div>

              <div className="mb-4">
                <label className="text-[15px] font-inter text-[#7C7C70]">
                  Mensaje
                </label>
                <textarea className="block w-[550px] h-[130px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-goldLight"></textarea>
              </div>

              <button className="w-[550px] h-[42px] cursor-pointer bg-[#9E874D] text-tertiary font-inter text-[20px] rounded-md">
                Enviar Mensaje
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-[74px] mb-[106px]">
            <div className="w-[610px] h-[411px] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md"></div>
              <div className="relative z-10 p-[30px]">
                <h3 className="text-[30px] font-Abhaya text-[#9E874D] mb-[20px]">
                  Información de contacto
                </h3>

                <div className="flex items-center gap-3 mb-1">
                  <FaEnvelope className="text-[#9E874D]" />
                  <h4 className="text-[22px] font-Abhaya text-[#9E874D]">
                    Email
                  </h4>
                </div>
                <p className="text-[17px] font-inter text-[#7C7C70] mb-4">
                  rubiela@luzderubi.com
                </p>

                <div className="flex items-center gap-3 mb-1">
                  <FaPhone className="text-[#9E874D]" />
                  <h4 className="text-[22px] font-Abhaya text-[#9E874D]">
                    Teléfono
                  </h4>
                </div>
                <p className="text-[17px] font-inter text-[#7C7C70] mb-4">
                  +57 (123) 456-7890
                </p>

                <div className="flex items-center gap-3 mb-1">
                  <FaMapMarkerAlt className="text-[#9E874D]" />
                  <h4 className="text-[22px] font-Abhaya text-[#9E874D]">
                    Ubicación
                  </h4>
                </div>
                <p className="text-[17px] font-inter text-[#7C7C70] mb-4">
                  Bogotá, Colombia
                </p>

                <div className="flex items-center gap-3 mb-1">
                  <FaClock className="text-[#9E874D]" />
                  <h4 className="text-[22px] font-Abhaya text-[#9E874D]">
                    Horario de atención
                  </h4>
                </div>
                <p className="text-[17px] font-inter text-[#7C7C70]">
                  Lunes a Sábado: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
            <div className="w-[610px] h-[206px] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md"></div>
              <div className="relative z-10 p-[30px]">
                <h3 className="text-[30px] font-Abhaya text-[#9E874D] mb-4">
                  Consultas personalizadas
                </h3>
                <p className="text-[17px] font-inter text-[#7C7C70] mb-4">
                  Para una experiencia más personalizada, agenda una consulta
                  directamente a través de nuestro sistema de reservas.
                </p>
                <Link to="/agenda">
                  <button className="w-[170px] h-[35px] cursor-pointer bg-goldLight text-tertiary font-inter text-[17px] rounded-md">
                    Agendar consulta
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contacto;

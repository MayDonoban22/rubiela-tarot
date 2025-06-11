import { useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

function Agenda() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  return (
    <section className="pt-[57px]">
      <h1 className="text-[60px] font-Abhaya text-[#7C7C70] text-center">
        Agenda tu Consulta
      </h1>
      <div className="w-[984px] relative mt-[42px] mb-[40px] mx-[228px]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md"></div>
        <div className="relative z-10 p-[40px]">
          <h3 className="text-[30px] font-Abhaya text-[#9E874D] mb-[27px]">
            Selecciona tu Servicio
          </h3>
          <div className="flex justify-center gap-[15px] mb-[30px]">
            {[
              {
                title: "Lectura de Tarot",
                price: "$80 USD",
                duration: "60 min",
              },
              {
                title: "Numerologia",
                price: "$50 USD",
                duration: "30 min",
              },
              {
                title: "Rituales",
                price: "$140 USD",
                duration: "60 min",
              },
            ].map((service, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedService(service)}
                className={`cursor-pointer w-[290px] h-[120px] rounded-xl p-4 text-left border ${
                  selectedService?.title === service.title
                    ? "border-goldLight bg-[#6C82B5]"
                    : "bg-[#526B9F] border-transparent hover:border-goldLight"
                } transition`}
              >
                <h3 className="text-[20px] font-Abhaya text-goldLight mb-2">
                  {service.title}
                </h3>
                <p className="text-white font-inter">{service.price}</p>
                <p className="text-white font-inter">{service.duration}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-between items-start gap-[20px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-[#9E874D]" />
                <h2 className="text-[30px] font-Abhaya text-[#9E874D]">
                  Fecha
                </h2>
              </div>
              <div className="relative w-[414px]">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
                />
                <FaCalendarAlt className="absolute right-3 top-[50%] -translate-y-1/2 text-[#9E874D] pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-[#9E874D]" />
                <h2 className="text-[30px] font-Abhaya text-[#9E874D]">Hora</h2>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-[7px]">
                {[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                ].map((hour, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedHour(hour)}
                    className={`cursor-pointer w-[120px] h-[40px] rounded-md font-inter text-black font-light border transition ${
                      selectedHour === hour
                        ? "bg-[#C3B08B] border-goldLight"
                        : "bg-tertiary border-transparent hover:border-goldLight"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedService && selectedDate && selectedHour && (
        <div className="w-[984px] bg-[#F7F5EB] border border-goldLight rounded-md p-[30px] mx-[228px] mb-[40px]">
          <h3 className="text-[24px] font-Abhaya text-[#9E874D] mb-2">
            Resumen de tu Cita
          </h3>
          <p className="text-[#7C7C70] font-inter">
            Servicio: <strong>{selectedService.title}</strong>
          </p>
          <p className="text-[#7C7C70] font-inter">
            Fecha: <strong>{selectedDate}</strong>
          </p>
          <p className="text-[#7C7C70] font-inter">
            Hora: <strong>{selectedHour}</strong>
          </p>
        </div>
      )}
      <div className="w-[984px] relative mb-[90px] mx-[228px]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md"></div>
        <div className="relative z-10 p-[30px]">
          <h3 className="text-[30px] font-Abhaya text-[#9E874D] mb-[27px]">
            Detalles de Pago
          </h3>

          <form className="space-y-4">
            <div>
              <label className="text-[15px] font-inter text-[#7C7C70]">
                Nombre completo
              </label>
              <input
                type="text"
                className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
              />
            </div>
            <div>
              <label className="text-[15px] font-inter text-[#7C7C70]">
                Número de tarjeta
              </label>
              <input
                type="text"
                className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
              />
            </div>
            <div>
              <label className="text-[15px] font-inter text-[#7C7C70]">
                Fecha de vencimiento
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
              />
            </div>
            <div>
              <label className="text-[15px] font-inter text-[#7C7C70]">
                Código de seguridad
              </label>
              <input
                type="text"
                placeholder="CVV"
                className="block w-full h-[30px] bg-tertiary border border-goldLight rounded-md mt-[7px] px-2 focus:outline-none focus:ring-2 focus:ring-goldLight"
              />
            </div>

            <button className="w-full cursor-pointer h-[42px] bg-goldLight text-tertiary font-inter rounded-md hover:opacity-90 transition mt-4">
              Confirmar Pago
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Agenda;

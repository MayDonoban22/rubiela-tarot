import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

import { agendaSchema } from "../schemas";
import { getServices } from "../services/services";
import { createTurno } from "../services/turnos";

import AppContext from "../contexts/AppContext";
import { getToken } from "../utils/token";

const hours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

function Agenda() {
  const { user } = useContext(AppContext);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(agendaSchema),

    defaultValues: {
      service: "",
      date: "",
      hour: "",
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const selectedService = watch("service");
  const _selectedDate = watch("date");
  const selectedHour = watch("hour");

  /* =========================
        LOAD SERVICES
  ========================= */

  useEffect(() => {
    const loadServices = async () => {
      const data = await getServices();

      setServices(data);

      setLoading(false);
    };

    loadServices();
  }, []);

  /* =========================
        SUBMIT
  ========================= */

  const onSubmit = async (data) => {
    try {
      const token = getToken();

      const turno = {
        service: data.service,
        date: data.date,
        hour: data.hour,
        userId: user?.id,
        name: data.name,
      };

      await createTurno(turno, token);

      setShowConfirmation(true);
    } catch (error) {
      setApiError(error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Cargando servicios...</div>;
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[65px] pt-[57px] relative">
      <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] text-center mb-8">
        Agenda tu Consulta
      </h1>

      {apiError && <p className="text-red-500 text-center">{apiError}</p>}

      <div className="relative max-w-[1000px] mx-auto mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md" />

        <div className="relative z-10 p-6 sm:p-8">
          <h3 className="text-[24px] sm:text-[30px] font-Abhaya text-[#9E874D] mb-6">
            Selecciona tu Servicio
          </h3>

          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 mb-8">
            {services.map((service) => (
              <button
                key={service._id}
                type="button"
                onClick={() => setValue("service", service.title)}
                className={`cursor-pointer w-[90%] sm:w-[280px] md:w-[300px] lg:w-[320px] h-[120px] sm:h-[140px] rounded-xl p-4 text-left border transition

${
  selectedService === service.title
    ? "border-goldLight bg-[#6C82B5]"
    : "bg-[#526B9F] border-transparent hover:border-goldLight"
}

`}
              >
                <h3 className="text-[18px] sm:text-[20px] font-Abhaya text-goldLight mb-1">
                  {service.title}
                </h3>

                <p className="text-white font-inter text-sm">{service.price}</p>

                <p className="text-white font-inter text-sm">
                  {service.duration}
                </p>
              </button>
            ))}
          </div>

          {errors.service && (
            <p className="text-red-500 text-sm text-center">
              {errors.service.message}
            </p>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-[#9E874D]" />

                <h2 className="text-[20px] sm:text-[24px] font-Abhaya text-[#9E874D]">
                  Fecha
                </h2>
              </div>

              <input
                type="date"
                {...register("date")}
                className="w-full h-[36px] bg-tertiary border border-goldLight rounded-md px-3"
              />

              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-[#9E874D]" />

                <h2 className="text-[20px] sm:text-[24px] font-Abhaya text-[#9E874D]">
                  Hora
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setValue("hour", hour)}
                    className={`w-full h-[36px] rounded-md border

${selectedHour === hour ? "bg-[#C3B08B]" : "bg-tertiary"}

`}
                  >
                    {hour}
                  </button>
                ))}
              </div>

              {errors.hour && (
                <p className="text-red-500 text-sm">{errors.hour.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[1000px] mx-auto p-8"
      >
        <button
          type="submit"
          className="w-full h-[42px] bg-goldLight text-tertiary rounded-md"
        >
          Confirmar Pago
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center">
          <div className="bg-white p-10 rounded-xl text-center">
            <h2>Tu cita fue confirmada</h2>

            <button onClick={() => setShowConfirmation(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Agenda;

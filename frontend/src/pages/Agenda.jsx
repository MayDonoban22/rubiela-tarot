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
  const selectedDate = watch("date");
  const selectedHour = watch("hour");

  /* ==========================
        LOAD SERVICES API
  ========================== */

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();

        setServices(data);
      } catch (error) {
        console.error(error);
        setApiError("No se pudieron cargar servicios");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  /* ==========================
        CREATE TURNO
  ========================== */

  const onSubmit = async (data) => {
    try {
      const token = getToken();

      const turno = {
        service: data.service,
        date: data.date,
        hour: data.hour,
        name: data.name,
        userId: user?.id,
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
    <section className="w-full px-4 sm:px-6 lg:px-[65px] pt-[57px]">
      <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] text-center mb-8">
        Agenda tu Consulta
      </h1>

      {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

      <div className="max-w-[1000px] mx-auto mb-12">
        <h3 className="text-[24px] font-Abhaya text-[#9E874D] mb-6">
          Selecciona tu Servicio
        </h3>

        <div className="flex flex-wrap justify-center gap-4">
          {services.map((service) => (
            <button
              key={service._id}
              type="button"
              onClick={() => setValue("service", service.title)}
              className={`w-[280px] h-[130px] rounded-xl p-4 border transition

${
  selectedService === service.title
    ? "border-goldLight bg-[#6C82B5]"
    : "bg-[#526B9F]"
}

`}
            >
              <h3 className="text-[20px] text-goldLight">{service.title}</h3>

              <p className="text-white">{service.price}</p>

              <p className="text-white">{service.duration}</p>
            </button>
          ))}
        </div>

        {errors.service && (
          <p className="text-red-500 text-center mt-2">
            {errors.service.message}
          </p>
        )}
      </div>

      <div className="max-w-[1000px] mx-auto mb-10 flex gap-10">
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <FaCalendarAlt />

            <h2>Fecha</h2>
          </div>

          <input
            type="date"
            {...register("date")}
            className="w-full h-[36px] border rounded px-3"
          />

          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <FaClock />

            <h2>Hora</h2>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => setValue("hour", hour)}
                className={`h-[36px] border rounded

${selectedHour === hour ? "bg-[#C3B08B]" : "bg-gray-100"}

`}
              >
                {hour}
              </button>
            ))}
          </div>

          {errors.hour && <p className="text-red-500">{errors.hour.message}</p>}
        </div>
      </div>

      {/* RESUMEN */}

      {selectedService && selectedDate && selectedHour && (
        <div className="max-w-[1000px] mx-auto bg-[#F7F5EB] border rounded p-6 mb-8">
          <h3 className="text-[22px] mb-3">Resumen de tu cita</h3>

          <p>
            Servicio:
            <strong>{selectedService}</strong>
          </p>

          <p>
            Fecha:
            <strong>{selectedDate}</strong>
          </p>

          <p>
            Hora:
            <strong>{selectedHour}</strong>
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[1000px] mx-auto space-y-4"
      >
        <input
          placeholder="Nombre"
          {...register("name")}
          className="w-full h-[36px] border rounded px-3"
        />

        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <button type="submit" className="w-full h-[42px] bg-goldLight rounded">
          Confirmar Reserva
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center">
          <div className="bg-white p-10 rounded-xl text-center">
            <h2>Tu cita fue confirmada</h2>

            <p>
              {selectedService}

              <br />

              {selectedDate}

              <br />

              {selectedHour}
            </p>

            <button onClick={() => setShowConfirmation(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Agenda;

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

import { agendaSchema } from "../schemas";
import { getServices } from "../services/services";
import { getAvailableHours } from "../services/availability";

function Agenda() {
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState([]);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(agendaSchema),
    defaultValues: {
      service: "",
      serviceName: "",
      date: "",
      hour: "",
      name: "",
    },
  });

  const selectedService = watch("service");
  const selectedDate = watch("date");
  const selectedHour = watch("hour");

  // Fecha local para evitar errores de zona horaria
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  // Cargar servicios
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();

        setServices(data.filter((service) => service.activo));
      } catch (error) {
        console.error("Error cargando servicios:", error);
        setApiError("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Cargar horarios disponibles
  useEffect(() => {
    setValue("hour", "");
    setHours([]);

    if (!selectedDate) return;

    let cancelled = false;

    const loadHours = async () => {
      try {
        setHoursLoading(true);
        setApiError(null);

        const data = await getAvailableHours(selectedDate);

        if (cancelled) return;

        if (!Array.isArray(data)) {
          throw new Error("Formato de horarios inválido");
        }

        setHours(data);

        if (data.length === 0) {
          setApiError(
            "No hay horarios disponibles para la fecha seleccionada.",
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error cargando horarios:", error);
          setApiError("No se pudieron cargar los horarios.");
        }
      } finally {
        if (!cancelled) setHoursLoading(false);
      }
    };

    loadHours();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, setValue]);

  const serviceDetails = services.find(
    (service) => service._id === selectedService,
  );

  if (loading) {
    return <div className="text-center mt-20">Cargando servicios...</div>;
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[65px] pt-[57px] pb-16">
      <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] text-center mb-8">
        Agenda tu Consulta
      </h1>

      {apiError && (
        <p role="alert" className="text-red-500 text-center mb-4">
          {apiError}
        </p>
      )}

      {/* SERVICIOS */}
      <div className="max-w-[1000px] mx-auto mb-12">
        <h2 className="text-[24px] font-Abhaya text-[#9E874D] mb-6">
          Selecciona tu Servicio
        </h2>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay servicios disponibles actualmente.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service) => (
              <button
                key={service._id}
                type="button"
                aria-pressed={selectedService === service._id}
                onClick={() => {
                  setValue("service", service._id, {
                    shouldValidate: true,
                  });

                  setValue("serviceName", service.nombre);
                  setApiError(null);
                }}
                className={`w-full sm:w-[280px] min-h-[160px] rounded-xl p-5 border transition text-left
                  ${
                    selectedService === service._id
                      ? "border-[#BB9B49] bg-[#3D578D] ring-2 ring-[#BB9B49]"
                      : "border-[#6C82B5] bg-[#526B9F] hover:bg-[#3D578D]"
                  }
                `}
              >
                <h3 className="text-[22px] font-Abhaya text-[#F5D78C] mb-2">
                  {service.nombre}
                </h3>

                <p className="text-white/90 text-sm mb-3">
                  {service.descripcion}
                </p>

                <p className="text-white">
                  Duración: {service.duracion} minutos
                </p>

                <p className="text-[#F5D78C] mt-2 font-semibold">
                  Precio: {service.precio}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FECHA Y HORARIO */}
      <div className="max-w-[1000px] mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarAlt />
            <h2 className="font-semibold">Fecha</h2>
          </div>

          <input
            type="date"
            min={today}
            {...register("date")}
            className="w-full h-11 border rounded-lg px-3"
          />

          {errors.date && (
            <p role="alert" className="text-red-500 mt-2">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaClock />
            <h2 className="font-semibold">Hora</h2>
          </div>

          {!selectedDate ? (
            <p className="text-gray-500">
              Selecciona una fecha para consultar los horarios.
            </p>
          ) : hoursLoading ? (
            <p className="text-gray-500">Cargando horarios...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  aria-pressed={selectedHour === hour}
                  onClick={() => {
                    setValue("hour", hour, {
                      shouldValidate: true,
                    });
                  }}
                  className={`min-h-10 border rounded-lg px-2 transition
                    ${
                      selectedHour === hour
                        ? "bg-[#BB9B49] text-[#111827] border-[#BB9B49]"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }
                  `}
                >
                  {hour}
                </button>
              ))}
            </div>
          )}

          {errors.hour && (
            <p role="alert" className="text-red-500 mt-2">
              {errors.hour.message}
            </p>
          )}
        </div>
      </div>

      {/* RESUMEN */}
      {serviceDetails && selectedDate && selectedHour && (
        <div className="max-w-[1000px] mx-auto bg-[#F7F5EB] border border-[#BB9B49] rounded-xl p-6 mb-8">
          <h2 className="text-[24px] font-Abhaya mb-4">Resumen de tu cita</h2>

          <div className="space-y-2">
            <p>
              <strong>Servicio: </strong>
              {serviceDetails.nombre}
            </p>

            <p>
              <strong>Fecha: </strong>
              {selectedDate}
            </p>

            <p>
              <strong>Hora: </strong>
              {selectedHour}
            </p>

            <p>
              <strong>Duración: </strong>
              {serviceDetails.duracion} minutos
            </p>

            <p>
              <strong>Precio: </strong>
              {serviceDetails.precio}
            </p>
          </div>
        </div>
      )}

      {/* PAGO PENDIENTE DE WOMPI */}
      <div className="max-w-[1000px] mx-auto space-y-4">
        <label className="block font-semibold" htmlFor="agenda-name">
          Nombre para la consulta
        </label>

        <input
          id="agenda-name"
          placeholder="Tu nombre completo"
          {...register("name")}
          className="w-full h-11 border rounded-lg px-3"
        />

        {errors.name && (
          <p role="alert" className="text-red-500">
            {errors.name.message}
          </p>
        )}

        <button
          type="button"
          disabled
          className="w-full h-12 rounded-lg bg-[#BB9B49] text-[#111827] font-semibold opacity-60 cursor-not-allowed"
        >
          Pago próximamente con Wompi
        </button>

        <p className="text-center text-sm text-gray-500">
          Estamos preparando el pago seguro de las consultas. Por ahora no se
          realizarán cobros ni reservas desde este formulario.
        </p>
      </div>
    </section>
  );
}

export default Agenda;

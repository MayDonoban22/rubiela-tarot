import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { agendaSchema } from "../schemas";

const services = [
  { title: "Lectura de Tarot", price: "$80 USD", duration: "60 min" },
  { title: "Numerologia", price: "$50 USD", duration: "30 min" },
  { title: "Rituales", price: "$140 USD", duration: "60 min" },
];

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

  const onSubmit = (data) => {
    console.log("Cita confirmada con:", data);
    setShowConfirmation(true);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[65px] pt-[57px] relative">
      <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-Abhaya text-[#7C7C70] text-center mb-8">
        Agenda tu Consulta
      </h1>
      <div className="relative max-w-[1000px] mx-auto mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md" />
        <div className="relative z-10 p-6 sm:p-8">
          <h3 className="text-[24px] sm:text-[30px] font-Abhaya text-[#9E874D] mb-6">
            Selecciona tu Servicio
          </h3>
          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 mb-8">
            {services.map((service, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setValue("service", service.title)}
                className={`cursor-pointer w-[90%] sm:w-[280px] md:w-[300px] lg:w-[320px] h-[120px] sm:h-[140px] rounded-xl p-4 text-left border transition
                  ${
                    selectedService === service.title
                      ? "border-goldLight bg-[#6C82B5]"
                      : "bg-[#526B9F] border-transparent hover:border-goldLight"
                  }`}
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
            <p className="text-red-500 text-sm mt-[-12px] mb-4 text-center">
              {errors.service.message}
            </p>
          )}
          <div className="flex flex-col lg:flex-row justify-between gap-6">
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
                className="w-full max-w-md h-[36px] bg-tertiary border border-goldLight rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-goldLight"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
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
                {hours.map((hour, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setValue("hour", hour)}
                    className={`cursor-pointer w-full h-[36px] rounded-md font-inter text-black text-sm border transition
                      ${
                        selectedHour === hour
                          ? "bg-[#C3B08B] border-goldLight"
                          : "bg-tertiary border-transparent hover:border-goldLight"
                      }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
              {errors.hour && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.hour.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedService && selectedDate && selectedHour && (
        <div className="max-w-[1000px] mx-auto bg-[#F7F5EB] border border-goldLight rounded-md p-6 sm:p-8 mb-8">
          <h3 className="text-[20px] sm:text-[24px] font-Abhaya text-[#9E874D] mb-2">
            Resumen de tu Cita
          </h3>
          <p className="font-inter text-[14px] sm:text-[16px]">
            Servicio: <strong>{selectedService}</strong>
          </p>
          <p className="font-inter text-[14px] sm:text-[16px]">
            Fecha: <strong>{selectedDate}</strong>
          </p>
          <p className="font-inter text-[14px] sm:text-[16px]">
            Hora: <strong>{selectedHour}</strong>
          </p>
        </div>
      )}
      <div className="relative max-w-[1000px] mx-auto mb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 rounded-md"></div>
        <form
          className="relative z-10 p-6 sm:p-8 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-[24px] sm:text-[28px] font-Abhaya text-[#9E874D] mb-6">
            Detalles de Pago
          </h3>
          <div>
            <label className="block text-[14px] sm:text-[15px] font-inter text-[#7C7C70] mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full h-[36px] bg-tertiary border border-goldLight rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-goldLight"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[14px] sm:text-[15px] font-inter text-[#7C7C70] mb-1">
              Número de tarjeta
            </label>
            <input
              type="text"
              {...register("cardNumber")}
              className="w-full h-[36px] bg-tertiary border border-goldLight rounded-md px-3"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardNumber.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-[14px] sm:text-[15px] font-inter text-[#7C7C70] mb-1">
              Fecha de vencimiento
            </label>
            <input
              type="text"
              placeholder="MM/AA"
              {...register("expiry")}
              className="w-full h-[36px] bg-tertiary border border-goldLight rounded-md px-3"
            />
            {errors.expiry && (
              <p className="text-red-500 text-sm mt-1">
                {errors.expiry.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-[14px] sm:text-[15px] font-inter text-[#7C7C70] mb-1">
              Código de seguridad
            </label>
            <input
              type="text"
              placeholder="CVV"
              {...register("cvv")}
              className="w-full h-[36px] bg-tertiary border border-goldLight rounded-md px-3"
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full h-[42px] bg-goldLight text-tertiary font-inter text-[16px] rounded-md hover:opacity-90 transition mt-4 cursor-pointer"
          >
            Confirmar Pago
          </button>
        </form>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#FFFDF7] rounded-2xl shadow-xl p-10 w-[90%] max-w-xl text-center animate-popIn">
            <h2 className="text-[26px] font-Abhaya text-[#9E874D] mb-4">
              ¡Tu cita ha sido confirmada!
            </h2>
            <p className="font-inter text-[16px] text-[#7C7C70] mb-6">
              Has reservado una <strong>{selectedService}</strong> para el día{" "}
              <strong>{selectedDate}</strong> a las{" "}
              <strong>{selectedHour}</strong>. Muy pronto recibirás un correo de
              confirmación.
            </p>
            <button
              className="bg-goldLight text-white px-6 py-2 rounded-md font-inter text-[16px] hover:opacity-90 transition cursor-pointer"
              onClick={() => setShowConfirmation(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Agenda;

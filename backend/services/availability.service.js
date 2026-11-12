
const Turno = require("../models/Turno");

// Zona horaria oficial para las consultas de Luz de Rubí
const TIME_ZONE = "America/Bogota";

// Horarios disponibles para las consultas
const ALL_HOURS = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"
];

// Obtener fecha y hora actuales en Colombia
const getColombiaDateTime = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return {
        date: `${values.year}-${values.month}-${values.day}`,
        time: `${values.hour}:${values.minute}`
    };
};

// Consultar los horarios libres para una fecha
const getAvailableHours = async (fecha) => {

    // Validar el formato YYYY-MM-DD
    if (
        typeof fecha !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {
        throw new Error(
            "La fecha debe tener el formato YYYY-MM-DD"
        );
    }

    // Mantener el mismo formato de fecha usado por
    // el controlador actual de reservas
    const fechaDate = new Date(`${fecha}T00:00:00.000Z`);

    if (
        Number.isNaN(fechaDate.getTime()) ||
        fechaDate.toISOString().slice(0, 10) !== fecha
    ) {
        throw new Error("Fecha inválida");
    }

    const current = getColombiaDateTime();

    // No ofrecer horarios de fechas anteriores
    if (fecha < current.date) {
        return [];
    }

    // Obtener reservas que siguen ocupando horarios
    const turnos = await Turno.find({
        fecha: fechaDate,
        estado: {
            $nin: ["cancelado", "expirado"]
        }
    }).select("hora");

    // Crear conjunto de horarios ocupados
    const bookedHours = new Set(
        turnos.map((turno) => turno.hora)
    );

    // Descartar horas ocupadas y horas pasadas
    const availableHours = ALL_HOURS.filter((hour) => {

        if (bookedHours.has(hour)) {
            return false;
        }

        // Si la consulta es hoy, no permitir horas pasadas
        if (fecha === current.date && hour <= current.time) {
            return false;
        }

        return true;
    });

    return availableHours;
};

module.exports = {
    getAvailableHours
};

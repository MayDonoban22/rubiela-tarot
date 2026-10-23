const Turno = require('../models/Turno');

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

const getAvailableHours = async (fecha) => {
    const fechaDate = new Date(fecha);

    if (Number.isNaN(fechaDate.getTime())) {
        throw new Error("Fecha inválida");
    }

    // Buscar reservas que todavía ocupan un horario
    const turnos = await Turno.find({
        fecha: fechaDate,
        estado: {
            $nin: ['cancelado', 'expirado']
        }
    });

    // Identificar horarios ocupados
    const bookedHours = new Set(
        turnos.map(turno => turno.hora)
    );

    // Devolver únicamente horarios disponibles
    const available = ALL_HOURS.filter(
        hour => !bookedHours.has(hour)
    );

    return available;
};

module.exports = {
    getAvailableHours
};
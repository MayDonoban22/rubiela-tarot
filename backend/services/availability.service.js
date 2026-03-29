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

    const turnos = await Turno.find({

        fecha: fechaDate,

        estado: { $ne: 'cancelado' }

    });

    const bookedHours = turnos.map(

        t => t.hora

    );

    const available = ALL_HOURS.filter(

        hour => !bookedHours.includes(hour)

    );

    return available;

};

module.exports = {

    getAvailableHours

};
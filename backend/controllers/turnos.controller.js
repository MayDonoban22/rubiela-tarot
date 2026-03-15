const Turno = require('../models/Turno');
const Service = require('../models/Service');


// ADMIN
const getAllTurnos = async (req, res, next) => {
    try {

        const turnos = await Turno.find()
            .populate('user', 'name email role')
            .populate('servicio', 'nombre precio');

        res.json(turnos);

    } catch (error) {
        next(error);
    }
};


// USER
const createTurno = async (req, res, next) => {
    try {

        const { fecha, hora, servicio } = req.body;


        // validar servicio existe
        const servicioDB = await Service.findById(servicio);

        if (!servicioDB) {
            return res.status(404).json({
                message: "Servicio no existe"
            });
        }


        // validar servicio activo
        if (!servicioDB.activo) {
            return res.status(400).json({
                message: "Servicio no disponible"
            });
        }


        // validar horario ocupado
        const turnoExistente = await Turno.findOne({
            fecha,
            hora,
            servicio
        });

        if (turnoExistente) {
            return res.status(400).json({
                message: 'Este horario ya está ocupado'
            });
        }


        const turno = await Turno.create({

            fecha,
            hora,
            servicio,
            user: req.user.id

        });


        res.status(201).json({

            message: 'Turno creado correctamente',
            turno,

        });

    } catch (error) {
        next(error);
    }
};


// USER
const getMyTurnos = async (req, res, next) => {
    try {

        const turnos = await Turno.find({

            user: req.user.id

        })
            .populate('servicio')
            .populate('user', 'name email');

        res.json(turnos);

    } catch (error) {
        next(error);
    }
};


// ADMIN
const updateTurnoStatus = async (req, res, next) => {
    try {

        const { estado } = req.body;

        const validateState = [
            'pendiente',
            'pagado',
            'cancelado'
        ];

        if (!validateState.includes(estado)) {

            return res.status(400).json({

                message: "Estado no válido"

            });
        }


        const turno = await Turno.findByIdAndUpdate(

            req.params.id,

            { estado },

            { new: true }

        );


        res.json({

            message: "Estado del turno actualizado",

            turno

        });

    } catch (error) {

        next(error);

    }
};


module.exports = {

    getAllTurnos,
    createTurno,
    getMyTurnos,
    updateTurnoStatus

};
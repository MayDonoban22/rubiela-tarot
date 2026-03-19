const Turno = require('../models/Turno');
const Service = require('../models/Service');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');


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

        // Enviar email de confirmación
        // obtener usuario

        const user = await User.findById(req.user.id);


        // EMAIL USUARIO

        try {
            await sendEmail(

                user.email,

                "Confirmación de turno - Luz de Rubí",

                `
    <h2>Tu turno fue agendado correctamente</h2>

    <p><strong>Servicio:</strong> ${servicioDB.nombre}</p>

    <p><strong>Fecha:</strong> ${fecha}</p>

    <p><strong>Hora:</strong> ${hora}</p>

    <p>Gracias por confiar en Luz de Rubí.</p>
    `
            );

        } catch (error) {

            console.log("Email failed");
        }

        // EMAIL ADMIN

        try {
            await sendEmail(

                process.env.ADMIN_EMAIL,

                "Nuevo turno reservado",

                `
    <h2>Nuevo turno reservado</h2>

    <p><strong>Cliente:</strong> ${user.name}</p>

    <p><strong>Email:</strong> ${user.email}</p>

    <p><strong>Servicio:</strong> ${servicioDB.nombre}</p>

    <p><strong>Fecha:</strong> ${fecha}</p>

    <p><strong>Hora:</strong> ${hora}</p>
    `
            );

        } catch (error) {

            console.log("Email failed");
        }
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

// USER cancelar turno
const cancelTurno = async (req, res, next) => {

    try {

        const turno = await Turno.findById(req.params.id);

        if (!turno) {

            return res.status(404).json({

                message: "Turno no encontrado"

            });

        }

        // validar dueño
        if (turno.user.toString() !== req.user.id) {

            return res.status(403).json({

                message: "No autorizado"

            });

        }


        // no cancelar si está pagado
        if (turno.estado === 'pagado') {

            return res.status(400).json({

                message: "Un turno pagado no puede cancelarse"

            });

        }


        // evitar doble cancelación
        if (turno.estado === 'cancelado') {

            return res.status(400).json({

                message: "Este turno ya está cancelado"

            });

        }


        turno.estado = "cancelado";

        await turno.save();
        const user = await User.findById(turno.user);

        try {

            await sendEmail(

                user.email,

                "Turno cancelado",

                `
        <h2>Tu turno fue cancelado</h2>

        <p>Fecha: ${turno.fecha}</p>

        <p>Hora: ${turno.hora}</p>

        <p>Si necesitas reagendar puedes hacerlo desde tu panel.</p>

        `

            );

        } catch (error) {

            console.log("Email failed");

        }

        res.json({

            message: "Turno cancelado correctamente",

            turno

        });

    } catch (error) {

        next(error);

    }

};

// USER reagendar turno
const rescheduleTurno = async (req, res, next) => {

    try {

        const { fecha, hora } = req.body;

        const turno = await Turno.findById(req.params.id);

        if (!turno) {

            return res.status(404).json({

                message: "Turno no encontrado"

            });

        }


        // validar dueño
        if (turno.user.toString() !== req.user.id) {

            return res.status(403).json({

                message: "No autorizado"

            });

        }


        // no reagendar cancelados
        if (turno.estado === 'cancelado') {

            return res.status(400).json({

                message: "No se puede reagendar un turno cancelado"

            });

        }


        // validar horario ocupado
        const ocupado = await Turno.findOne({

            fecha,
            hora,
            servicio: turno.servicio

        });


        if (ocupado) {

            return res.status(400).json({

                message: "Ese horario ya está ocupado"

            });

        }


        turno.fecha = fecha;
        turno.hora = hora;

        await turno.save();

        const user = await User.findById(turno.user);

        try {

            await sendEmail(

                user.email,

                "Turno reagendado",

                `
        <h2>Tu turno fue reagendado</h2>

        <p>Nueva fecha: ${fecha}</p>

        <p>Nueva hora: ${hora}</p>

`

            );

        } catch (error) {

            console.log("Email failed");

        }

        res.json({

            message: "Turno reagendado correctamente",

            turno

        });

    } catch (error) {

        next(error);

    }

};

// ADMIN
const updateTurnoStatus = async (req, res, next) => {
    try {

        const { estado } = req.body;

        if (!estado) {

            return res.status(400).json({

                message: "Debe enviar estado"

            });

        }

        const validateState = [
            'pendiente',
            'pagado',
            'cancelado',
            'completado'
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
    updateTurnoStatus,
    cancelTurno,
    rescheduleTurno
};
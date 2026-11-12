
const Turno = require("../models/Turno");
const Service = require("../models/Service");
const User = require("../models/User.model");
const sendEmail = require("../utils/sendEmail");
const availabilityService = require("../services/availability.service");

// Zona horaria de las consultas
const TIME_ZONE = "America/Bogota";

// Obtener fecha y hora actuales en Colombia
const getColombiaNow = () => {
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

// Validar una fecha en formato YYYY-MM-DD
const parseDate = (fecha) => {
    if (
        typeof fecha !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {
        return null;
    }

    const parsed = new Date(`${fecha}T00:00:00.000Z`);

    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== fecha
    ) {
        return null;
    }

    return parsed;
};

// Validar que la fecha y hora sean futuras
const isFutureSlot = (fecha, hora) => {
    const now = getColombiaNow();

    if (fecha < now.date) return false;

    if (fecha === now.date && hora <= now.time) {
        return false;
    }

    return true;
};

// Consultar disponibilidad antes de reservar
const isAvailable = async (fecha, hora) => {
    const hours = await availabilityService.getAvailableHours(
        fecha
    );

    return hours.includes(hora);
};

// Enviar avisos sin interrumpir la respuesta de la API
const sendNotification = async (email, subject, html) => {
    if (!email) return;

    try {
        await sendEmail(email, subject, html);
    } catch (error) {
        console.error(
            "No se pudo enviar la notificación:",
            error.message
        );
    }
};

// ADMIN: consultar reservas
const getAllTurnos = async (req, res, next) => {
    try {
        const { estado } = req.query;

        const filter = estado ? { estado } : {};

        const turnos = await Turno.find(filter)
            .populate("user", "name email role")
            .populate("servicio", "nombre precio")
            .sort({ fecha: 1, hora: 1 });

        return res.json(turnos);
    } catch (error) {
        next(error);
    }
};

// USER: crear reserva pendiente de pago
const createTurno = async (req, res, next) => {
    try {
        const { fecha, hora, servicio } = req.body;

        const fechaDate = parseDate(fecha);

        if (!fechaDate) {
            return res.status(400).json({
                message: "La fecha es inválida."
            });
        }

        if (
            typeof hora !== "string" ||
            !/^\d{2}:\d{2}$/.test(hora)
        ) {
            return res.status(400).json({
                message: "La hora es inválida."
            });
        }

        if (!isFutureSlot(fecha, hora)) {
            return res.status(400).json({
                message:
                    "Debes seleccionar una fecha y hora futuras."
            });
        }

        if (!servicio) {
            return res.status(400).json({
                message: "Debes seleccionar un servicio."
            });
        }

        const servicioDB = await Service.findById(
            servicio
        ).catch(() => null);

        if (!servicioDB) {
            return res.status(404).json({
                message: "El servicio no existe."
            });
        }

        if (!servicioDB.activo) {
            return res.status(400).json({
                message: "El servicio no está disponible."
            });
        }

        const available = await isAvailable(fecha, hora);

        if (!available) {
            return res.status(409).json({
                message:
                    "Este horario no está disponible. Selecciona otro."
            });
        }

        // Tiempo máximo inicial de reserva
        const PAYMENT_TIMEOUT_MINUTES = 30;

        const paymentExpiresAt = new Date(
            Date.now() +
            PAYMENT_TIMEOUT_MINUTES * 60 * 1000
        );

        // La reserva todavía NO está confirmada
        const turno = await Turno.create({
            fecha: fechaDate,
            hora,
            servicio: servicioDB._id,
            user: req.user.id,
            estado: "pendiente",
            paymentStatus: "PENDING",
            paymentExpiresAt
        });

        // No enviar correo de confirmación antes del pago.
        // La confirmación se implementará con Wompi.

        return res.status(201).json({
            message:
                "Reserva pendiente de pago. La cita aún no está confirmada.",
            turno,
            paymentStatus: turno.paymentStatus
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Otro cliente acaba de reservar ese horario. Selecciona uno diferente."
            });
        }

        next(error);
    }
};

// USER: consultar sus reservas
const getMyTurnos = async (req, res, next) => {
    try {
        const turnos = await Turno.find({
            user: req.user.id
        })
            .populate("servicio")
            .populate("user", "name email")
            .sort({ fecha: 1, hora: 1 });

        return res.json(turnos);
    } catch (error) {
        next(error);
    }
};

// USER: cancelar una reserva
const cancelTurno = async (req, res, next) => {
    try {
        const turno = await Turno.findById(req.params.id);

        if (!turno) {
            return res.status(404).json({
                message: "Turno no encontrado."
            });
        }

        if (turno.user.toString() !== String(req.user.id)) {
            return res.status(403).json({
                message: "No autorizado."
            });
        }

        if (turno.estado === "cancelado") {
            return res.status(409).json({
                message: "Este turno ya está cancelado."
            });
        }

        if (
            turno.estado === "completado" ||
            turno.estado === "expirado"
        ) {
            return res.status(409).json({
                message:
                    "Esta reserva ya no puede cancelarse."
            });
        }

        // Un pago existente requiere una política de reembolso.
        if (turno.paymentStatus === "PAID") {
            return res.status(409).json({
                message:
                    "Esta reserva está pagada. Solicita la cancelación al administrador."
            });
        }

        // No liberar un horario con un pago en verificación.
        if (
            turno.paymentProcessing ||
            turno.paymentAttemptId ||
            turno.paymentSessionId
        ) {
            return res.status(409).json({
                message:
                    "Existe un intento de pago que requiere verificación antes de cancelar."
            });
        }

        const motivo =
            typeof req.body?.motivo === "string"
                ? req.body.motivo.trim()
                : "";

        // Condición atómica para evitar cancelar
        // una reserva cuyo estado haya cambiado.
        const actualizado = await Turno.findOneAndUpdate(
            {
                _id: turno._id,
                user: req.user.id,
                estado: turno.estado,
                paymentStatus: { $ne: "PAID" },
                paymentProcessing: { $ne: true },
                paymentAttemptId: null,
                paymentSessionId: null
            },
            {
                $set: {
                    estado: "cancelado",
                    motivoCancelacion:
                        motivo || "Cancelado por usuario"
                }
            },
            { new: true }
        );

        if (!actualizado) {
            return res.status(409).json({
                message:
                    "La reserva cambió de estado. Actualiza e inténtalo de nuevo."
            });
        }

        const user = await User.findById(req.user.id);

        if (user?.email) {
            await sendNotification(
                user.email,
                "Reserva cancelada - Luz de Rubí",
                `
                    <h2>Tu reserva fue cancelada</h2>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                `.replace(
                    "${fecha}",
                    actualizado.fecha.toISOString().slice(0, 10)
                ) + `
                    <p><strong>Hora:</strong> ${actualizado.hora}</p>
                    <p>Gracias por comunicarte con Luz de Rubí.</p>
                `
            );
        }

        return res.json({
            message: "Reserva cancelada correctamente.",
            turno: actualizado
        });

    } catch (error) {
        next(error);
    }
};

// USER: reagendar una reserva confirmada
const rescheduleTurno = async (req, res, next) => {
    try {
        const { fecha, hora } = req.body;

        const fechaDate = parseDate(fecha);

        if (!fechaDate) {
            return res.status(400).json({
                message: "Fecha inválida."
            });
        }

        if (
            typeof hora !== "string" ||
            !/^\d{2}:\d{2}$/.test(hora) ||
            !isFutureSlot(fecha, hora)
        ) {
            return res.status(400).json({
                message: "Selecciona una hora futura válida."
            });
        }

        const turno = await Turno.findById(req.params.id);

        if (!turno) {
            return res.status(404).json({
                message: "Turno no encontrado."
            });
        }

        if (turno.user.toString() !== String(req.user.id)) {
            return res.status(403).json({
                message: "No autorizado."
            });
        }

        // No modificar una reserva mientras se paga.
        if (
            turno.estado !== "confirmado" &&
            turno.estado !== "reagendado"
        ) {
            return res.status(409).json({
                message:
                    "Solo puedes reagendar reservas confirmadas."
            });
        }

        if (turno.paymentStatus !== "PAID") {
            return res.status(409).json({
                message:
                    "La reserva debe tener el pago confirmado para reagendarse."
            });
        }

        const fechaActual = turno.fecha
            .toISOString()
            .slice(0, 10);

        if (fechaActual === fecha && turno.hora === hora) {
            return res.status(409).json({
                message:
                    "Ya tienes una reserva en ese horario."
            });
        }

        if (!(await isAvailable(fecha, hora))) {
            return res.status(409).json({
                message:
                    "El horario seleccionado no está disponible."
            });
        }

        const actualizado = await Turno.findOneAndUpdate(
            {
                _id: turno._id,
                user: req.user.id,
                estado: turno.estado,
                paymentStatus: "PAID",
                fecha: turno.fecha,
                hora: turno.hora
            },
            {
                $set: {
                    estado: "reagendado",
                    reagendadoPara: {
                        fecha: fechaDate,
                        hora
                    },
                    fecha: fechaDate,
                    hora
                }
            },
            { new: true }
        );

        if (!actualizado) {
            return res.status(409).json({
                message:
                    "La reserva cambió de estado. Intenta nuevamente."
            });
        }

        const user = await User.findById(req.user.id);

        if (user?.email) {
            await sendNotification(
                user.email,
                "Reserva reagendada - Luz de Rubí",
                `
                    <h2>Tu consulta fue reagendada</h2>
                    <p><strong>Nueva fecha:</strong> ${fecha}</p>
                    <p><strong>Nueva hora:</strong> ${hora}</p>
                    <p>Gracias por confiar en Luz de Rubí.</p>
                `
            );
        }

        return res.json({
            message: "Reserva reagendada correctamente.",
            turno: actualizado
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Otro cliente acaba de ocupar ese horario."
            });
        }

        next(error);
    }
};

// ADMIN: modificar estado de una reserva
const updateTurnoStatus = async (req, res, next) => {
    try {
        const { estado, notas } = req.body;

        const validStates = [
            "pendiente",
            "confirmado",
            "completado",
            "cancelado",
            "reagendado",
            "no_asistio",
            "expirado"
        ];

        if (!validStates.includes(estado)) {
            return res.status(400).json({
                message: "Estado no válido."
            });
        }

        const turno = await Turno.findById(req.params.id);

        if (!turno) {
            return res.status(404).json({
                message: "Turno no encontrado."
            });
        }

        // El administrador no puede declarar un pago
        // realizado modificando solamente el estado.
        if (
            ["confirmado", "completado", "reagendado", "no_asistio"]
                .includes(estado) &&
            turno.paymentStatus !== "PAID"
        ) {
            return res.status(409).json({
                message:
                    "La reserva no tiene un pago confirmado."
            });
        }

        // Evitar cancelar o expirar reservas pagadas
        // sin gestionar previamente el reembolso.
        if (
            ["cancelado", "expirado"].includes(estado) &&
            turno.paymentStatus === "PAID"
        ) {
            return res.status(409).json({
                message:
                    "La reserva está pagada y requiere revisión administrativa."
            });
        }

        // Los intentos de pago necesitan conciliación.
        if (
            ["cancelado", "expirado"].includes(estado) &&
            (
                turno.paymentProcessing ||
                turno.paymentAttemptId ||
                turno.paymentSessionId
            )
        ) {
            return res.status(409).json({
                message:
                    "Debes verificar el intento de pago antes de liberar el horario."
            });
        }

        // Reagendar exige definir otra fecha y hora.
        if (
            estado === "reagendado" &&
            turno.estado !== "reagendado"
        ) {
            return res.status(409).json({
                message:
                    "Utiliza el proceso de reagendamiento para cambiar la fecha."
            });
        }

        turno.estado = estado;

        if (typeof notas === "string") {
            turno.notasAdmin = notas.trim();
        }

        await turno.save();

        return res.json({
            message: "Estado del turno actualizado.",
            turno
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Conflicto con otro horario reservado."
            });
        }

        next(error);
    }
};

// Consultar horarios disponibles
const getAvailableHours = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!parseDate(date)) {
            return res.status(400).json({
                message:
                    "Debes proporcionar una fecha válida en formato YYYY-MM-DD."
            });
        }

        const hours =
            await availabilityService.getAvailableHours(date);

        return res.json(hours);

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
    rescheduleTurno,
    getAvailableHours
};

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

// Condiciones para liberar una reserva sin riesgo de cobros.
// null también coincide con campos ausentes en documentos antiguos.
const noPaymentAttempt = () => ({
    paymentProcessing: { $ne: true },
    paymentProvider: null,
    paymentAttemptId: null,
    paymentReference: null,
    paymentTransactionId: null,
    wompiTransactionStatus: null,
    paymentSessionId: null
});

const hasPaymentAttempt = (turno) => (
    turno.paymentProcessing === true ||
    [
        turno.paymentProvider,
        turno.paymentAttemptId,
        turno.paymentReference,
        turno.paymentTransactionId,
        turno.wompiTransactionStatus,
        turno.paymentSessionId
    ].some(value => value != null)
);

// Un fallo de correo o de búsqueda del usuario no debe convertir
// una actualización exitosa de la reserva en un error HTTP.
const notifyUser = async (userId, subject, html) => {
    try {
        const user = await User.findById(userId);
        if (user?.email) {
            await sendNotification(user.email, subject, html);
        }
    } catch (error) {
        console.error("Error preparando notificación:", error.message);
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

        if (turno.paymentStatus === "PAID") {
            return res.status(409).json({
                message: "Esta reserva está pagada. Solicita la cancelación al administrador."
            });
        }

        if (turno.estado !== "pendiente") {
            return res.status(409).json({
                message: "Solo puedes cancelar reservas pendientes sin pago iniciado."
            });
        }

        if (turno.paymentStatus !== "PENDING" || hasPaymentAttempt(turno)) {
            return res.status(409).json({
                message: "El pago requiere verificación antes de cancelar."
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
                estado: "pendiente",
                paymentStatus: "PENDING",
                ...noPaymentAttempt()
            },
            {
                $set: {
                    estado: "cancelado",
                    motivoCancelacion:
                        motivo || "Cancelado por usuario"
                }
            },
            { new: true, runValidators: true }
        );

        if (!actualizado) {
            return res.status(409).json({
                message:
                    "La reserva cambió de estado. Actualiza e inténtalo de nuevo."
            });
        }

        await notifyUser(
            req.user.id,
            "Reserva cancelada - Luz de Rubí",
            `
                <h2>Tu reserva fue cancelada</h2>
                <p><strong>Fecha:</strong> ${actualizado.fecha.toISOString().slice(0, 10)}</p>
                <p><strong>Hora:</strong> ${actualizado.hora}</p>
                <p>Gracias por comunicarte con Luz de Rubí.</p>
            `
        );

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
            { new: true, runValidators: true }
        );

        if (!actualizado) {
            return res.status(409).json({
                message:
                    "La reserva cambió de estado. Intenta nuevamente."
            });
        }

        await notifyUser(
            req.user.id,
            "Reserva reagendada - Luz de Rubí",
            `
                <h2>Tu consulta fue reagendada</h2>
                <p><strong>Nueva fecha:</strong> ${fecha}</p>
                <p><strong>Nueva hora:</strong> ${hora}</p>
                <p>Gracias por confiar en Luz de Rubí.</p>
            `
        );

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

        // No reabrir reservas cerradas ni confirmar pagos manualmente.
        // El webhook verificará y confirmará el pago de Wompi.
        const filter = {
            _id: turno._id,
            estado: turno.estado,
            fecha: turno.fecha,
            hora: turno.hora
        };
        const changes = {};

        if (estado !== turno.estado) {
            if (
                turno.estado === "pendiente" &&
                ["cancelado", "expirado"].includes(estado)
            ) {
                if (
                    turno.paymentStatus !== "PENDING" ||
                    hasPaymentAttempt(turno)
                ) {
                    return res.status(409).json({
                        message: "Debes verificar el pago antes de liberar el horario."
                    });
                }

                Object.assign(filter, {
                    paymentStatus: "PENDING",
                    ...noPaymentAttempt()
                });

                // Solo expirar si el plazo realmente terminó.
                if (estado === "expirado") {
                    const now = new Date();
                    if (!turno.paymentExpiresAt || turno.paymentExpiresAt > now) {
                        return res.status(409).json({
                            message: "El plazo de pago todavía no ha vencido o no está registrado."
                        });
                    }
                    filter.paymentExpiresAt = { $type: "date", $lte: now };
                }

                changes.estado = estado;
                if (estado === "cancelado") {
                    changes.motivoCancelacion = "Cancelado por administrador";
                }
            } else if (
                ["confirmado", "reagendado"].includes(turno.estado) &&
                ["completado", "no_asistio"].includes(estado) &&
                turno.paymentStatus === "PAID"
            ) {
                filter.paymentStatus = "PAID";
                changes.estado = estado;
            } else {
                return res.status(409).json({
                    message: "Cambio de estado no permitido. Los pagos y reembolsos requieren verificación."
                });
            }
        }

        if (typeof notas === "string") {
            changes.notasAdmin = notas.trim();
        }

        if (Object.keys(changes).length === 0) {
            return res.json({
                message: "No hay cambios para aplicar.",
                turno
            });
        }

        // La condición se comprueba en la misma operación de escritura.
        const actualizado = await Turno.findOneAndUpdate(
            filter,
            { $set: changes },
            { new: true, runValidators: true }
        );

        if (!actualizado) {
            return res.status(409).json({
                message: "La reserva cambió de estado. Actualiza e inténtalo nuevamente."
            });
        }

        return res.json({
            message: "Estado del turno actualizado.",
            turno: actualizado
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
const fs = require("fs");
const path = require("path");
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../utils/AppError");
const {
    clientConfirmation,
    adminNotification,
} = require("../utils/contactEmailTemplates");

// backend/ y frontend/ son carpetas hermanas en el repositorio.
const LOGO_PATH = path.resolve(
    __dirname,
    "../../frontend/public/assets/images/logo-oficial.png"
);

const logoAttachment = () => {
    if (!fs.existsSync(LOGO_PATH)) {
        throw new Error(`No se encontró el logo para correos: ${LOGO_PATH}`);
    }
    return [{ filename: "logo-oficial.png", path: LOGO_PATH, cid: "luzderubi-logo" }];
};

const getMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        return res.json(messages);
    } catch (error) {
        return next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body || {};

        if ([name, email, message].some((v) => typeof v !== "string")) {
            return next(new AppError("Nombre, correo y mensaje deben ser textos válidos.", 400));
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();

        if (!cleanName || !cleanEmail || !cleanMessage) {
            return next(new AppError("Todos los campos son obligatorios.", 400));
        }
        if (cleanName.length > 100 || cleanEmail.length > 254 || cleanMessage.length > 3000) {
            return next(new AppError("Alguno de los campos supera la longitud permitida.", 400));
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return next(new AppError("Ingresa un correo electrónico válido.", 400));
        }

        // La confirmación HTTP significa mensaje guardado, no entrega de correo garantizada.
        const saved = await Contact.create({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage,
        });
        console.log("✅ Mensaje de contacto guardado:", saved._id);

        // Cada correo tiene su propio manejo de errores: no perdemos el mensaje.
        try {
            const template = clientConfirmation({ name: cleanName });
            await sendEmail(cleanEmail, template.subject, template.html, {
                text: template.text,
                attachments: logoAttachment(),
            });
            console.log("✅ Correo de confirmación aceptado por SMTP.");
        } catch (error) {
            console.error("❌ Falló el correo de confirmación:", error.message);
        }

        try {
            if (!process.env.ADMIN_EMAIL) throw new Error("ADMIN_EMAIL sin configurar.");
            const template = adminNotification({
                name: cleanName,
                email: cleanEmail,
                message: cleanMessage,
            });
            await sendEmail(process.env.ADMIN_EMAIL, template.subject, template.html, {
                text: template.text,
                replyTo: cleanEmail,
                attachments: logoAttachment(),
            });
            console.log("✅ Correo administrativo aceptado por SMTP.");
        } catch (error) {
            console.error("❌ Falló la notificación administrativa:", error.message);
        }

        return res.status(201).json({
            message: "Hemos recibido tu mensaje correctamente. Te responderemos lo antes posible.",
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = { getMessages, sendMessage };
const nodemailer = require("nodemailer");

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("EMAIL_USER y EMAIL_PASS deben estar configurados.");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// El cuarto argumento es opcional: conserva compatibilidad con llamadas anteriores.
// Permite enviar imágenes embebidas (CID), replyTo y texto alternativo.
const sendEmail = async (to, subject, html, options = {}) => {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
        from: `"Luz de Rubí" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: options.text,
        replyTo: options.replyTo,
        attachments: options.attachments || [],
    });

    console.log("Correo aceptado por SMTP:", info.messageId);
    return info;
};

module.exports = sendEmail;
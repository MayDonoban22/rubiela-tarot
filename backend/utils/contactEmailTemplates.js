// Plantillas de correo para Luz de Rubí.
// HTML con estilos en línea: mejora la compatibilidad con Gmail y otros clientes.

const escapeHTML = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);

const layout = ({ eyebrow, title, content, footer }) => `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHTML(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F6F0;font-family:Arial,Helvetica,sans-serif;color:#192846;">
  <div style="display:none;font-size:1px;color:#F8F6F0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHTML(eyebrow)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8F6F0;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#FFFFFF;border:1px solid #E6DBCA;border-radius:16px;overflow:hidden;">
        <tr><td align="center" style="padding:26px 28px 22px;background-color:#101827;">
          <img src="cid:luzderubi-logo" width="94" height="94" alt="Logo oficial Luz de Rubí" style="width:94px;height:94px;object-fit:contain;border:0;display:block;margin:0 auto 10px;" />
          <div style="font-family:Georgia,serif;font-size:30px;color:#D6B967;line-height:1.1;">Luz de Rubí</div>
          <div style="font-size:10px;letter-spacing:2px;color:#E8D8B5;margin-top:10px;">ORIENTACIÓN Y CONEXIÓN ESPIRITUAL</div>
        </td></tr>
        <tr><td style="padding:35px 32px 24px;">
          <div style="color:#94783F;font-size:11px;letter-spacing:2px;font-weight:bold;text-transform:uppercase;">${escapeHTML(eyebrow)}</div>
          <h1 style="font-family:Georgia,serif;font-size:29px;line-height:1.22;color:#192846;margin:12px 0 22px;font-weight:normal;">${escapeHTML(title)}</h1>
          <div style="font-size:15px;line-height:1.8;color:#505D70;">${content}</div>
        </td></tr>
        <tr><td style="padding:0 32px;"><div style="height:1px;background-color:#E7D4AC;"></div></td></tr>
        <tr><td style="padding:23px 32px 29px;font-size:12px;line-height:1.8;color:#707785;">
          ${footer}
        </td></tr>
      </table>
      <div style="font-size:11px;line-height:1.7;color:#8B8F98;margin-top:15px;">Luz de Rubí · Atención espiritual personalizada</div>
    </td></tr>
  </table>
</body>
</html>`;

const clientConfirmation = ({ name }) => {
    const safeName = escapeHTML(name);
    return {
        subject: "Recibimos tu mensaje | Luz de Rubí",
        html: layout({
            eyebrow: "Confirmación de contacto",
            title: "Tu mensaje ha llegado a nosotros",
            content: `
        <p style="margin:0 0 16px;">Hola, <strong style="color:#192846;">${safeName}</strong>:</p>
        <p style="margin:0 0 16px;">Gracias por escribirnos y por confiar en <strong>Luz de Rubí</strong>.</p>
        <p style="margin:0 0 16px;">Hemos recibido tu mensaje correctamente. Lo revisaremos con atención y te responderemos lo antes posible.</p>
        <p style="margin:0 0 22px;">Valoramos tu confianza y el tiempo que dedicaste a comunicarte con nosotros.</p>
        <p style="margin:0;color:#192846;">Con cariño,<br><strong>Rubiela Pineda Cortés</strong><br><span style="font-size:13px;color:#94783F;">Guía espiritual · Luz de Rubí</span></p>
      `,
            footer: "Este es un mensaje automático que confirma la recepción de tu solicitud. No necesitas responder a este correo.",
        }),
        text: `Hola, ${name}:\n\nGracias por escribir a Luz de Rubí. Recibimos tu mensaje y te responderemos lo antes posible.\n\nRubiela Pineda Cortés\nGuía espiritual · Luz de Rubí`,
    };
};

const adminNotification = ({ name, email, message }) => {
    const safeName = escapeHTML(name);
    const safeEmail = escapeHTML(email);
    const safeMessage = escapeHTML(message).replace(/\r\n|\r|\n/g, "<br>");
    return {
        subject: "Nueva solicitud de contacto | Luz de Rubí",
        html: layout({
            eyebrow: "Panel administrativo · Nuevo mensaje",
            title: "Tienes una nueva solicitud",
            content: `
        <p style="margin:0 0 12px;"><strong style="color:#192846;">Nombre:</strong> ${safeName}</p>
        <p style="margin:0 0 20px;"><strong style="color:#192846;">Correo:</strong> ${safeEmail}</p>
        <div style="font-weight:bold;color:#192846;margin-bottom:8px;">Mensaje recibido</div>
        <div style="padding:18px;background:#F8F6F0;border:1px solid #E6DBCA;border-radius:10px;overflow-wrap:anywhere;white-space:normal;">${safeMessage}</div>
        <p style="font-size:13px;color:#94783F;margin:21px 0 0;">Estado inicial: nuevo · También disponible en MongoDB</p>
      `,
            footer: "Esta notificación fue generada automáticamente por el formulario de Contacto de Luz de Rubí.",
        }),
        text: `Nuevo mensaje de contacto en Luz de Rubí\n\nNombre: ${name}\nCorreo: ${email}\nMensaje: ${message}\n\nEstado: nuevo`,
    };
};

module.exports = { clientConfirmation, adminNotification };
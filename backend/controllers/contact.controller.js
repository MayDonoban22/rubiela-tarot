const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

const getMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {

    try {

        const { name, email, message } = req.body;

        if (!name || !email || !message) {

            return res.status(400).json({

                message: "Todos los campos son obligatorios"

            });

        }


        const newMessage = await Contact.create({

            name,
            email,
            message

        });


        // EMAIL USER
        try {

            await sendEmail(

                email,

                "Hemos recibido tu mensaje",

                `
<h2>Hola ${name}</h2>

<p>Gracias por contactar a Luz de Rubí.</p>

<p>Tu mensaje fue recibido correctamente.</p>

<p>Te responderemos pronto.</p>

`

            );

        } catch (error) {

            console.log("User email failed");

        }


        // EMAIL ADMIN
        try {

            await sendEmail(

                process.env.EMAIL_USER,

                "Nuevo mensaje contacto",

                `
<h2>Nuevo mensaje</h2>

<p>Nombre: ${name}</p>

<p>Email: ${email}</p>

<p>Mensaje:</p>

<p>${message}</p>

`

            );

        } catch (error) {

            console.log("Admin email failed");

        }



        res.status(201).json({

            message: "Mensaje enviado correctamente",

            newMessage

        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getMessages,
    sendMessage
};
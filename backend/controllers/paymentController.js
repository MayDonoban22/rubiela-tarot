const Turno = require("../models/Turno");

const Service = require("../models/Service");

const { createCheckoutSession } = require("../services/stripeService");

const createPaymentSession = async (req, res) => {

    try {

        const { turnoId } = req.params;

        const turno = await Turno.findById(turnoId);

        if (!turno) {

            return res.status(404).json({

                message: "Turno no encontrado"

            });

        }

        const service = await Service.findById(turno.servicio);

        const session = await createCheckoutSession(turno, service);

        turno.paymentSessionId = session.id;

        await turno.save();

        res.json({

            url: session.url

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Error creando sesión pago"

        });

    }

};

module.exports = {

    createPaymentSession

};
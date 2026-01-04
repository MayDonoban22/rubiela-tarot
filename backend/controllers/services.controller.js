const Service = require('../models/Service');
const AppError = require('../utils/AppError');

const crearServicio = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, duracion } = req.body;

        if (!nombre || !descripcion || !precio || !duracion) {
            return next(new AppError('Todos los campos son obligatorios', 400));
        }

        const servicio = await Service.create({
            nombre,
            descripcion,
            precio,
            duracion
        });

        res.status(201).json({
            message: 'Servicio creado correctamente',
            servicio
        });
    } catch (error) {
        next(error);
    }
};

const listarServicios = async (req, res, next) => {
    try {
        const servicios = await Service.find();
        res.json(servicios);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    crearServicio,
    listarServicios
};

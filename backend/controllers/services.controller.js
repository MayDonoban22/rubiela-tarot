const Service = require('../models/Service');
const AppError = require('../utils/AppError');


// ADMIN — Crear servicio
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
            duracion,
            activo: true
        });

        res.status(201).json({
            message: 'Servicio creado correctamente',
            servicio
        });

    } catch (error) {
        next(error);
    }
};


// USER — Ver servicios activos
const listarServicios = async (req, res, next) => {
    try {

        const servicios = await Service.find({
            activo: true
        });

        res.json(servicios);

    } catch (error) {
        next(error);
    }
};


// ADMIN — Ver todos
const listarServiciosAdmin = async (req, res, next) => {
    try {

        const servicios = await Service.find();

        res.json(servicios);

    } catch (error) {
        next(error);
    }
};


// ADMIN — Activar / desactivar
const toggleServicio = async (req, res, next) => {
    try {

        const servicio = await Service.findById(req.params.id);

        if (!servicio) {
            return next(new AppError('Servicio no encontrado', 404));
        }

        servicio.activo = !servicio.activo;

        await servicio.save();

        res.json({
            message: "Estado actualizado",
            servicio
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    crearServicio,
    listarServicios,
    listarServiciosAdmin,
    toggleServicio
};
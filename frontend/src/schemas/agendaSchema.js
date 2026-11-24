
import * as yup from "yup";

// =====================================
// FECHA ACTUAL EN COLOMBIA
// =====================================

const getColombiaToday = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value]),
    );

    return `${values.year}-${values.month}-${values.day}`;
};

// =====================================
// VALIDAR FECHA REAL
// =====================================

const isValidDate = (value) => {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false;
    }

    const parsed = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
    );
};

// =====================================
// ESQUEMA DE LA AGENDA
// =====================================

export const agendaSchema = yup.object({
    service: yup
        .string()
        .required("Debes seleccionar un servicio."),

    serviceName: yup
        .string()
        .default(""),

    date: yup
        .string()
        .required("Debes seleccionar una fecha.")
        .test(
            "fecha-valida",
            "Selecciona una fecha válida.",
            (value) => !value || isValidDate(value),
        )
        .test(
            "fecha-futura",
            "La fecha no puede ser anterior a hoy.",
            (value) =>
                !value ||
                !isValidDate(value) ||
                value >= getColombiaToday(),
        ),

    hour: yup
        .string()
        .required("Debes seleccionar un horario.")
        .matches(
            /^([01]\d|2[0-3]):[0-5]\d$/,
            "Selecciona un horario válido.",
        ),

    name: yup
        .string()
        .trim()
        .required("Tu nombre es obligatorio.")
        .min(2, "El nombre debe tener al menos 2 caracteres.")
        .max(100, "El nombre no puede superar 100 caracteres."),
});

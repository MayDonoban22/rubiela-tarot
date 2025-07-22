import * as yup from "yup";

export const agendaSchema = yup.object().shape({
    service: yup
        .string()
        .required("Debes seleccionar un servicio"),
    date: yup
        .

        string()
        .required("Debes seleccionar una fecha")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha no válido")
        .test("fecha-valida", "La fecha no puede ser anterior a hoy", value => {
            if (!value) return false;
            const selected = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Quitar hora para comparar solo fechas
            return selected >= today;
        }),
    hour: yup
        .string()
        .required("Debes seleccionar una hora"),
    name: yup
        .string()
        .required("El nombre es obligatorio")
        .min(2, "Debe tener al menos 2 caracteres"),
    cardNumber: yup
        .string()
        .required("Número de tarjeta obligatorio")
        .matches(/^\d{13,19}$/, "Número de tarjeta inválido"),
    expiry: yup
        .string()
        .required("Fecha de vencimiento obligatoria")
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Formato debe ser MM/AA"),
    cvv: yup
        .string()
        .required("CVV obligatorio")
        .matches(/^[0-9]{3,4}$/, "Código de seguridad inválido"),
});
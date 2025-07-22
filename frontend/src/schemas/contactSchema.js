import * as yup from "yup";

export const contactSchema = yup.object().shape({
    name: yup
        .string()
        .required("El nombre es obligatorio")
        .min(2, "Debe tener al menos 2 caracteres"),
    email: yup
        .string()
        .required("El correo es obligatorio")
        .email("Debe ser un correo válido"),
    message: yup
        .string()
        .required("El mensaje es obligatorio")
        .min(4, "El mensaje debe tener al menos 4 caracteres"),
});

import * as yup from "yup";
import yupPassword from "yup-password";

yupPassword(yup);

// Validaciones para crear una cuenta
export const registerSchema = yup.object({
    nombre: yup
        .string()
        .trim()
        .required("El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .matches(
            /^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/,
            "El nombre solo puede contener letras y espacios"
        ),

    email: yup
        .string()
        .trim()
        .required("El correo electrónico es obligatorio")
        .email("Ingresa un correo electrónico válido"),

    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .minLowercase(1, "Debe contener al menos una letra minúscula")
        .minUppercase(1, "Debe contener al menos una letra mayúscula")
        .minNumbers(1, "Debe contener al menos un número"),
});

// Validaciones para iniciar sesión
export const loginSchema = yup.object({
    email: yup
        .string()
        .trim()
        .required("El correo electrónico es obligatorio")
        .email("Ingresa un correo electrónico válido"),

    password: yup
        .string()
        .required("La contraseña es obligatoria"),
});

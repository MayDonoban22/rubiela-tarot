import * as yup from "yup";
import yupPassword from "yup-password";

yupPassword(yup);

export const registerSchema = yup.object({
    nombre: yup
        .string()
        .required("El nombre es obligatorio")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo se permiten letras")
        .min(2, "Debe tener al menos 2 caracteres"),

    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("Correo electrónico inválido"),

    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(4, "Debe tener al menos 4 caracteres")
        .minLowercase(1, "Debe tener al menos una minúscula")
        // .minUppercase(1, "Debe tener al menos una mayúscula")
        .minNumbers(1, "Debe tener al menos un número")
    // .minSymbols(1, "Debe tener al menos un símbolo"),
});

export const loginSchema = yup.object({
    email: yup
        .string()
        .required("El correo electrónico es obligatorio")
        .email("Correo electrónico inválido"),

    password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(4, "Debe tener al menos 4 caracteres")
        .minLowercase(1, "Debe tener al menos una minúscula")
        // .minUppercase(1, "Debe tener al menos una mayúscula")
        .minNumbers(1, "Debe tener al menos un número")
    // .minSymbols(1, "Debe tener al menos un símbolo"),
});

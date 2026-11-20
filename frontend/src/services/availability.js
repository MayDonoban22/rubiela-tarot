
const API = import.meta.env.VITE_API_URL;

// Consultar los horarios disponibles para una fecha
export const getAvailableHours = async (date) => {
    if (!API) {
        throw new Error(
            "La URL del servidor no está configurada."
        );
    }

    if (!date) {
        throw new Error(
            "Debes seleccionar una fecha."
        );
    }

    try {
        const response = await fetch(
            `${API}/turnos/available?date=${encodeURIComponent(date)}`
        );

        if (!response.ok) {
            throw new Error(
                `No se pudieron consultar los horarios. Código: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "El servidor devolvió un formato de horarios inesperado."
            );
        }

        return data;

    } catch (error) {
        console.error(
            "Error consultando disponibilidad:",
            error
        );

        throw error;
    }
};


const API = import.meta.env.VITE_API_URL;

// Obtener los servicios disponibles desde el backend
export const getServices = async () => {
    if (!API) {
        throw new Error(
            "La URL del servidor no está configurada."
        );
    }

    try {
        const response = await fetch(`${API}/servicios`);

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar los servicios. Código: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "El servidor devolvió un formato de servicios inesperado."
            );
        }

        return data;

    } catch (error) {
        console.error("Error obteniendo servicios:", error);
        throw error;
    }
};

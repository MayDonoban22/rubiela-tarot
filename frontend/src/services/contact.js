
const API = import.meta.env.VITE_API_URL;

// Enviar un mensaje al backend de Luz de Rubí.
export const sendContactMessage = async (data) => {
    if (!API) {
        throw new Error(
            "La URL del servidor no está configurada."
        );
    }

    try {
        const response = await fetch(`${API}/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name.trim(),
                email: data.email.trim(),
                message: data.message.trim(),
            }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.message ||
                "No fue posible enviar tu mensaje. Inténtalo nuevamente."
            );
        }

        return result;
    } catch (error) {
        console.error("Error enviando mensaje de contacto:", error);
        throw error;
    }
};

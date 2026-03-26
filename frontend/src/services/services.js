const API = import.meta.env.VITE_API_URL;

export const getServices = async () => {

    try {

        const response = await fetch(`${API}/services`);

        if (!response.ok) {

            throw new Error("Error cargando servicios");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        return [];

    }

};
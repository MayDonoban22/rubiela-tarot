const API = import.meta.env.VITE_API_URL;

export const getAvailableHours = async (date) => {

    const response = await fetch(

        `${API}/turnos/available?date=${date}`

    );

    if (!response.ok) {

        throw new Error("Error obteniendo horarios");

    }

    return response.json();

};
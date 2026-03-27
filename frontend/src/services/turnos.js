const API = import.meta.env.VITE_API_URL;

export const createTurno = async (data, token) => {

    const response = await fetch(`${API}/turnos`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

        },

        body: JSON.stringify(data)

    });

    const result = await response.json();

    if (!response.ok) {

        throw new Error(result.message);

    }

    return result;

};
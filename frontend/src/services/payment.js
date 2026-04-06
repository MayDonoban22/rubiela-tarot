const API = import.meta.env.VITE_API_URL;

export const createPaymentSession = async (turnoId, token) => {

    const response = await fetch(

        `${API}/payments/create-session/${turnoId}`,

        {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    const result = await response.json();

    if (!response.ok) {

        throw new Error(result.message);

    }

    return result;

};
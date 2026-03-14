const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;

export function fetchHoroscope(signo) {
    const url = `https://api.api-ninjas.com/v1/horoscope?zodiac=${signo}`;
    return fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        });
}

// Moneda original de los servicios
const BASE_CURRENCY = "USD";

// Moneda utilizada por Wompi Colombia
const PAYMENT_CURRENCY = "COP";

// Obtener la tasa de cambio para pruebas
const getExchangeRate = () => {
    if (process.env.WOMPI_ENV !== "sandbox") {
        throw new Error(
            "La conversión de prueba solo está permitida en Sandbox."
        );
    }

    const rate = Number(
        process.env.USD_TO_COP_TEST_RATE
    );

    if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error(
            "La tasa de cambio USD/COP no es válida."
        );
    }

    return {
        rate,
        source: "SANDBOX_FIXED_RATE",
        quotedAt: new Date().toISOString()
    };
};

// Convertir el precio original de USD a COP
const convertUsdToCop = (priceUsd) => {

    if (
        typeof priceUsd !== "number" ||
        !Number.isFinite(priceUsd) ||
        priceUsd <= 0
    ) {
        throw new Error(
            "El precio del servicio en USD no es válido."
        );
    }

    // Validar el precio original en centavos de USD
    const amountInUsdCents = Math.round(priceUsd * 100);

    if (
        !Number.isSafeInteger(amountInUsdCents) ||
        Math.abs(priceUsd * 100 - amountInUsdCents) > 0.000001
    ) {
        throw new Error(
            "El precio debe tener máximo dos decimales."
        );
    }

    // Obtener tasa de cambio
    const exchange = getExchangeRate();

    // Calcular el valor en pesos colombianos
    const amountInCop = Math.round(
        (amountInUsdCents / 100) * exchange.rate
    );

    // Wompi recibe el importe en centavos
    const amountInCents = amountInCop * 100;

    if (
        !Number.isSafeInteger(amountInCents) ||
        amountInCents <= 0
    ) {
        throw new Error(
            "El importe convertido no es válido."
        );
    }

    // Guardar los datos originales de la conversión
    return {
        originalAmount: amountInUsdCents / 100,
        originalCurrency: BASE_CURRENCY,

        convertedAmount: amountInCop,
        convertedCurrency: PAYMENT_CURRENCY,

        amountInCents,

        exchangeRate: exchange.rate,
        exchangeRateSource: exchange.source,
        quotedAt: exchange.quotedAt
    };
};

module.exports = {
    getExchangeRate,
    convertUsdToCop
};

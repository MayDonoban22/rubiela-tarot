
const { createHash, randomUUID } = require("crypto");

// Moneda admitida por Wompi Colombia
const CURRENCY = "COP";

// Obtener configuración de Wompi
const getWompiConfig = () => {
    const environment = process.env.WOMPI_ENV;
    const apiUrl = process.env.WOMPI_API_URL;
    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    // Por seguridad, durante el desarrollo
    // solamente permitiremos el entorno Sandbox.
    if (environment !== "sandbox") {
        throw new Error(
            "Solamente se permiten pagos de prueba en Sandbox."
        );
    }

    if (apiUrl !== "https://sandbox.wompi.co/v1") {
        throw new Error(
            "La URL de Wompi Sandbox no es válida."
        );
    }

    if (
        !publicKey ||
        !publicKey.startsWith("pub_test_") ||
        !integritySecret ||
        !integritySecret.startsWith("test_integrity_")
    ) {
        throw new Error(
            "Las credenciales de Wompi Sandbox no están configuradas."
        );
    }

    return {
        environment,
        apiUrl,
        publicKey,
        integritySecret
    };
};

// Generar referencia única para cada intento de pago
const generatePaymentReference = () => {
    return `LDR-${randomUUID()}`;
};

// Generar firma de integridad SHA-256
const generateIntegritySignature = ({
    reference,
    amountInCents,
    expirationTime
}) => {
    const { integritySecret } = getWompiConfig();

    if (
        typeof reference !== "string" ||
        !/^[A-Za-z0-9_-]{1,255}$/.test(reference)
    ) {
        throw new Error(
            "Referencia de pago inválida."
        );
    }

    if (
        !Number.isSafeInteger(amountInCents) ||
        amountInCents <= 0
    ) {
        throw new Error(
            "El importe del pago no es válido."
        );
    }

    if (
        typeof expirationTime !== "string" ||
        Number.isNaN(Date.parse(expirationTime)) ||
        new Date(expirationTime).toISOString() !== expirationTime ||
        Date.parse(expirationTime) <= Date.now()
    ) {
        throw new Error(
            "La fecha de expiración del pago no es válida."
        );
    }

    // Orden exigido por Wompi:
    // referencia + importe + moneda +
    // expiración + secreto de integridad
    const signatureData =
        `${reference}${amountInCents}${CURRENCY}` +
        `${expirationTime}${integritySecret}`;

    return createHash("sha256")
        .update(signatureData, "utf8")
        .digest("hex");
};

// Preparar los parámetros del Widget de Wompi
const prepareCheckout = ({
    reference,
    amountInCents,
    expirationTime
}) => {
    const { publicKey } = getWompiConfig();

    const integrity = generateIntegritySignature({
        reference,
        amountInCents,
        expirationTime
    });

    // Solamente devolver información pública al frontend.
    return {
        currency: CURRENCY,
        amountInCents,
        reference,
        publicKey,
        expirationTime,
        signature: {
            integrity
        }
    };
};

// Consultar una transacción directamente en Wompi
const getTransaction = async (transactionId) => {
    const { apiUrl, publicKey } = getWompiConfig();

    if (
        typeof transactionId !== "string" ||
        !/^[A-Za-z0-9_-]+$/.test(transactionId)
    ) {
        throw new Error(
            "Identificador de transacción inválido."
        );
    }

    const response = await fetch(
        `${apiUrl}/transactions/${encodeURIComponent(transactionId)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${publicKey}`,
                Accept: "application/json"
            },
            signal: AbortSignal.timeout(10000)
        }
    );

    if (!response.ok) {
        throw new Error(
            `Error consultando Wompi. Código: ${response.status}`
        );
    }

    const result = await response.json();

    if (
        !result.data ||
        result.data.id !== transactionId
    ) {
        throw new Error(
            "Respuesta de transacción inválida."
        );
    }

    return result.data;
};

module.exports = {
    getWompiConfig,
    generatePaymentReference,
    generateIntegritySignature,
    prepareCheckout,
    getTransaction
};

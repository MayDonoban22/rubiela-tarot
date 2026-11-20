
const {
    createHash,
    randomUUID,
    timingSafeEqual
} = require("crypto");

const CURRENCY = "COP";

// =====================================
// CONFIGURACIÓN DE WOMPI
// =====================================

const getWompiConfig = () => {
    const environment = process.env.WOMPI_ENV;
    const apiUrl = process.env.WOMPI_API_URL;
    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    // Por ahora, únicamente permitimos Sandbox.
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
        !publicKey?.startsWith("pub_test_") ||
        !integritySecret?.startsWith("test_integrity_")
    ) {
        throw new Error(
            "Las credenciales de Wompi no están configuradas."
        );
    }

    return {
        environment,
        apiUrl,
        publicKey,
        integritySecret
    };
};

// =====================================
// REFERENCIA ÚNICA DEL PAGO
// =====================================

const generatePaymentReference = () => {
    return `LDR-${randomUUID()}`;
};

// =====================================
// FIRMA DE INTEGRIDAD DEL CHECKOUT
// =====================================

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
        throw new Error("Referencia de pago inválida.");
    }

    if (
        !Number.isSafeInteger(amountInCents) ||
        amountInCents <= 0
    ) {
        throw new Error("Importe de pago inválido.");
    }

    if (
        typeof expirationTime !== "string" ||
        Number.isNaN(Date.parse(expirationTime)) ||
        new Date(expirationTime).toISOString() !== expirationTime ||
        Date.parse(expirationTime) <= Date.now()
    ) {
        throw new Error(
            "Fecha de expiración inválida."
        );
    }

    const signatureData =
        `${reference}${amountInCents}${CURRENCY}` +
        `${expirationTime}${integritySecret}`;

    return createHash("sha256")
        .update(signatureData, "utf8")
        .digest("hex");
};

// =====================================
// PREPARAR WIDGET DE WOMPI
// =====================================

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

// =====================================
// CONSULTAR TRANSACCIÓN CON LLAVE PRIVADA
// =====================================

const getTransaction = async (transactionId) => {

    const { apiUrl } = getWompiConfig();

    const privateKey = process.env.WOMPI_PRIVATE_KEY;

    if (!privateKey?.startsWith("prv_test_")) {
        throw new Error(
            "La llave privada de Wompi Sandbox no está configurada."
        );
    }

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
                Authorization: `Bearer ${privateKey}`,
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

// =====================================
// VALIDAR FIRMA DEL WEBHOOK
// =====================================

const verifyWebhookSignature = (
    event,
    headerChecksum
) => {

    if (process.env.WOMPI_ENV !== "sandbox") {
        throw new Error(
            "El entorno de Wompi no está habilitado."
        );
    }

    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;

    if (!eventsSecret?.startsWith("test_events_")) {
        throw new Error(
            "El secreto de eventos de Wompi no está configurado."
        );
    }

    if (
        !event ||
        event.environment !== "test" ||
        !event.data ||
        !event.signature ||
        !Array.isArray(event.signature.properties) ||
        event.signature.properties.length === 0 ||
        !Number.isSafeInteger(event.timestamp)
    ) {
        return false;
    }

    const receivedChecksum =
        headerChecksum || event.signature.checksum;

    if (
        typeof receivedChecksum !== "string" ||
        !/^[a-fA-F0-9]{64}$/.test(receivedChecksum)
    ) {
        return false;
    }

    const values = [];

    // Obtener los valores indicados por Wompi
    // respetando el orden original de las propiedades.

    for (const property of event.signature.properties) {

        if (
            typeof property !== "string" ||
            !/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/.test(property)
        ) {
            return false;
        }

        let value = event.data;

        for (const key of property.split(".")) {

            if (
                value === null ||
                typeof value !== "object" ||
                !Object.hasOwn(value, key)
            ) {
                return false;
            }

            value = value[key];
        }

        if (
            value === null ||
            !["string", "number", "boolean"]
                .includes(typeof value)
        ) {
            return false;
        }

        values.push(String(value));
    }

    const signatureData =
        values.join("") +
        String(event.timestamp) +
        eventsSecret;

    const expectedChecksum = createHash("sha256")
        .update(signatureData, "utf8")
        .digest("hex");

    return timingSafeEqual(
        Buffer.from(expectedChecksum, "hex"),
        Buffer.from(receivedChecksum, "hex")
    );
};

module.exports = {
    getWompiConfig,
    generatePaymentReference,
    generateIntegritySignature,
    prepareCheckout,
    getTransaction,
    verifyWebhookSignature
};

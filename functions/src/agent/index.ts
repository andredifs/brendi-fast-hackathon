import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import {
    OPENAI_API_KEY,
    ZAPI_INSTANCE,
    ZAPI_TOKEN,
    ZAPI_CLIENT_TOKEN,
    EVENTS_API_URL,
} from '../config/env';
import handler from './handler';

/**
 * Cloud Function triggered por mensagens do WhatsApp via PubSub
 * Processa mensagens usando o agent com IA e responde via ZAPI
 *
 * Requires: OPENAI_API_KEY, ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN secrets
 * Requires: EVENTS_API_URL string parameter
 */
export const processMessage = onMessagePublished(
    {
        topic: 'whatsapp-messages',
        secrets: [OPENAI_API_KEY, ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN],
    },
    handler
);

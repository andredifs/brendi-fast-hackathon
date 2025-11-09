import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { OPENAI_API_KEY } from '../config/env';
import handler from './handler';

/**
 * Cloud Function triggered por mensagens do WhatsApp via PubSub
 * Processa mensagens usando o agent com IA
 *
 * Requires: OPENAI_API_KEY secret
 */
export const processMessage = onMessagePublished(
    {
        topic: 'whatsapp-messages',
        secrets: [OPENAI_API_KEY],
    },
    handler
);

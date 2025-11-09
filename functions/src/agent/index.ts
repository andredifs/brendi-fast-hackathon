import * as functions from 'firebase-functions';
import handler from './handler';

/**
 * Cloud Function triggered por mensagens do WhatsApp via PubSub
 * Processa mensagens usando o agent com IA
 */
export const processMessage = functions.pubsub
    .topic('whatsapp-messages')
    .onPublish(handler);

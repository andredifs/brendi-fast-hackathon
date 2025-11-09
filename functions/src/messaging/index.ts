import { onRequest } from 'firebase-functions/v2/https';
import { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } from '../config/env';

/**
 * Messaging API
 * Handles WhatsApp messaging operations via Z-API
 *
 * Requires: ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN secrets
 */
export const api = onRequest(
    {
        memory: '512MiB',
        secrets: [ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN],
    },
    (req, res) => import('./api').then(m => m.default(req, res))
);

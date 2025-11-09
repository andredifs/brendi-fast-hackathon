import { onRequest } from 'firebase-functions/v2/https';

/**
 * Events API
 * Handles event management operations
 */
export const api = onRequest(
    {
        memory: '1GiB',
    },
    (req, res) => import('./api').then(m => m.default(req, res))
);

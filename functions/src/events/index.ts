import * as functions from 'firebase-functions';

export const api = functions.runWith({
    memory: '1GB',
}).https.onRequest(
    (req, res) => import('./api').then(m => m.default(req, res))
);

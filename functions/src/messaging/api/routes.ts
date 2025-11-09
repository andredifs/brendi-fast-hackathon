import { Router } from 'express';
import Controller from './controllers';

const router = Router();

router.get('/ping', (_, res) => res.contentType('text/plain').send('pong'));
router.post('/send-message', Controller.sendMessage);
router.post('/webhook', Controller.webhook);

export default router;

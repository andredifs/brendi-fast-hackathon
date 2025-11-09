import { Router } from 'express';
import Controller from './controller';

const router = Router();

router.get('/ping', (_, res) => res.contentType('text/plain').send('pong'));
router.post('/send-message', Controller.sendMessage);

export default router;

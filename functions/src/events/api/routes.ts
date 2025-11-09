import { Router } from 'express';
import Controller from './controllers';

const router = Router();

router.get('/ping', (_, res) => res.contentType('text/plain').send('pong'));

// CRUD routes
router.post('/events', Controller.createEvent);
router.get('/events', Controller.listEvents);
router.get('/events/:id', Controller.getEvent);
router.put('/events/:id', Controller.updateEvent);
router.delete('/events/:id', Controller.deleteEvent);

export default router;

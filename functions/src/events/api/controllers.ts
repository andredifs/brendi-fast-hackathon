import Validators from './validators';
import Services from './services';
import { Request, Response } from 'express';
import { logger } from 'firebase-functions/v2';

async function createEvent(req: Request, res: Response) {
    logger.info('Creating event', {
        body: req.body,
    });

    const parsedBody = Validators.createEvent.safeParse(req.body);

    if (!parsedBody.success) {
        logger.warn('Validation failed for createEvent', {
            errors: parsedBody.error.errors,
        });
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        const result = await Services.createEvent(parsedBody.data);

        logger.info('Event created successfully', {
            eventId: result.id,
        });

        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        logger.error('Error creating event', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function getEvent(req: Request, res: Response) {
    const { id } = req.params;

    logger.info('Getting event', {
        eventId: id,
    });

    if (!id) {
        logger.warn('Event ID not provided');
        return res.status(422).json({ error: 'ID is required' });
    }

    try {
        const result = await Services.getEvent(id);

        logger.info('Event retrieved successfully', {
            eventId: id,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'Insight not found' ? 404 : 500;

        logger.error('Error getting event', {
            eventId: id,
            error: errorMessage,
            statusCode,
            stack: error instanceof Error ? error.stack : undefined,
        });

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function listEvents(req: Request, res: Response) {
    logger.info('Listing events', {
        query: req.query,
    });

    const parsedQuery = Validators.listEvents.safeParse(req.query);

    if (!parsedQuery.success) {
        logger.warn('Validation failed for listEvents', {
            errors: parsedQuery.error.errors,
        });
        return res.status(422).json({ error: parsedQuery.error.errors });
    }

    try {
        const result = await Services.listEvents(parsedQuery.data);

        logger.info('Events listed successfully', {
            count: result.length,
            filters: parsedQuery.data,
        });

        return res.status(200).json({
            success: true,
            data: result,
            count: result.length,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        logger.error('Error listing events', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function updateEvent(req: Request, res: Response) {
    const { id } = req.params;

    logger.info('Updating event', {
        eventId: id,
        body: req.body,
    });

    if (!id) {
        logger.warn('Event ID not provided for update');
        return res.status(422).json({ error: 'ID is required' });
    }

    const parsedBody = Validators.updateEvent.safeParse(req.body);

    if (!parsedBody.success) {
        logger.warn('Validation failed for updateEvent', {
            errors: parsedBody.error.errors,
        });
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        const result = await Services.updateEvent(id, parsedBody.data);

        logger.info('Event updated successfully', {
            eventId: id,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'Event not found' ? 404 : 500;

        logger.error('Error updating event', {
            eventId: id,
            error: errorMessage,
            statusCode,
            stack: error instanceof Error ? error.stack : undefined,
        });

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function deleteEvent(req: Request, res: Response) {
    const { id } = req.params;

    logger.info('Deleting event', {
        eventId: id,
    });

    if (!id) {
        logger.warn('Event ID not provided for deletion');
        return res.status(422).json({ error: 'ID is required' });
    }

    try {
        const result = await Services.deleteEvent(id);

        logger.info('Event deleted successfully', {
            eventId: id,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'Event not found' ? 404 : 500;

        logger.error('Error deleting event', {
            eventId: id,
            error: errorMessage,
            statusCode,
            stack: error instanceof Error ? error.stack : undefined,
        });

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
}

const Controller = {
    createEvent,
    getEvent,
    listEvents,
    updateEvent,
    deleteEvent,
};

export default Controller;

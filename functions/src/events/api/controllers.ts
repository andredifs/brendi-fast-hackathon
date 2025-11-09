import Validators from './validators';
import Services from './services';
import { Request, Response } from 'express';

async function createEvent(req: Request, res: Response) {
    const parsedBody = Validators.createEvent.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        const result = await Services.createEvent(parsedBody.data);

        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function getEvent(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(422).json({ error: 'ID is required' });
    }

    try {
        const result = await Services.getEvent(id);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'Insight not found' ? 404 : 500;

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function listEvents(req: Request, res: Response) {
    const parsedQuery = Validators.listEvents.safeParse({
        storeId: req.query.storeId,
        type: req.query.type,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });

    if (!parsedQuery.success) {
        return res.status(422).json({ error: parsedQuery.error.errors });
    }

    try {
        const result = await Services.listEvents(parsedQuery.data);

        return res.status(200).json({
            success: true,
            data: result,
            count: result.length,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function updateEvent(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(422).json({ error: 'ID is required' });
    }

    const parsedBody = Validators.updateEvent.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        const result = await Services.updateEvent(id, parsedBody.data);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'Event not found' ? 404 : 500;

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function deleteEvent(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(422).json({ error: 'ID is required' });
    }

    try {
        const result = await Services.deleteEvent(id);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const statusCode = errorMessage === 'Event not found' ? 404 : 500;

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

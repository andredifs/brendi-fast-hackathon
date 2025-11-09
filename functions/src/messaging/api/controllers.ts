import Validators from './validators';
import Services from './services';
import { Request, Response } from 'express';

async function sendMessage(req: Request, res: Response) {
    const parsedBody = Validators.sendMessage.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        const result = await Services.sendMessage(parsedBody.data);

        return res.status(200).json({
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

async function webhook(req: Request, res: Response) {
    const parsedBody = Validators.webhook.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        await Services.webhook(parsedBody.data);

        return res.status(200).json({
            success: true,
            message: 'Webhook received and published to PubSub',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

const Controller = {
    sendMessage,
    webhook,
};

export default Controller;

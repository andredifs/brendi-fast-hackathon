import Validators from './validators';
import Services from './services';
import { Request, Response } from 'express';
import { logger } from 'firebase-functions/v2';

async function sendMessage(req: Request, res: Response) {
    logger.info('Sending message', {
        phone: req.body.phone,
        hasMessage: !!req.body.message,
    });

    const parsedBody = Validators.sendMessage.safeParse(req.body);

    if (!parsedBody.success) {
        logger.warn('Validation failed for sendMessage', {
            errors: parsedBody.error.errors,
        });
        return res.status(422).json({ error: parsedBody.error.errors });
    }

    try {
        const result = await Services.sendMessage(parsedBody.data);

        logger.info('Message sent successfully', {
            zaapId: result.zaapId,
            messageId: result.messageId,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        logger.error('Error sending message', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

async function webhook(req: Request, res: Response) {
    logger.info('Webhook received', {
        messageId: req.body.messageId,
        phone: req.body.phone,
        hasData: !!req.body,
    });

    // const parsedBody = Validators.webhook.safeParse(req.body);

    // if (!parsedBody.success) {
    //     return res.status(422).json({ error: parsedBody.error.errors });
    // }

    try {
        await Services.webhook(req.body);

        logger.info('Webhook processed and published to PubSub successfully');

        return res.status(200).json({
            success: true,
            message: 'Webhook received and published to PubSub',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        logger.error('Error processing webhook', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
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

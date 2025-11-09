import { PubSub } from '@google-cloud/pubsub';
import ZApiClient from './clients/zapi';
import { logger } from 'firebase-functions/v2';

const pubsub = new PubSub();
const TOPIC_NAME = 'whatsapp-messages';

interface SendMessageParams {
    phone: string;
    message: string;
    delayMessage?: number;
    delayTyping?: number;
}

interface ZApiResponse {
    zaapId: string;
    messageId: string;
}

async function sendMessage(params: SendMessageParams): Promise<ZApiResponse> {
    logger.info('Service: Sending message via ZApi', {
        phone: params.phone,
        delayMessage: params.delayMessage,
        delayTyping: params.delayTyping,
    });

    const result = await ZApiClient.sendTextMessage(params);

    logger.info('Service: Message sent via ZApi', {
        zaapId: result.zaapId,
        messageId: result.messageId,
    });

    return result;
}

async function webhook(webhookData: any): Promise<void> {
    logger.info('Service: Publishing webhook to PubSub', {
        messageId: webhookData.messageId,
        phone: webhookData.phone,
        topic: TOPIC_NAME,
    });

    const topic = pubsub.topic(TOPIC_NAME);

    const message = {
        data: Buffer.from(JSON.stringify(webhookData)),
        attributes: {
            messageId: webhookData.messageId || '',
            phone: webhookData.phone || '',
            timestamp: Date.now().toString(),
        },
    };

    await topic.publishMessage(message);

    logger.info('Service: Webhook published to PubSub successfully', {
        topic: TOPIC_NAME,
        messageId: webhookData.messageId,
    });
}

const Services = {
    sendMessage,
    webhook,
};

export default Services;

import { PubSub } from '@google-cloud/pubsub';
import ZApiClient from './clients/zapi';

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
    return ZApiClient.sendTextMessage(params);
}

async function webhook(webhookData: any): Promise<void> {
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
}

const Services = {
    sendMessage,
    webhook,
};

export default Services;

import axios from 'axios';
import { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } from '../config/env';
import { logger } from 'firebase-functions/v2';

/**
 * Configuração do Z-API
 */
function getZApiConfig() {
    return {
        instance: ZAPI_INSTANCE.value(),
        token: ZAPI_TOKEN.value(),
        clientToken: ZAPI_CLIENT_TOKEN.value(),
        baseUrl: 'https://api.z-api.io',
    };
}

/**
 * Gera a URL completa para um endpoint do Z-API
 */
function getZApiUrl(endpoint: string): string {
    const config = getZApiConfig();
    return `${config.baseUrl}/instances/${config.instance}/token/${config.token}/${endpoint}`;
}

interface SendTextMessageParams {
    phone: string;
    message: string;
    delayMessage?: number;
    delayTyping?: number;
}

interface SendTextMessageResponse {
    zaapId: string;
    messageId: string;
}

/**
 * Client para enviar mensagens via WhatsApp usando Z-API
 */
const MessagingClient = {
    /**
     * Envia uma mensagem de texto via WhatsApp
     */
    sendTextMessage: async (params: SendTextMessageParams): Promise<SendTextMessageResponse> => {
        logger.info('MessagingClient: Sending text message', {
            phone: params.phone,
            messageLength: params.message.length,
            delayMessage: params.delayMessage,
            delayTyping: params.delayTyping,
        });

        try {
            const config = getZApiConfig();
            const url = getZApiUrl('send-text');

            logger.info('MessagingClient: Making request to Z-API', {
                url,
                hasClientToken: Boolean(config.clientToken),
            });

            const response = await axios.post<SendTextMessageResponse>(
                url,
                {
                    phone: params.phone,
                    message: params.message,
                    ...(params.delayMessage && { delayMessage: params.delayMessage }),
                    ...(params.delayTyping && { delayTyping: params.delayTyping }),
                },
                {
                    headers: {
                        'Client-Token': config.clientToken,
                        'Content-Type': 'application/json',
                    },
                }
            );

            logger.info('MessagingClient: Message sent successfully', {
                zaapId: response.data.zaapId,
                messageId: response.data.messageId,
                phone: params.phone,
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                logger.error('MessagingClient: Axios error sending message', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message,
                    phone: params.phone,
                });
                throw new Error(
                    `Z-API Error: ${error.response?.data?.message || error.message}`
                );
            }
            logger.error('MessagingClient: Unknown error sending message', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                phone: params.phone,
            });
            throw error;
        }
    },
};

export default MessagingClient;


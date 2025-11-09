import axios from 'axios';
import { getZApiUrl, getZApiConfig } from '../config/zapi';
import { logger } from 'firebase-functions/v2';

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

class ZApiClient {
    async sendTextMessage(params: SendTextMessageParams): Promise<SendTextMessageResponse> {
        logger.info('ZApiClient: Sending text message', {
            phone: params.phone,
            messageLength: params.message.length,
            delayMessage: params.delayMessage,
            delayTyping: params.delayTyping,
        });

        try {
            const config = getZApiConfig();
            const url = getZApiUrl('send-text');

            logger.info('ZApiClient: Making request to Z-API', {
                url,
                hasClientToken: !!config.clientToken,
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

            logger.info('ZApiClient: Message sent successfully', {
                zaapId: response.data.zaapId,
                messageId: response.data.messageId,
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                logger.error('ZApiClient: Axios error sending message', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message,
                });
                throw new Error(
                    `Z-API Error: ${error.response?.data?.message || error.message}`
                );
            }
            logger.error('ZApiClient: Unknown error sending message', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    }
}

export default new ZApiClient();

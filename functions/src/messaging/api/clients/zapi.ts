import axios from 'axios';
import { getZApiUrl, getZApiConfig } from '../config/zapi';

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
        try {
            const config = getZApiConfig();
            const url = getZApiUrl('send-text');

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

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    `Z-API Error: ${error.response?.data?.message || error.message}`
                );
            }
            throw error;
        }
    }
}

export default new ZApiClient();

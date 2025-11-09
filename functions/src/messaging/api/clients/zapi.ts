import axios, { AxiosInstance } from 'axios';
import { getZApiUrl, ZAPI_CONFIG } from '../config/zapi';

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
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            headers: {
                'Client-Token': ZAPI_CONFIG.clientToken,
                'Content-Type': 'application/json',
            },
        });
    }

    async sendTextMessage(params: SendTextMessageParams): Promise<SendTextMessageResponse> {
        try {
            const url = getZApiUrl('send-text');

            const response = await this.axiosInstance.post<SendTextMessageResponse>(
                url,
                {
                    phone: params.phone,
                    message: params.message,
                    ...(params.delayMessage && { delayMessage: params.delayMessage }),
                    ...(params.delayTyping && { delayTyping: params.delayTyping }),
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

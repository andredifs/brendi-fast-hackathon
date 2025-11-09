import axios from 'axios';
import { getZApiUrl, ZAPI_CONFIG } from '../config/zapi';

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
    try {
        const url = getZApiUrl('send-text');

        const response = await axios.post<ZApiResponse>(
            url,
            {
                phone: params.phone,
                message: params.message,
                ...(params.delayMessage && { delayMessage: params.delayMessage }),
                ...(params.delayTyping && { delayTyping: params.delayTyping }),
            },
            {
                headers: {
                    'Client-Token': ZAPI_CONFIG.clientToken,
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

const Services = {
    sendMessage,
};

export default Services;

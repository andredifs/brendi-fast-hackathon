import axios from 'axios';
import { EVENTS_API_URL } from '../config/env';

function getBaseUrl(): string {
    return EVENTS_API_URL.value();
}

interface CreateEventParams {
    title: string;
    description?: string;
    type: string;
    data?: Record<string, any>;
    storeId: string;
}

interface UpdateEventParams {
    title?: string;
    description?: string;
    type?: string;
    data?: Record<string, any>;
}

interface ListEventsParams {
    storeId?: string;
    type?: string;
    limit?: number;
}

const EventsClient = {
    /**
     * Cria um novo evento
     */
    create: async (params: CreateEventParams) => {
        const response = await axios.post(`${getBaseUrl()}/events`, params);
        return response.data.data;
    },

    /**
     * Busca um evento por ID
     */
    get: async (id: string) => {
        const response = await axios.get(`${getBaseUrl()}/events/${id}`);
        return response.data.data;
    },

    /**
     * Lista eventos com filtros opcionais
     */
    list: async (params: ListEventsParams = {}) => {
        const response = await axios.get(`${getBaseUrl()}/events`, { params });
        return response.data.data;
    },

    /**
     * Atualiza um evento existente
     */
    update: async (id: string, params: UpdateEventParams) => {
        const response = await axios.put(`${getBaseUrl()}/events/${id}`, params);
        return response.data.data;
    },

    /**
     * Deleta um evento
     */
    delete: async (id: string) => {
        const response = await axios.delete(`${getBaseUrl()}/events/${id}`);
        return response.data.data;
    },
};

export default EventsClient;


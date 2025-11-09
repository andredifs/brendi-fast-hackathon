import axios from 'axios';

const BASE_URL = process.env.EVENTS_API_URL || 'http://localhost:5001/brendi-fast-hackathon/us-central1/events';

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
        const response = await axios.post(`${BASE_URL}/events`, params);
        return response.data.data;
    },

    /**
     * Busca um evento por ID
     */
    get: async (id: string) => {
        const response = await axios.get(`${BASE_URL}/events/${id}`);
        return response.data.data;
    },

    /**
     * Lista eventos com filtros opcionais
     */
    list: async (params: ListEventsParams = {}) => {
        const response = await axios.get(`${BASE_URL}/events`, { params });
        return response.data.data;
    },

    /**
     * Atualiza um evento existente
     */
    update: async (id: string, params: UpdateEventParams) => {
        const response = await axios.put(`${BASE_URL}/events/${id}`, params);
        return response.data.data;
    },

    /**
     * Deleta um evento
     */
    delete: async (id: string) => {
        const response = await axios.delete(`${BASE_URL}/events/${id}`);
        return response.data.data;
    },
};

export default EventsClient;


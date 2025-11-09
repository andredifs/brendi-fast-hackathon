import axios from 'axios';
import { EVENTS_API_URL } from '../config/env';
import { logger } from 'firebase-functions/v2';

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
        logger.info('EventsClient: Creating event', {
            storeId: params.storeId,
            type: params.type,
        });
        try {
            const response = await axios.post(`${getBaseUrl()}/events`, params);
            logger.info('EventsClient: Event created', {
                eventId: response.data.data?.id,
            });
            return response.data.data;
        } catch (error) {
            logger.error('EventsClient: Error creating event', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    },

    /**
     * Busca um evento por ID
     */
    get: async (id: string) => {
        logger.info('EventsClient: Getting event', {
            eventId: id,
        });
        try {
            const response = await axios.get(`${getBaseUrl()}/events/${id}`);
            logger.info('EventsClient: Event retrieved', {
                eventId: id,
            });
            return response.data.data;
        } catch (error) {
            logger.error('EventsClient: Error getting event', {
                eventId: id,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    },

    /**
     * Lista eventos com filtros opcionais
     */
    list: async (params: ListEventsParams = {}) => {
        logger.info('EventsClient: Listing events', {
            filters: params,
        });
        try {
            const response = await axios.get(`${getBaseUrl()}/events`, { params });
            logger.info('EventsClient: Events listed', {
                count: response.data.data?.length || 0,
            });
            return response.data.data;
        } catch (error) {
            logger.error('EventsClient: Error listing events', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    },

    /**
     * Atualiza um evento existente
     */
    update: async (id: string, params: UpdateEventParams) => {
        logger.info('EventsClient: Updating event', {
            eventId: id,
            updateFields: Object.keys(params),
        });
        try {
            const response = await axios.put(`${getBaseUrl()}/events/${id}`, params);
            logger.info('EventsClient: Event updated', {
                eventId: id,
            });
            return response.data.data;
        } catch (error) {
            logger.error('EventsClient: Error updating event', {
                eventId: id,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    },

    /**
     * Deleta um evento
     */
    delete: async (id: string) => {
        logger.info('EventsClient: Deleting event', {
            eventId: id,
        });
        try {
            const response = await axios.delete(`${getBaseUrl()}/events/${id}`);
            logger.info('EventsClient: Event deleted', {
                eventId: id,
            });
            return response.data.data;
        } catch (error) {
            logger.error('EventsClient: Error deleting event', {
                eventId: id,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    },
};

export default EventsClient;


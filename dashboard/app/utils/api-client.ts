/**
 * API Client para comunicação com o backend
 */

interface ListEventsParams {
  storeId?: string;
  type?: string;
  limit?: number;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  data?: Record<string, any>;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export const eventsApi = {
  /**
   * Lista eventos com filtros opcionais
   */
  list: async (params: ListEventsParams = {}): Promise<Event[]> => {
    const query = new URLSearchParams();
    if (params.storeId) query.set('storeId', params.storeId);
    if (params.type) query.set('type', params.type);
    if (params.limit) query.set('limit', params.limit.toString());

    const url = `/api/events${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await $fetch<Event[]>(url);
    return response;
  },

  /**
   * Busca um evento por ID
   */
  get: async (id: string): Promise<Event> => {
    return await $fetch<Event>(`/api/events/${id}`);
  }
};


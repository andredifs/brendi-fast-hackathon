export default eventHandler(async (event) => {
    const query = getQuery(event);
    const eventsApiUrl = process.env.EVENTS_API_URL || 'http://localhost:5001/brendi-fast-hackathon/us-central1/events';

    try {
        const params = new URLSearchParams();
        if (query.storeId) params.set('storeId', query.storeId as string);
        if (query.type) params.set('type', query.type as string);
        if (query.limit) params.set('limit', query.limit as string);

        const url = `${eventsApiUrl}/events${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await $fetch(url) as any;

        // If response has a data property, return that. Otherwise return the response itself
        return response?.data || response;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch events'
        });
    }
});


export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const eventsApiUrl = process.env.EVENTS_API_URL || 'https://us-central1-fast-hackathon-andre.cloudfunctions.net/events-api';

  try {
    const response = await $fetch(`${eventsApiUrl}/events/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch event'
    });
  }
});


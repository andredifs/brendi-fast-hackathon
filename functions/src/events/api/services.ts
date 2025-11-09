import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';

const db = admin.firestore();
const COLLECTION_NAME = 'menu_events';

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

async function createEvent(params: CreateEventParams) {
    logger.info('Service: Creating event', {
        storeId: params.storeId,
        type: params.type,
    });

    const eventData = {
        title: params.title,
        description: params.description,
        type: params.type,
        data: params.data,
        'store_id': params.storeId,
        'created_at': admin.firestore.FieldValue.serverTimestamp(),
        'updated_at': admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTION_NAME).add(eventData);

    const doc = await docRef.get();
    const result = {
        id: doc.id,
        ...doc.data(),
    };

    logger.info('Service: Event created', {
        eventId: result.id,
    });

    return result;
}

async function getEvent(id: string) {
    logger.info('Service: Getting event', {
        eventId: id,
    });

    const doc = await db.collection(COLLECTION_NAME).doc(id).get();

    if (!doc.exists) {
        logger.warn('Service: Event not found', {
            eventId: id,
        });
        throw new Error('Event not found');
    }

    logger.info('Service: Event retrieved', {
        eventId: id,
    });

    return {
        id: doc.id,
        ...doc.data(),
    };
}

async function listEvents(params: ListEventsParams) {
    logger.info('Service: Listing events', {
        storeId: params.storeId,
        type: params.type,
        limit: params.limit,
    });

    let query: admin.firestore.Query = db.collection(COLLECTION_NAME);

    if (params.storeId) {
        // Usa snake_case para query no Firestore
        query = query.where('store_id', '==', params.storeId);
    }

    if (params.type) {
        query = query.where('type', '==', params.type);
    }

    query = query.orderBy('created_at', 'desc');

    if (params.limit) {
        query = query.limit(params.limit);
    }

    const snapshot = await query.get();

    const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    logger.info('Service: Events listed', {
        count: results.length,
    });

    return results;
}

async function updateEvent(id: string, params: UpdateEventParams) {
    logger.info('Service: Updating event', {
        eventId: id,
        updateFields: Object.keys(params),
    });

    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        logger.warn('Service: Event not found for update', {
            eventId: id,
        });
        throw new Error('Event not found');
    }

    const updateData = {
        ...params,
        'updated_at': admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const result = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };

    logger.info('Service: Event updated', {
        eventId: id,
    });

    return result;
}

async function deleteEvent(id: string) {
    logger.info('Service: Deleting event', {
        eventId: id,
    });

    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        logger.warn('Service: Event not found for deletion', {
            eventId: id,
        });
        throw new Error('Event not found');
    }

    await docRef.delete();

    logger.info('Service: Event deleted', {
        eventId: id,
    });

    return {
        id,
        message: 'Event deleted successfully',
    };
}

const Services = {
    createEvent,
    getEvent,
    listEvents,
    updateEvent,
    deleteEvent,
};

export default Services;

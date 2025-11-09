import * as admin from 'firebase-admin';

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
    const eventData = {
        ...params,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLLECTION_NAME).add(eventData);

    const doc = await docRef.get();
    return {
        id: doc.id,
        ...doc.data(),
    };
}

async function getEvent(id: string) {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();

    if (!doc.exists) {
        throw new Error('Event not found');
    }

    return {
        id: doc.id,
        ...doc.data(),
    };
}

async function listEvents(params: ListEventsParams) {
    let query: admin.firestore.Query = db.collection(COLLECTION_NAME);

    if (params.storeId) {
        query = query.where('storeId', '==', params.storeId);
    }

    if (params.type) {
        query = query.where('type', '==', params.type);
    }

    query = query.orderBy('createdAt', 'desc');

    if (params.limit) {
        query = query.limit(params.limit);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

async function updateEvent(id: string, params: UpdateEventParams) {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error('Event not found');
    }

    const updateData = {
        ...params,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

async function deleteEvent(id: string) {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error('Event not found');
    }

    await docRef.delete();

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

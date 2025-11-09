import * as z from 'zod';

const createEvent = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.string().min(1, 'Type is required'),
    data: z.record(z.any()).optional(),
    storeId: z.string().min(1, 'Store ID is required'),
});

const updateEvent = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.string().min(1).optional(),
    data: z.record(z.any()).optional(),
});

const getEvent = z.object({
    id: z.string().min(1, 'ID is required'),
});

const listEvents = z.object({
    storeId: z.string().optional(),
    type: z.string().optional(),
    limit: z.number().int().positive().optional(),
});

const Validators = {
    createEvent,
    updateEvent,
    getEvent,
    listEvents,
};

export default Validators;

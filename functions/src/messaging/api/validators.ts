import * as z from 'zod';

export const sendMessage = z.object({
    phone: z.string().min(10).max(15).regex(/^\d+$/, 'Phone must contain only digits'),
    message: z.string().min(1),
    delayMessage: z.number().min(1).max(15).optional(),
    delayTyping: z.number().min(0).max(15).optional(),
});

export const webhook = z.object({
    messageId: z.string(),
    phone: z.string(),
    chatName: z.string().optional(),
    momment: z.number().optional(),
    status: z.string().optional(),
    isGroup: z.boolean().optional(),
    isNewsletter: z.boolean().optional(),
    fromMe: z.boolean().optional(),
    isEdit: z.boolean().optional(),
    text: z.object({
        message: z.string(),
    }).optional(),
    image: z.object({
        imageUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        caption: z.string().optional(),
    }).optional(),
    // Simplificado - aceita qualquer campo adicional
}).passthrough();

const Validators = {
    sendMessage,
    webhook,
};

export default Validators;

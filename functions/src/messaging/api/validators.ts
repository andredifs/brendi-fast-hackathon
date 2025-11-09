import * as z from 'zod';

export const sendMessage = z.object({
    phone: z.string().min(10).max(15).regex(/^\d+$/, 'Phone must contain only digits'),
    message: z.string().min(1),
    delayMessage: z.number().min(1).max(15).optional(),
    delayTyping: z.number().min(0).max(15).optional(),
});

const Validators = {
    sendMessage,
};

export default Validators;

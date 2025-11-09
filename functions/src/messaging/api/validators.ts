import * as z from 'zod';

export const sendMessage = z.object({
    message: z.string().min(1),
});

const Validators = {
    sendMessage,
};

export default Validators;

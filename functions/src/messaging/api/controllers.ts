import Validators from './validators';
import Services from './services';

async function sendMessage(req: Request, res: Response) {
    const parsedBody = Validators.sendMessage.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(422).json({ error: parsedBody.error.message });
    }

    try {
        const message =

        return res.status(200).json({ message });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

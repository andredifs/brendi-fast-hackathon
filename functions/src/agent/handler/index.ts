import { CloudEvent } from 'firebase-functions/v2';
import { MessagePublishedData } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';
import { processWithAgent } from './agent';

/**
 * Handler para processar mensagens do WhatsApp via PubSub
 * Responsável por receber a mensagem, processar com o agent e enviar resposta
 */
export default async function handler(event: CloudEvent<MessagePublishedData>) {
    const data = event.data.message.json;

    logger.info('Processing WhatsApp message', {
        messageId: data.messageId,
        phone: data.phone,
        fromMe: data.fromMe,
    });

    // Ignora mensagens enviadas por nós mesmos
    if (data.fromMe) {
        logger.info('Ignoring message from self');
        return;
    }

    // Processa apenas mensagens de texto
    if (!data.text?.message) {
        logger.info('Ignoring non-text message');
        return;
    }

    logger.info('Text message received', {
        message: data.text.message,
        phone: data.phone,
    });

    try {
        // Processa a mensagem com o agent
        const response = await processWithAgent(data.text.message);

        logger.info('Agent response generated', {
            responseText: response.text,
            toolCallsCount: response.toolCalls?.length || 0,
            phone: data.phone,
        });

        // TODO: Enviar resposta via WhatsApp
        // await sendWhatsAppMessage(data.phone, response.text);

        logger.info('Response sent successfully', {
            phone: data.phone,
        });
    } catch (error) {
        logger.error('Error processing message with agent', {
            error,
            phone: data.phone,
            message: data.text.message,
        });

        // TODO: Enviar mensagem de erro ao usuário
        // await sendWhatsAppMessage(
        //     data.phone,
        //     'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
        // );
    }
}

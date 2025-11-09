import * as functions from 'firebase-functions';
import { processWithAgent } from './agent';

/**
 * Handler para processar mensagens do WhatsApp via PubSub
 * Responsável por receber a mensagem, processar com o agent e enviar resposta
 */
export default async function handler(message: functions.pubsub.Message) {
    const data = message.json;

    functions.logger.info('Processing WhatsApp message', {
        messageId: data.messageId,
        phone: data.phone,
        fromMe: data.fromMe,
    });

    // Ignora mensagens enviadas por nós mesmos
    if (data.fromMe) {
        functions.logger.info('Ignoring message from self');
        return;
    }

    // Processa apenas mensagens de texto
    if (!data.text?.message) {
        functions.logger.info('Ignoring non-text message');
        return;
    }

    functions.logger.info('Text message received', {
        message: data.text.message,
        phone: data.phone,
    });

    try {
        // Processa a mensagem com o agent
        const response = await processWithAgent(data.text.message);

        functions.logger.info('Agent response generated', {
            responseText: response.text,
            toolCallsCount: response.toolCalls?.length || 0,
            phone: data.phone,
        });

        // TODO: Enviar resposta via WhatsApp
        // await sendWhatsAppMessage(data.phone, response.text);

        functions.logger.info('Response sent successfully', {
            phone: data.phone,
        });
    } catch (error) {
        functions.logger.error('Error processing message with agent', {
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

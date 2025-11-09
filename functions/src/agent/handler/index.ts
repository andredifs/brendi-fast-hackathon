import { CloudEvent } from 'firebase-functions/v2';
import { MessagePublishedData } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';
import { processWithAgent } from './agent';
import { MessagingClient } from '../../clients';
import { getMenuEventsContext } from './tools';

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
        // Busca contexto de eventos do menu
        const menuEventsContext = await getMenuEventsContext();

        // Processa a mensagem com o agent
        const response = await processWithAgent(
            data.text.message,
            [], // Histórico vazio por enquanto (pode ser implementado no futuro)
            menuEventsContext
        );

        logger.info('Agent response generated', {
            responseText: response.text,
            responseLength: response.text.length,
            phone: data.phone,
        });

        // Envia resposta via WhatsApp usando ZAPI
        await MessagingClient.sendTextMessage({
            phone: data.phone,
            message: response.text,
            delayTyping: 2000, // Simula que está digitando
        });

        logger.info('Response sent successfully', {
            phone: data.phone,
            messageLength: response.text.length,
        });
    } catch (error) {
        logger.error('Error processing message with agent', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            phone: data.phone,
            message: data.text.message,
        });

        // Tenta enviar mensagem de erro ao usuário
        try {
            await MessagingClient.sendTextMessage({
                phone: data.phone,
                message:
                    'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente em alguns instantes.',
            });
        } catch (sendError) {
            logger.error('Error sending error message to user', {
                error: sendError instanceof Error ? sendError.message : 'Unknown error',
                phone: data.phone,
            });
        }
    }
}

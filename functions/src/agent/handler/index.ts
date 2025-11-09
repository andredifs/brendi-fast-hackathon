import { CloudEvent } from 'firebase-functions/v2';
import { MessagePublishedData } from 'firebase-functions/v2/pubsub';
import { logger } from 'firebase-functions/v2';
import { processWithAgent } from './agent';
import { EventsClient, MessagingClient } from '../../clients';

// ID da loja (hardcoded por enquanto, pode vir de configuração no futuro)
const STORE_ID = '0WcZ1MWEaFc1VftEBdLa';

/**
 * Busca eventos do menu e formata como contexto para o agent
 */
async function getMenuEventsContext(): Promise<string> {
    try {
        logger.info('Fetching menu events for context', { storeId: STORE_ID });

        const events = await EventsClient.list({
            storeId: STORE_ID,
            type: 'menu',
            limit: 100, // Limita para não sobrecarregar o contexto
        });

        if (!events || events.length === 0) {
            logger.info('No menu events found');
            return '';
        }

        // Agrupa eventos por tipo e produto
        const eventsByType: Record<string, any[]> = {};
        const productStats: Record<
            string,
            {
                name: string;
                views: number;
                addedToCart: number;
                purchased: number;
                removed: number;
            }
        > = {};

        for (const event of events) {
            const eventType = event.type || 'unknown';
            if (!eventsByType[eventType]) {
                eventsByType[eventType] = [];
            }
            eventsByType[eventType].push(event);

            // Processa dados do produto se disponível
            if (event.data?.product) {
                const productName = event.data.product.name || 'Produto sem nome';
                const productId = event.data.product.id || 'unknown';

                if (!productStats[productId]) {
                    productStats[productId] = {
                        name: productName,
                        views: 0,
                        addedToCart: 0,
                        purchased: 0,
                        removed: 0,
                    };
                }

                // Conta eventos por tipo
                if (event.data.action === 'view') productStats[productId].views++;
                if (event.data.action === 'add_to_cart')
                    productStats[productId].addedToCart++;
                if (event.data.action === 'purchase')
                    productStats[productId].purchased++;
                if (event.data.action === 'remove_from_cart')
                    productStats[productId].removed++;
            }
        }

        // Formata contexto de forma clara
        let context = `Total de eventos: ${events.length}\n\n`;

        // Top produtos por visualizações
        const topViewed = Object.entries(productStats)
            .sort((a, b) => b[1].views - a[1].views)
            .slice(0, 10);

        if (topViewed.length > 0) {
            context += 'PRODUTOS MAIS VISUALIZADOS:\n';
            topViewed.forEach(([, stats], index) => {
                context += `${index + 1}. ${stats.name} - ${stats.views} visualizações`;
                if (stats.addedToCart > 0)
                    context += `, ${stats.addedToCart} adições ao carrinho`;
                if (stats.purchased > 0) context += `, ${stats.purchased} compras`;
                context += '\n';
            });
            context += '\n';
        }

        // Top produtos por compras
        const topPurchased = Object.entries(productStats)
            .filter(([, stats]) => stats.purchased > 0)
            .sort((a, b) => b[1].purchased - a[1].purchased)
            .slice(0, 5);

        if (topPurchased.length > 0) {
            context += 'PRODUTOS MAIS COMPRADOS:\n';
            topPurchased.forEach(([, stats], index) => {
                context += `${index + 1}. ${stats.name} - ${stats.purchased} compras`;
                if (stats.views > 0) context += ` (${stats.views} visualizações)`;
                context += '\n';
            });
            context += '\n';
        }

        // Estatísticas gerais
        const totalViews = Object.values(productStats).reduce(
            (sum, s) => sum + s.views,
            0
        );
        const totalPurchases = Object.values(productStats).reduce(
            (sum, s) => sum + s.purchased,
            0
        );
        const totalAddedToCart = Object.values(productStats).reduce(
            (sum, s) => sum + s.addedToCart,
            0
        );

        context += 'ESTATÍSTICAS GERAIS:\n';
        context += `- Total de visualizações: ${totalViews}\n`;
        context += `- Total de adições ao carrinho: ${totalAddedToCart}\n`;
        context += `- Total de compras: ${totalPurchases}\n`;
        if (totalViews > 0) {
            const conversionRate = ((totalPurchases / totalViews) * 100).toFixed(2);
            context += `- Taxa de conversão: ${conversionRate}%\n`;
        }

        logger.info('Menu events context built', {
            eventsCount: events.length,
            productsCount: Object.keys(productStats).length,
        });

        return context;
    } catch (error) {
        logger.error('Error fetching menu events context', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        // Retorna string vazia se houver erro - o agent ainda pode responder
        return '';
    }
}

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

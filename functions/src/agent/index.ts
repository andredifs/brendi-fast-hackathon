import * as functions from 'firebase-functions';

export const processMessage = functions.pubsub
    .topic('whatsapp-messages')
    .onPublish(async (message) => {
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

        // TODO: Implementar lógica de IA aqui
        // Por enquanto, apenas loga a mensagem recebida
        if (data.text?.message) {
            functions.logger.info('Text message received', {
                message: data.text.message,
                phone: data.phone,
            });
        }

        // Aqui virá a lógica de processamento com IA
        // 1. Analisar a mensagem
        // 2. Gerar resposta com IA
        // 3. Chamar a API de envio de mensagem
    });

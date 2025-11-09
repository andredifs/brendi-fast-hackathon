import { generateText } from 'ai';
import { getModel, buildSystemPrompt, agentConfig } from './config';
import { logger } from 'firebase-functions/v2';

/**
 * Interface para o histórico de mensagens
 */
interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

/**
 * Interface para o resultado do agent
 */
interface AgentResponse {
    text: string;
    finishReason: string;
}

/**
 * Processa uma mensagem usando o agent
 *
 * @param userMessage - Mensagem do usuário
 * @param conversationHistory - Histórico de conversas anteriores (opcional)
 * @param menuEventsContext - Contexto de eventos do menu (opcional)
 * @returns Resposta do agent
 */
export async function processWithAgent(
    userMessage: string,
    conversationHistory: Message[] = [],
    menuEventsContext?: string
): Promise<AgentResponse> {
    try {
        logger.info('Starting agent processing', {
            userMessage,
            historyLength: conversationHistory.length,
            hasMenuEventsContext: Boolean(menuEventsContext),
        });

        // Prepara o histórico de mensagens
        const messages = [
            ...conversationHistory,
            {
                role: 'user' as const,
                content: userMessage,
            },
        ];

        // Gera o system prompt com contexto se disponível
        const systemPrompt = buildSystemPrompt(menuEventsContext);

        // Gera resposta usando o agent
        const result = await generateText({
            model: getModel(),
            system: systemPrompt,
            messages,
            temperature: agentConfig.temperature,
        });

        logger.info('Agent processing completed', {
            finishReason: result.finishReason,
            responseLength: result.text.length,
        });

        return {
            text: result.text,
            finishReason: result.finishReason,
        };
    } catch (error) {
        logger.error('Error in agent processing', error);
        throw error;
    }
}

/**
 * Processa uma mensagem com contexto simplificado (sem histórico)
 * Útil para casos mais simples
 */
export async function processSimpleMessage(userMessage: string): Promise<string> {
    const result = await processWithAgent(userMessage);
    return result.text;
}


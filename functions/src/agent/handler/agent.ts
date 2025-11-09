import { generateText } from 'ai';
import { model, systemPrompt, agentConfig } from './config';
import { tools } from './tools';
import * as functions from 'firebase-functions';

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
    toolCalls?: any[];
    finishReason: string;
}

/**
 * Processa uma mensagem usando o agent com loop de ferramentas
 *
 * @param userMessage - Mensagem do usuário
 * @param conversationHistory - Histórico de conversas anteriores (opcional)
 * @returns Resposta do agent
 */
export async function processWithAgent(
    userMessage: string,
    conversationHistory: Message[] = []
): Promise<AgentResponse> {
    try {
        functions.logger.info('Starting agent processing', {
            userMessage,
            historyLength: conversationHistory.length,
        });

        // Prepara o histórico de mensagens
        const messages = [
            ...conversationHistory,
            {
                role: 'user' as const,
                content: userMessage,
            },
        ];

        // Gera resposta usando o agent com tools
        const result = await generateText({
            model,
            system: systemPrompt,
            messages,
            tools,
            temperature: agentConfig.temperature,
        });

        functions.logger.info('Agent processing completed', {
            finishReason: result.finishReason,
            toolCallsCount: result.toolCalls?.length || 0,
            steps: result.steps?.length || 0,
        });

        // Log das tool calls realizadas (se houver)
        if (result.toolCalls && result.toolCalls.length > 0) {
            functions.logger.info('Tool calls executed', {
                toolCalls: result.toolCalls.map((tc) => ({
                    toolName: tc.toolName,
                    args: tc.input,
                })),
            });
        }

        return {
            text: result.text,
            toolCalls: result.toolCalls,
            finishReason: result.finishReason,
        };
    } catch (error) {
        functions.logger.error('Error in agent processing', error);
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


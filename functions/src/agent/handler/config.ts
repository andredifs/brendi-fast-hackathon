import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY } from '../../config/env';

/**
 * Configuração do modelo de IA
 * A API key é obtida das variáveis de ambiente de forma segura
 */
export function getModel() {
    const openai = createOpenAI({
        apiKey: OPENAI_API_KEY.value(),
    });
    return openai('gpt-4o-mini');
}

/**
 * System prompt do agent
 * Define o comportamento e personalidade do assistente
 */
export const systemPrompt = `Você é um assistente virtual de uma loja/restaurante.

Seu papel é:
- Responder perguntas dos clientes de forma amigável e profissional
- Ajudar com informações sobre pedidos
- Fornecer informações sobre produtos
- Resolver problemas e dúvidas

Diretrizes:
- Seja sempre educado e prestativo
- Use uma linguagem clara e objetiva
- Quando não souber algo, seja honesto
- Use as ferramentas (tools) disponíveis quando necessário
- Responda em português brasileiro

Lembre-se: você está conversando via WhatsApp, então mantenha as respostas concisas mas completas.`;

/**
 * Configurações do agent
 */
export const agentConfig = {
    maxSteps: 5, // Número máximo de iterações no loop
    temperature: 0.7, // Controla a criatividade das respostas
};


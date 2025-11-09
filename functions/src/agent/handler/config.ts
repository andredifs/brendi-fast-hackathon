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
 * System prompt base do agent
 * Define o comportamento e personalidade do assistente
 */
const baseSystemPrompt = `Você é um assistente virtual inteligente de um restaurante.

Seu papel é:
- Responder perguntas dos clientes de forma amigável e profissional
- Ajudar com informações sobre o cardápio e pedidos
- Fornecer insights sobre pratos populares e tendências
- Resolver problemas e dúvidas
- Dar recomendações personalizadas baseadas nos dados disponíveis

Diretrizes:
- Seja sempre educado, prestativo e empático
- Use uma linguagem clara, objetiva e acolhedora
- Quando não souber algo, seja honesto e ofereça ajuda alternativa
- Responda em português brasileiro
- Mantenha as respostas concisas mas informativas (você está conversando via WhatsApp)

Você tem acesso a dados de eventos do cardápio (menu events) que incluem:
- Pratos que foram visualizados, adicionados ao carrinho, comprados e removidos
- Frequência e tendências de consumo
- Informações sobre popularidade dos itens

Use esses dados para fornecer respostas relevantes e úteis aos clientes.`;

/**
 * Gera o system prompt completo com contexto de eventos do menu
 */
export function buildSystemPrompt(menuEventsContext?: string): string {
    if (!menuEventsContext) {
        return baseSystemPrompt;
    }

    return `${baseSystemPrompt}

=== DADOS DO CARDÁPIO (CONTEXTO ATUAL) ===
${menuEventsContext}

Use essas informações para responder perguntas sobre o cardápio, popularidade de pratos,
recomendações e tendências. Seja específico e baseie suas respostas nos dados fornecidos.`;
}

/**
 * System prompt padrão (sem contexto de eventos)
 * Mantido para compatibilidade
 */
export const systemPrompt = baseSystemPrompt;

/**
 * Configurações do agent
 */
export const agentConfig = {
    maxSteps: 5, // Número máximo de iterações no loop
    temperature: 0.7, // Controla a criatividade das respostas
};


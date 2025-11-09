import { tool } from 'ai';
import { z } from 'zod';

/**
 * Tool de exemplo: Buscar informações de pedido
 * Esta é uma tool simples para demonstrar como funcionam as tools no agent
 */
export const getOrderInfoTool = tool({
    description: 'Busca informações sobre um pedido específico pelo ID. Use quando o cliente perguntar sobre um pedido.',
    inputSchema: z.object({
        orderId: z.string().describe('O ID do pedido a ser consultado'),
    }),
    execute: async (input) => {
        // TODO: Implementar busca real no Firestore
        // Por enquanto, retorna dados mockados

        const mockOrders = {
            'PED-001': {
                id: 'PED-001',
                status: 'em preparação',
                items: ['Pizza Margherita', 'Refrigerante'],
                total: 45.90,
                estimatedTime: '30 minutos',
            },
            'PED-002': {
                id: 'PED-002',
                status: 'saiu para entrega',
                items: ['Hambúrguer', 'Batata Frita'],
                total: 38.50,
                estimatedTime: '15 minutos',
            },
        };

        const order = mockOrders[input.orderId as keyof typeof mockOrders];

        if (!order) {
            return {
                success: false,
                message: `Pedido ${input.orderId} não encontrado.`,
            };
        }

        return {
            success: true,
            message: `Pedido ${input.orderId} encontrado com sucesso.`,
            order,
        };
    },
});

/**
 * Exporta todas as tools disponíveis para o agent
 */
export const tools = {
    getOrderInfo: getOrderInfoTool,
};


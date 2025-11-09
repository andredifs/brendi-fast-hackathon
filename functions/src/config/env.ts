import { defineString, defineSecret } from 'firebase-functions/params';

/**
 * Environment configuration for Firebase Functions
 *
 * This module defines all environment variables used across the functions.
 * For local development, values are read from .env file.
 * For production, values must be set using: firebase deploy --only functions
 *
 * The CLI will prompt for missing values during deployment.
 */

// ==================== SECRETS ====================
// Secrets são valores sensíveis que não aparecem em logs

/**
 * OpenAI API Key for AI Agent
 * Get your key at: https://platform.openai.com/api-keys
 */
export const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');

/**
 * Z-API WhatsApp Instance ID
 * Get from your Z-API dashboard
 */
export const ZAPI_INSTANCE = defineSecret('ZAPI_INSTANCE');

/**
 * Z-API Token
 * Get from your Z-API dashboard
 */
export const ZAPI_TOKEN = defineSecret('ZAPI_TOKEN');

/**
 * Z-API Client Token
 * Get from your Z-API dashboard
 */
export const ZAPI_CLIENT_TOKEN = defineSecret('ZAPI_CLIENT_TOKEN');

// ==================== STRINGS ====================
// Strings são valores não-sensíveis (podem aparecer em logs)

/**
 * Events API URL
 * Used for internal communication between functions
 * Default: Firebase Functions URL in us-central1
 */
export const EVENTS_API_URL = defineString('EVENTS_API_URL', {
    default: 'http://127.0.0.1:5001/fast-hackathon-andre/us-central1/events-api',
    description: 'URL for the Events API endpoint',
});

/**
 * Helper function to check if running in emulator
 */
export function isEmulator(): boolean {
    return process.env.FUNCTIONS_EMULATOR === 'true';
}

/**
 * Helper function to get all required secrets for a function
 * Use this in your function declaration to ensure all secrets are available
 */
export const allSecrets = [
    OPENAI_API_KEY,
    ZAPI_INSTANCE,
    ZAPI_TOKEN,
    ZAPI_CLIENT_TOKEN,
];

/**
 * Helper to get environment-specific configuration
 */
export function getEnvConfig() {
    return {
        isProduction: !isEmulator(),
        isEmulator: isEmulator(),
    };
}


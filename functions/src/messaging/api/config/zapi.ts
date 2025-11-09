export const ZAPI_CONFIG = {
    instance: process.env.ZAPI_INSTANCE || '',
    token: process.env.ZAPI_TOKEN || '',
    clientToken: process.env.ZAPI_CLIENT_TOKEN || '',
    baseUrl: 'https://api.z-api.io',
};

export function getZApiUrl(endpoint: string): string {
    return `${ZAPI_CONFIG.baseUrl}/instances/${ZAPI_CONFIG.instance}/token/${ZAPI_CONFIG.token}/${endpoint}`;
}

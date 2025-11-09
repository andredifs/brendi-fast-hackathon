import { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } from '../../../config/env';

export function getZApiConfig() {
    return {
        instance: ZAPI_INSTANCE.value(),
        token: ZAPI_TOKEN.value(),
        clientToken: ZAPI_CLIENT_TOKEN.value(),
        baseUrl: 'https://api.z-api.io',
    };
}

export function getZApiUrl(endpoint: string): string {
    const config = getZApiConfig();
    return `${config.baseUrl}/instances/${config.instance}/token/${config.token}/${endpoint}`;
}

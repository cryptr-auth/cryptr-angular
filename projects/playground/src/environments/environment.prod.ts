if (process === undefined) {
  throw new Error("process undefined");
}

export const environment = {
  cryptrConfig: {
    audience: (process && process.env.CRYPTR_AUDIENCE) || 'https://your-prod.angular.app',
    client_id: (process && process.env.CRYPTR_CLIENT_ID) || 'your-client-id',
    cryptr_base_url: (process && process.env.CRYPTR_BASE_URL) || 'https://auth.cryptr.dev',
    dedicated_server: true,
    default_redirect_uri: (process && process.env.CRYPTR_DEFAULT_REDIRECT_URI) || 'https://your-prod.angular.app',
    default_slo_after_revoke: false,
    httpInterceptor: {
      apiRequestsToSecure: (process && process.env.CRYPTR_API_TO_SECURE) ?
        process.env.CRYPTR_API_TO_SECURE.split(',') : ['https://your.backend.api'],
    },
    tenant_domain: (process && process.env.CRYPTR_TENANT_DOMAIN) || 'your-tenant-domain',
  },
  production: true,
  resource_server_url: (process && process.env.CRYPTR_RESOURCE_SERVER_URL) || 'https://your.backend.api',
  targetUrl: (process && process.env.CRYPTR_TARGET_URL) || 'https://your-prod.angular.app',
};

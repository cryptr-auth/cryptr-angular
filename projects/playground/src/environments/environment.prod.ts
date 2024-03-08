export const environment = {
  production: true,
  cryptrConfig: {
    audience: process.env.CRYPTR_AUDIENCE || "https://your-prod.angular.app",
    tenant_domain: process.env.CRYPTR_TENANT_DOMAIN || "your-tenant-domai",
    client_id: process.env.CRYPTR_CLIENT_ID || "your-client-id",
    cryptr_base_url: process.env.CRYPTR_BASE_URL || "https://auth.cryptr.dev",
    default_redirect_uri: process.env.CRYPTR_DEFAULT_REDIRECT_URI || "https://your-prod.angular.app",
    default_slo_after_revoke: false,
    httpInterceptor: {
      apiRequestsToSecure: process.env.CRYPTR_API_TO_SECURE || []
    },
    dedicated_server: true,
  },
  resource_server_url: process.env.CRYPTR_RESOURCE_SERVER_URL || "https://your.backend.api",
  targetUrl: process.env.CRYPTR_TARGET_URL || "https://your-prod.angular.app",
};

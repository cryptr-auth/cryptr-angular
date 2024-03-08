export const environment = {
  production: true,
  cryptrConfig: {
    audience: process.env.CRYPTR_AUDIENCE,
    tenant_domain: process.env.CRYPTR_TENANT_DOMAIN,
    client_id: process.env.CRYPTR_CLIENT_ID,
    cryptr_base_url: process.env.CRYPTR_BASE_URM,
    default_redirect_uri: process.env.CRYPTR_DEFAULT_REDIRECT_URI,
    default_slo_after_revoke: false,
    httpInterceptor: {
      apiRequestsToSecure: process.env.CRYPTR_API_TO_SECURE
    },
    dedicated_server: true,
  },
  resource_server_url: process.env.CRYPTR_RESOURCE_SERVER_URL,
  targetUrl: process.env.CRYPTR_TARGET_URL,
};

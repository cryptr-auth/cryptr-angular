export const environment = {
  production: true,
  cryptrConfig: {
    audience: process.env.CRYPTR_AUDIENCE || "https://cryptr-angular-playground.onrender.com",
    tenant_domain: process.env.CRYPTR_TENANT_DOMAIN || "areon-holdings-co",
    client_id: process.env.CRYPTR_CLIENT_ID || "30b3cfdd-2579-4252-b9a2-11c47a107d72",
    cryptr_base_url: process.env.CRYPTR_BASE_URM || "https://cleeck-umbrella-staging-eu.onrender.com",
    default_redirect_uri: process.env.CRYPTR_DEFAULT_REDIRECT_URI || "https://cryptr-angular-playground.onrender.com/",
    default_slo_after_revoke: false,
    httpInterceptor: {
      apiRequestsToSecure: process.env.CRYPTR_API_TO_SECURE ? process.env.CRYPTR_API_TO_SECURE.split(',') : ['https://cryptr-express-staging-backend.onrender.com/*']
    },
    telemetry: false,
    dedicated_server: true
  },
  resource_server_url: process.env.CRYPTR_RESOURCE_SERVER_URL || 'https://cryptr-express-staging-backend.onrender.com',
  idpIds: process.env.CRYPTR_IDP_IDS ? process.env.CRYPTR_IDP_IDS.split(',') : ["comcast_RrmZYfWTWncWmQ26QPVgbe", "envirogreen_agency_LNAFPoFHsKzGVVujYKjQQR"],
  targetUrl: process.env.CRYPTR_TARGET_URL || "https://cryptr-angular-playground.onrender.com",
};

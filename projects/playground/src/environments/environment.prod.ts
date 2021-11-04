export const environment = {
  production: true,
  cryptrConfig: {
    audience: "https://cryptr-angular-playground.onrender.com",
    tenant_domain: "comcast",
    client_id: "30b3cfdd-2579-4252-b9a2-11c47a107d72",
    cryptr_base_url: "https://cleeck-umbrella-staging-eu.onrender.com",
    default_redirect_uri: "https://cryptr-angular-playground.onrender.com/",
    default_locale: "fr",
    httpInterceptor: {
      apiRequestsToSecure: [
        'https://cryptr-express-staging-backend.onrender.com/*',
      ]
    },
    telemetry: false
  },
  resource_server_url: 'https://cryptr-express-staging-backend.onrender.com',
  idpId: "comcast_RrmZYfWTWncWmQ26QPVgbe",
  targetUrl: "https://cryptr-angular-playground.onrender.com",
};

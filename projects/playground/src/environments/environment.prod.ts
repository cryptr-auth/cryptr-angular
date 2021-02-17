export const environment = {
  production: true,
  cryptrConfig: {
    audience: "https://cryptr-angular-playground.onrender.com",
    tenant_domain: "shark-academy",
    client_id: "d3397950-379e-4f65-8dd4-4ae9cca63401",
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
};

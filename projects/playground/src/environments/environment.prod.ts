export const environment = {
  production: true,
  cryptrConfig: {
    audience: "https://cryptr-angular-playground.onrender.com",
    tenant_domain: "areon-holdings-co",
    client_id: "30b3cfdd-2579-4252-b9a2-11c47a107d72",
    cryptr_base_url: "https://cleeck-umbrella-staging-eu.onrender.com",
    default_redirect_uri: "https://cryptr-angular-playground.onrender.com/",
    default_locale: "fr",
    httpInterceptor: {
      apiRequestsToSecure: [
        'https://cryptr-express-staging-backend.onrender.com/*',
      ]
    },
    telemetry: false,
    dedicated_server: true,
    prefered_auth_method: 'gateway'
  },
  resource_server_url: 'https://cryptr-express-staging-backend.onrender.com',
  idpIds: ["comcast_RrmZYfWTWncWmQ26QPVgbe", "envirogreen_agency_LNAFPoFHsKzGVVujYKjQQR"],
  targetUrl: "https://cryptr-angular-playground.onrender.com",
};

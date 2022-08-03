export const environment = {
  production: true,
  cryptrConfig: {
    audience: "https://cryptr-angular-playground-pr-47.onrender.com",
    tenant_domain: "areon-holdings-co",
    client_id: "fb6676d4-af7d-4703-805d-ffc693d31ea2",
    cryptr_base_url: "https://cleeck-umbrella-staging-eu.onrender.com",
    default_redirect_uri: "https://cryptr-angular-playground-pr-47.onrender.com/",
    default_locale: "fr",
    httpInterceptor: {
      apiRequestsToSecure: [
        'https://cryptr-express-staging-backend.onrender.com/*',
      ]
    },
    telemetry: false,
    dedicated_server: true,
  },
  resource_server_url: 'https://cryptr-express-staging-backend.onrender.com',
  idpIds: ["comcast_RrmZYfWTWncWmQ26QPVgbe", "flametech_B468fhGyJgYKauZSXbdxVg", "envirogreen_agency_LNAFPoFHsKzGVVujYKjQQR", "metro_cash_RbYDv2qHSyVJ96h6VkthjV"],
  targetUrl: "https://cryptr-angular-playground-pr-47.onrender.com",
};

export const environment = {
  production: true,
  cryptrConfig: {
    audience: "https://cryptr-angular-demo.onrender.com",
    tenant_domain: "shark-academy",
    client_id: "04a51f2c-a7ea-4399-a5cb-9f7dbe3ece53",
    default_redirect_uri: "https://cryptr-angular-demo.onrender.com/",
    httpInterceptor: {
      apiRequestsToSecure: [
        'https://cryptr-angular-express-backend.onrender.com/*',
      ]
    },
    telemetry: false
  },
  resource_server_url: 'https://cryptr-angular-express-backend.onrender.com',
};

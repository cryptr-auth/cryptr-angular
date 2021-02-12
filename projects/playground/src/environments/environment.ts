// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// client_id: '09788ea8-8e5e-40ab-8f1e-00612dbb931b',
export const environment = {
  production: false,
  cryptrConfig: {
    audience: 'http://localhost:4200',
    tenant_domain: 'shark-academy',
    client_id: '724b141a-e1eb-4f5b-bfca-22eca8ae3cc4',
    default_redirect_uri: 'http://localhost:4200/',
    // region: 'us',
    cryptr_base_url: 'http://localhost:4000',
    default_locale: 'fr',
    httpInterceptor: {
      apiRequestsToSecure: [
        'http://localhost:5000/*',
      ]
    },
    telemetry: false,
    has_ssr: true,
  },
  resource_server_url: 'http://localhost:5000',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

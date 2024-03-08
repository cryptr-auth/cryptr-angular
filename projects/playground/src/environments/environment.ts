// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AuthnMethod } from 'projects/cryptr/cryptr-angular/src/lib/utils/types';

// client_id: '09788ea8-8e5e-40ab-8f1e-00612dbb931b',
export const environment = {
  production: false,
  cryptrConfig: {
    audience: 'http://localhost:4200',
    tenant_domain: 'communitiz-app',
    client_id: '271a669b-7ee6-4ec7-b4d3-39bc0db6b33c',
    default_redirect_uri: 'http://localhost:4200',
    // region: 'us',
    cryptr_base_url: 'https://communitiz-app.cryptr.dev',
    default_locale: 'fr',
    default_slo_after_revoke: false,
    httpInterceptor: {
      apiRequestsToSecure: [
        'http://localhost:5000/*',
      ]
    },
    has_ssr: true,
    dedicated_server: true,
  },
  resource_server_url: 'http://localhost:5000',
  targetUrl: 'http://localhost:4200',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

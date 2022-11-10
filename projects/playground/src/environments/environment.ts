// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AuthnMethod } from 'projects/cryptr/cryptr-angular/src/lib/utils/types';

// client_id: '09788ea8-8e5e-40ab-8f1e-00612dbb931b',
export const environment = {
  production: false,
  cryptrConfig: {
    audience: 'http://localhost:4200',
    tenant_domain: 'cryptr',
    // client_id: 'f407cafd-b58a-472f-b857-475a863b69b6',
    client_id: '1abcf9f0-c641-4630-9362-2046f96b2a97',
    default_redirect_uri: 'http://localhost:4200',
    // region: 'us',
    cryptr_base_url: 'https://samly.howto:4443',
    default_locale: 'fr',
    httpInterceptor: {
      apiRequestsToSecure: [
        'http://localhost:5000/*',
      ]
    },
    telemetry: false,
    has_ssr: true,
    dedicated_server: false,
    prefered_auth_method: 'gateway',
  },
  resource_server_url: 'http://localhost:5000',
  idpIds: ['shark_academy_bWoMxSFWKhQt6WAm4AucGk', 'blockpulse_6Jc3TGatGmsHzexaRP5ZrE'],
  // idpId: 'shark_academy_58BB2Evky9GkDrkpddr3w6',
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

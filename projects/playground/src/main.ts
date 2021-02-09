import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import * as LogRocket from 'logrocket';
// import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

if (environment.production) {
  enableProdMode();
  // LogRocket.init('owmps8/cryptr-angular-demo');

  // Sentry.init({
  //   dsn: 'https://318dc46db81c4bf1ace15384c27dd655@o468922.ingest.sentry.io/5592365',
  //   autoSessionTracking: true,
  //   integrations: [
  //     new Integrations.BrowserTracing({
  //       tracingOrigins: ['localhost', 'https://cryptr-angular-develop-pr-19.onrender.com', 'onrender.com', 'cryptr-angular-develop-pr-19.onrender.com'],
  //       routingInstrumentation: Sentry.routingInstrumentation,
  //     }),
  //   ],
  //   beforeSend(event): Sentry.Event {
  //     LogRocket.getSessionURL(sessionUrl => {
  //       Sentry.configureScope(scope => {
  //         scope.setExtra('sessionURL', sessionUrl);
  //       });
  //       Sentry.setExtra('LogRocketSession', sessionUrl);
  //       Sentry.setTag('LogRocket', sessionUrl);
  //     });
  //     return event;
  //   },

  //   // We recommend adjusting this value in production, or using tracesSampler
  //   // for finer control
  //   tracesSampleRate: 1.0,
  // });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

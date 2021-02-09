import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ReactComponent } from './pages/react/react.component';
import { GraphqlComponent } from './pages/graphql/graphql.component';
import { GrowthHackerComponent } from './pages/growth-hacker/growth-hacker.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { CommonModule } from '@angular/common'
// import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthModule } from 'projects/cryptr/cryptr-angular/src/lib/auth.module';
import { AccountAccessButtonComponent } from 'projects/cryptr/cryptr-angular/src/lib/account-access-button/account-access-button.component';
import { AuthHttpInterceptor } from 'projects/cryptr/cryptr-angular/src/lib/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    ReactComponent,
    GraphqlComponent,
    GrowthHackerComponent,
    MyCoursesComponent,
  ],
  imports: [
    // CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(environment.cryptrConfig),
  ],
  providers: [
    AccountAccessButtonComponent,
    // {
    //   provide: ErrorHandler,
    //   useValue: Sentry.createErrorHandler({
    //     showDialog: true,
    //   }),
    // },
    // {
    //   provide: Sentry.TraceService,
    //   deps: [Router],
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: () => () => { },
    //   deps: [Sentry.TraceService],
    //   multi: true,
    // },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

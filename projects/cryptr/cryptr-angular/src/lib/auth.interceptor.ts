import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Observable, from, of, iif } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import {
  AuthConfig,
  AuthConfigService,
  HttpInterceptorRouteConfig,
  ApiRouteDefinition,
  isHttpInterceptorRouteConfig,
} from './auth.config';

import { CleeckClientService } from './auth.client';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AuthConfigService) private config: AuthConfig,
    @Inject(CleeckClientService) private cleeckClient: any
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const aToken = this.cleeckClient.getCurrentAccessToken();
    let finalReq = req;

    if (this.config.httpInterceptor?.apiRequestsToSecure !== undefined && aToken !== undefined) {
      this.config.httpInterceptor.apiRequestsToSecure.forEach(route => {
        if (this.canAttachToken(route, req)) {

          finalReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${aToken}`),
          });
        }
      });
    }
    return next.handle(finalReq);
  }

  /**
   * Strips the query and fragment from the given uri
   * @param uri The uri to remove the query and fragment from
   */
  private stripQueryFrom(uri: string): string {
    if (uri.indexOf('?') > -1) {
      uri = uri.substr(0, uri.indexOf('?'));
    }

    if (uri.indexOf('#') > -1) {
      uri = uri.substr(0, uri.indexOf('#'));
    }

    return uri;
  }

  /**
   * Determines whether the specified route can have an access token attached to it, based on matching the HTTP request against
   * the interceptor route configuration.
   * @param route The route to test
   * @param request The HTTP request
   */
  private canAttachToken(
    route: ApiRouteDefinition,
    request: HttpRequest<any>
  ): boolean {
    const testPrimitive = (value: string) => {
      if (value) {
        value.trim();
      }

      if (!value) {
        return false;
      }

      const requestPath = this.stripQueryFrom(request.url);

      if (value === requestPath) {
        return true;
      }

      // If the URL ends with an asterisk, match using startsWith.
      if (
        value.indexOf('*') === value.length - 1 &&
        request.url.startsWith(value.substr(0, value.length - 1))
      ) {
        return true;
      }
    };

    if (isHttpInterceptorRouteConfig(route)) {
      if (route.httpMethod && route.httpMethod !== request.method) {
        return false;
      }

      return testPrimitive(route.uri);
    }

    return testPrimitive(route);
  }

  /**
   * Tries to match a route from the SDK configuration to the HTTP request.
   * If a match is found, the route configuration is returned.
   * @param request The Http request
   */
  private findMatchingRoute(
    request: HttpRequest<any>
  ): Observable<HttpInterceptorRouteConfig> {
    return from(this.config.httpInterceptor.apiRequestsToSecure).pipe(
      first((route) => this.canAttachToken(route, request), null)
    );
  }
}

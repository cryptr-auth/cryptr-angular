import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

/**
 * Defines a common set of HTTP methods.
 */
export const enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Head = 'HEAD',
}

export type ApiRouteDefinition = HttpInterceptorRouteConfig | string;


export function isHttpInterceptorRouteConfig(
  def: ApiRouteDefinition
): def is HttpInterceptorRouteConfig {
  return (def as HttpInterceptorRouteConfig).uri !== undefined;
}

export interface HttpInterceptorConfig {
  apiRequestsToSecure: ApiRouteDefinition[];
}

export interface HttpInterceptorRouteConfig {
  uri: string;
  tokenOptions?: any;
  httpMethod?: HttpMethod | string;
}

export interface AuthConfig {
  tenant_domain: string;
  client_id: string;
  audience: string;
  default_redirect_uri: string;
  region?: string;
  default_locale?: string;
  cryptr_base_url?: string;
  httpInterceptor: HttpInterceptorConfig;
  other_key?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthClientConfig {
  private config: AuthConfig;

  constructor(@Optional() @Inject(AuthConfigService) config?: AuthConfig) {
    if (config) {
      this.set(config);
    }
  }

  /**
   * Sets configuration to be read by other consumers of the service (see usage notes)
   * @param config The configuration to set
   */
  set(config: AuthConfig): void {
    this.config = config;
  }

  /**
   * Gets the config that has been set by other consumers of the service
   */
  get(): AuthConfig {
    return this.config;
  }
}

export const AuthConfigService = new InjectionToken<AuthConfig>(
  'cryptr-angular.config'
);

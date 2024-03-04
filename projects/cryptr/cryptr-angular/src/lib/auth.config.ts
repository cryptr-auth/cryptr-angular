import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Config } from '@cryptr/cryptr-spa-js/dist/types/interfaces';
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

/** Definitions for route secure */
export type ApiRouteDefinition = HttpInterceptorRouteConfig | string;

/** @ignore */
export function isHttpInterceptorRouteConfig(
  def: ApiRouteDefinition
): def is HttpInterceptorRouteConfig {
  return (def as HttpInterceptorRouteConfig).uri !== undefined;
}

/** Cryptr configuration to secure routing requests */
export interface HttpInterceptorConfig {
  /** List of URIs to secure with Cryptr session access token */
  apiRequestsToSecure: ApiRouteDefinition[];
}

/** @ignore */
export interface HttpInterceptorRouteConfig {
  uri: string;
  tokenOptions?: any;
  httpMethod?: HttpMethod | string;
}

/** Cryptr Authentication configuration for Angular */
export interface AuthConfig extends Config {
  /** cryptr http Interceptor for current application */
  httpInterceptor: HttpInterceptorConfig
  /** defines if SLO is always ran after token revocation */
  default_slo_after_revoke: boolean
  /** @ignore */
  other_key?: string
}

/** Manage Cryptr authentication client configuration */
@Injectable({ providedIn: 'root' })
export class AuthClientConfig {
  /** @ignore */
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

/** Cryptr Authentication configuration service */
export const AuthConfigService = new InjectionToken<AuthConfig>(
  'cryptr-angular.config'
);

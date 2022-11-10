import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AuthnMethod } from './utils/types';

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
export interface AuthConfig {
  /** cryptr tenant domain of current application */
  tenant_domain: string;
  /** cryptr client ID of current application */
  client_id: string;
  /** Audience URL of current application */
  audience: string;
  /** Default Redirect URI of current application */
  default_redirect_uri: string;
  /** cryptr region of current application */
  region?: string;
  /** Default locale for current application */
  default_locale?: string;
  /** Cryptr service URL for current application */
  cryptr_base_url?: string;
  /** cryptr http Interceptor for current application */
  httpInterceptor: HttpInterceptorConfig;
  /** Is Current application is running is a SSR support */
  has_ssr?: boolean;
  /** Activate Cryptr telemetry reporting */
  telemetry?: boolean;
  /** false if you are using our shared instance */
  dedicated_server?: boolean;
  /** Prefered authentication method for default authentication */
  prefered_auth_method?: AuthnMethod;
  /** @ignore */
  other_key?: string;
}

/** Manage Cryptr authentication client configuration */
@Injectable({ providedIn: 'root' })
export class AuthClientConfig {
  /** @ignore */
  private config: AuthConfig;

  /** @ignore */
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

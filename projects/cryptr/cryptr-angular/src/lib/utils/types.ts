/**
 * Cryptr sign types
 */
export enum Sign {
  Invite = 'invite',
  In = 'signin',
  Up = 'signup',
  Refresh = 'refresh'
}

export enum AuthnMethod {
  MagicLink = 'magic_link',
  Gateway = 'gateway',
}

/** @ignore */
export interface Authorization {
  id: string;
  code: string;
}

/**
 * Result of tokens response
 */
export interface Tokens {
  /** is token response returns sucessfully */
  valid: boolean;
  /** access token value */
  accessToken?: string;
}

/**
 * Cryptr config interface
 */
export interface Config {
  /** Tenant domain */
  tenant_domain: string;
  /** Cryptr Client ID */
  client_id: string;
  /** Application audience URL */
  audience: string;
  /**
   * Default redirect URI for application
   * after Cryptr authentication process
   */
  default_redirect_uri: string;
  /** Default locale for Cryptr SDK in application */
  default_locale?: string;
  /** region used for Cryptr integration */
  region?: string;
  /** Cryptr Service URL for this application */
  cryptr_base_url?: string;
  /** Activate Cryptr telemetry reporting */
  telemetry?: boolean;
  /** Set to true if you have your own Cryptr dedicated server */
  dedicated_server?: boolean;
  /** Prefered authentication method for default authentication */
  preferedAuthMethod?: AuthnMethod | string;
}

/** @ignore */
export interface AuthResponseError {
  field: string;
  message: string;
}

/**
 * Token error response interface
 */
export interface TokenError {
  /**
   * Response error body of token request
   */
  http_response: any;
  /**
   * Error message of token request failure
   */
  error: string;
  /**
   * Error description of token request failure
   */
  error_description: string;
}

/** @ignore */
export interface RefreshStore {
  refresh_token: string;
  access_token_expiration_date: number;
  refresh_expiration_date: number;
  refresh_leeway: number;
  refresh_retry: number;
}

export interface SignOptsAttrs {
  scope?: string;
  redirectUri?: string;
  locale?: string;
}
export interface SsoSignOptsAttrs extends SignOptsAttrs {
  clientId?: string;
  tenantDomain?: string;
}

/** @ignore */
export interface CryptrClient {
  config: Config;
  getCurrentAccessToken(): string | undefined;
  getCurrentIdToken(): string | undefined;
  isAuthenticated(): Promise<boolean>;
  finalScope(scope?: string): string;
  signInWithDomain(orgDomain?: string, options?: SsoSignOptsAttrs): Promise<void>;
  signInWithEmail(email: string, options?: SsoSignOptsAttrs): Promise<void>;
  handleTokensErrors(errors: TokenError[]): boolean;
  handleNewTokens(refreshStore: RefreshStore, tokens?: any): void;
  handleRedirectCallback(): Promise<any>;
  canRefresh(refreshStore: RefreshStore): boolean;
  getRefreshStore(): RefreshStore;
  handleRefreshTokens(): Promise<boolean>;
  recurringRefreshToken(refreshTokenWrapper: RefreshStore): void;
  getUser(): object | undefined;
  getClaimsFromAccess(accessToken: string): object | null;
  canHandleAuthentication(searchParams?: string): boolean;
  logOut(callback: any, location?: Location, targetUrl?: string): Promise<boolean>;
  decoratedRequest(axiosRequestConfig: any): any;
}

/**
 * Cryptr User simplest representation
 */
export interface User {
  /** email of end user */
  email: string;
}

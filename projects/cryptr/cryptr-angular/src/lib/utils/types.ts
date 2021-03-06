/**
 * Cryptr sign types
 */
export enum Sign {
  Invite = 'invite',
  In = 'signin',
  Up = 'signup',
  Refresh = 'refresh'
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

/** @ignore */
export interface CryptrClient {
  config: Config;
  getCurrentAccessToken(): string | undefined;
  getCurrentIdToken(): string | undefined;
  isAuthenticated(): Promise<boolean>;
  finalScope(scope?: string): string;
  signInWithoutRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  signUpWithoutRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  inviteWithoutRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  signInWithRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  signUpWithRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  inviteWithRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  handleInvitationState(scope?: string): Promise<void>;
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
  canHandleInvitation(searchParams?: string): boolean;
  userAccountAccess(): Promise<import('axios').AxiosResponse<any> | undefined>;
  logOut(callback: any, location?: Location): Promise<boolean>;
  decoratedRequest(axiosRequestConfig: any): any;
}

/**
 * Cryptr User simplest representation
 */
export interface User {
  /** email of end user */
  email: string;
}

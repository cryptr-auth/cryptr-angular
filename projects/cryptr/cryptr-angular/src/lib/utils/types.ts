export enum Sign {
  Invite = 'invite',
  In = 'signin',
  Up = 'signup',
  Refresh = 'refresh'
}
export interface Authorization {
  id: string;
  code: string;
}

export interface Tokens {
  valid: boolean;
  accessToken?: string;
}

export interface Config {
  tenant_domain: string;
  client_id: string;
  audience: string;
  default_redirect_uri: string;
  default_locale?: string;
  region?: string;
  cryptr_base_url?: string;
  telemetry?: boolean;
}

export interface AuthResponseError {
  field: string;
  message: string;
}
export interface TokenError {
  http_response: any;
  error: string;
  error_description: string;
}

export interface RefreshStore {
  refresh_token: string;
  access_token_expiration_date: number;
  refresh_expiration_date: number;
  refresh_leeway: number;
  refresh_retry: number;
}

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

export interface User {
  email: string;
}

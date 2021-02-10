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

export interface CryptrClient {
  config: Config;
  getCurrentAccessToken(): string | undefined;
  getCurrentIdToken(): string | undefined;
  isAuthenticated(): Promise<boolean>;
  handleRefreshTokens(response: any): void;
  refreshTokens(): Promise<void>;
  signInWithoutRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  signUpWithoutRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  inviteWithoutRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  signInWithRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  signUpWithRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  inviteWithRedirect(scope?: string, redirectUri?: string, locale?: string): Promise<void>;
  handleInvitationState(scope?: string): Promise<void>;
  handleRedirectCallback(): Promise<any>;
  getUser(): object | undefined;
  getClaimsFromAccess(accessToken: string): object | null;
  canHandleAuthentication(searchParams?: string): boolean;
  canHandleInvitation(searchParams?: string): Promise<boolean>;
  userAccountAccess(): Promise<import('axios').AxiosResponse<any> | undefined>;
  logOut(callback: any, location?: Location): Promise<boolean>;
  decoratedRequest(axiosRequestConfig: any): import('axios').AxiosPromise<any>;
}

export interface User {
  email: string;
}

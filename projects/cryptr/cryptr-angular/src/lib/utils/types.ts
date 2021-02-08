export enum Sign {
  Invite = 'invite',
  In = 'signin',
  Up = 'signup',
  Refresh = 'refresh'
}
export type Locale = 'en' | 'fr'

export type Region = 'eu' | 'us'
export interface Authorization {
  id: string;
  code: string;
}

export interface Config {
  tenant_domain: string;
  client_id: string;
  audience: string;
  default_redirect_uri: string;
  default_locale?: Locale;
  region?: Region;
  cryptr_base_url?: string;
  telemetry?: boolean;
}

export interface CryptrClient {
  config: Config;
  getCurrentAccessToken(): string;
  getCurrentIdToken(): string;
  isAuthenticated(): Promise<boolean>;
  handleRefreshTokens(response: any): void;
  refreshTokens(): Promise<void>;
  signInWithoutRedirect(scope?: string, redirectUri?: string, locale?: Locale): Promise<void>;
  signUpWithoutRedirect(scope?: string, redirectUri?: string, locale?: Locale): Promise<void>;
  inviteWithoutRedirect(scope?: string, redirectUri?: string, locale?: Locale): Promise<void>;
  signInWithRedirect(scope?: string, redirectUri?: string, locale?: Locale): Promise<void>;
  signUpWithRedirect(scope?: string, redirectUri?: string, locale?: Locale): Promise<void>;
  inviteWithRedirect(scope?: string, redirectUri?: string, locale?: Locale): Promise<void>;
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

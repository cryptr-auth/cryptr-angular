import { Inject, Injectable, OnDestroy } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { AuthnMethod, Config, CryptrClient, SsoSignOptsAttrs, Tokens } from './utils/types';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { CryptrClientService } from './auth.client';
import { filter, map } from 'rxjs/operators';
import { DEFAULT_SCOPE } from './utils/constants';
import { AuthClientConfig } from './auth.config';

/**
 * AuthService - Cryptr Authentication Service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  /** @ignore */
  private ngUnsubscribe$ = new Subject();
  /** @ignore */
  private authenticated$ = new BehaviorSubject(false);
  /** @ignore */
  private user$ = new BehaviorSubject(null);
  /** @ignore */
  private isLoading$ = new BehaviorSubject(true);

  constructor(
    @Inject(CryptrClientService) private cryptrClient: CryptrClient,
    private location: Location,
    private navigator: AbstractNavigator,
    private router: Router,
    private route: ActivatedRoute,
    private configFactory: AuthClientConfig,
  ) {
    this.checkAuthentication();
    window.addEventListener(CryptrSpa.events.REFRESH_INVALID_GRANT, (RigError) => {
      this.logOut(null);
    });
    window.addEventListener(CryptrSpa.events.REFRESH_EXPIRED, (ReError) => {
      this.logOut(null);
    });
  }

  /** @ignore */
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Performs redirection to Cryptr for signin process with chosen args
   * @deprecated since version 1.2.0. Please now refer to `signInWithDomain`or `signInWithEmail`
   * @example
   * Default usage
   * signInWithRedirect()
   *
   * @example
   * Usage with custom scope
   * signInWithRedirect("email openid profile read:invoices")
   *
   * @example
   * Usage with custom locale
   * signInWithRedirect("email openid profile", "fr")
   *
   * @example
   * Usage with custom locale
   * signInWithRedirect("email openid profile", "en", "http://localhsot:4201")
   *
   * @param scope - Default: `"email openid profile"`. Scopes requested for this sign in process (whitespace separator)
   * @param locale - Default: `config.default_locale` value. locale for this sign in process.
   * @param redirectUri - Default: `config.default_redirect_uri` value. URI where to redirect after sign in process.
   * @returns Observable of this signin redirection
   */
  signInWithRedirect(scope?: string, locale?: string, redirectUri?: string): Observable<any> {
    if (this.cryptrClient) {
      return from(this.cryptrClient.signInWithRedirect(scope, redirectUri, locale));
    }
  }

  /**
   * Performs redirection to Cryptr for signup process with chosen args
   * @example
   * Default usage
   * signUpWithRedirect()
   *
   * @example
   * Usage with custom scope
   * signUpWithRedirect("email openid profile read:invoices")
   *
   * @example
   * Usage with custom locale
   * signUpWithRedirect("email openid profile", "fr")
   *
   * @example
   * Usage with custom locale
   * signUpWithRedirect("email openid profile", "en", "http://localhsot:4201")
   *
   * @param scope - Default: `"email openid profile"`. Scopes requested for this sign up process (whitespace separator).
   * @param locale - Default: `config.default_locale` value. locale for this sign up process.
   * @param redirectUri - Default: `config.default_redirect_uri` value. URI where to redirect after sign up process.
   * @returns Observable of this signup redirection
   */
  signUpWithRedirect(scope?: string, locale?: string, redirectUri?: string): Observable<any> {
    return from(this.cryptrClient.signUpWithRedirect(scope, redirectUri, locale));
  }

  /**
   * @deprecated since version 1.2.0. Please now refer to `signInWithDomain`or `signInWithEmail`
   *
   * Starts SSO process for specific ID
   *
   * @example
   * Default usage
   * signInWithSso('some_company_bWoMxSFWKhQt6WAm4AucGk')
   *
   * @example
   * Usage with custom locale
   * signInWithSso('some_company_bWoMxSFWKhQt6WAm4AucGk', { locale: 'fr' })
   *
   * @param idpId - SSO Connection ID reference.
   * @param options - Optional. Customize process, See SsoSignOptsAttrs
   * @returns Observable of SSO process.
   */
  public signInWithSso(idpId: string, options?: SsoSignOptsAttrs): Observable<void> {
    return from(this.cryptrClient.signInWithSSO(idpId, options));
  }

  /**
   * @deprecated since version 1.2.0. Please now refer to `signInWithDomain`or `signInWithEmail`
   * Starts SSO Gateway Process
   *
   * @example
   * Bare usage
   * signInWithSsoGateway()
   *
   * @example
   * Bare usage with custom locale
   * signInWithSsoGateway(null, { locale: 'fr' })
   *
   * @example
   * Simple SSO usage
   * signInWithSsoGateway('some_company_bWoMxSFWKhQt6WAm4AucGk')
   *
   * @example
   * Multi SSO usage
   * signInWithSsoGateway(['some_company_bWoMxSFWKhQt6WAm4AucGk', 'other_company_6Jc3TGatGmsHzexaRP5ZrE'])
   *
   * @param idpId - Optional string or string[] to reference SSO Connection(s) ID(s)
   * @param options - Optional. Customize process, See SsoSignOptsAttrs
   * @returns Observable of SSO process
   */
  public signInWithSsoGateway(idpId?: string | string[], options?: SsoSignOptsAttrs): Observable<void> {
    return from(this.cryptrClient.signInWithSSOGateway(idpId, options));
  }

  /**
   * Starts Authentication process for a precise organization
   * @example
   *
   * Bare usage to authenticate user without any context
   * signInWithDomain(null, { locale: 'fr' })
   *
   * Starts authentication process for Organization with domain `company-name`
   * signInWithDomain('company-name')
   *
   * Starts authnetication process for Organization and defined locale
   * signInWithDomain('company-name', { locale: 'fr' })
   *
   * @param orgDomain - Optional. Organization's domain
   * @param options - Optional. Customize process, see SsoSignOptsAttrs
   * @returns Observable of the authentication process for an Organization user
   */
  public signInWithDomain(orgDomain?: string, options?: SsoSignOptsAttrs): Observable<void> {
    return from(this.cryptrClient.signInWithDomain(orgDomain, options));
  }

  /**
   * Starts Authentication process for a precise user email
   * @example
   *
   * Bare usage to authenticate user without any context
   * signInWithEmail(null, { locale: 'fr' })
   *
   * Starts authentication process for Organization with domain `company-name`
   * signInWithEmail('company-name')
   *
   * Starts authnetication process for Organization and defined locale
   * signInWithEmail('company-name', { locale: 'fr' })
   *
   * @param email - Required. Organization's domain
   * @param options - Optional. Customize process, see SsoSignOptsAttrs
   * @returns Observable of the authentication process for an Organization user
   */
  public signInWithEmail(email: string, options?: SsoSignOptsAttrs): Observable<void> {
    return from(this.cryptrClient.signInWithEmail(email, options));
  }

  /**
   * Destroy current session with specific action
   * @param callback - Action to call at the end of logout process
   * @param location - **Default:** `window.location`. Where to redirect after logout process
   * @param targetUrl - Optional | **Default:** `window.location.href`. Where to redirect after SLO process
   * @returns process logout of session with callback call
   */
  logOut(callback: () => void, location: undefined | globalThis.Location = window.location, targetUrl?: string): Observable<any> {
    const target = targetUrl === undefined || targetUrl === 'undefined' ? window.location.href : targetUrl;
    return from(this.cryptrClient.logOut(this.preLogOutCallBack(callback), location, target));
  }

  /** @ignore */
  canHandleAuthentication(): boolean {
    return this.cryptrClient.canHandleAuthentication();
  }

  /** @ignore */
  handleRedirectCallback(): Promise<any> {
    try {
      return this.cryptrClient.handleRedirectCallback();
    } catch (error) {
      console.error(error);
    }
  }

  /** @ignore */
  handleTokens(tokens: Tokens): boolean {
    // console.log('tokens');
    // console.log(tokens);
    const { valid, accessToken } = tokens;
    this.updateCurrentAuthState(valid && accessToken !== undefined);
    if (this.authenticated$.value) {
      this.setUser(this.getClientUser());
    } else {
      console.error('handling tokens failed');
      console.error(tokens);
    }
    return this.authenticated$.value;
  }

  /**
   * Retrieve authentication state
   * @returns authentication state in a Promise
   */
  isAuthenticated(): Promise<boolean> {
    return this.cryptrClient.isAuthenticated();
  }

  /**
   * Retrieve current stored access token
   * @returns Current session access_token or undefined if no live session
   */
  getAccessToken(): string | undefined {
    return this.cryptrClient.getCurrentAccessToken();
  }

  /**
   * retrieve current stored id token
   * @returns Current session id_token or undefined if no live session.
   */
  getIdToken(): string | undefined {
    return this.cryptrClient.getCurrentIdToken();
  }

  /** @ignore */
  getClientUser(): any {
    return this.cryptrClient.getUser();
  }

  /**
   * Opens user account page.
   * @returns Promise of retrieving/opening page
   */
  userAccountAccess(): Promise<any> {
    return this.cryptrClient.userAccountAccess();
  }

  /**
   * Refresh current tokens.
   * @returns void
   */
  refreshTokens(): void {
    this.cryptrClient.handleRefreshTokens();
  }

  /**
   * Retrieve Cryptr current configuration
   * @returns Current Cryptr configuration settings
   */
  config(): Config {
    return this.cryptrClient.config;
  }

  /**
   * Retrieve current user
   * @returns User object
   */
  getUser(): any {
    return this.user$.value;
  }

  /**
   * Check if authentication check still in progress
   * @returns Boolean observable of authentication progress state
   */
  authenticationInProgress(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Retrieve authentication state
   * @returns Boolean observable of authentication state
   */
  observableAuthenticated(): Observable<boolean> {
    return from(this.cryptrClient.isAuthenticated());
  }

  /**
   * Retrieve current user as observable
   * @returns Current user as Observable
   */
  getObservableUser(): Observable<any> {
    return this.user$.asObservable();
  }

  /**
   * Retrieve current authentication state.
   * @returns boolean of authentiation state
   */
  currentAuthenticationState(): boolean {
    return this.authenticated$.value;
  }

  /**
   * Retrieve current authentication state as Observable
   * @returns boolean observable of authentiation state
   */
  currentAuthenticationObservable(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  /** @ignore */
  fullAuthenticateProcess(
    stateUrl?: string,
    callback?: (isAuthenticated: boolean, stateUrl?: string) => boolean
  ): Observable<boolean | UrlTree> {
    return combineLatest(
      [this.isLoading$, this.authenticated$]
    ).pipe(
      filter(([isLoading, isAuthenticated]) => {
        return !isLoading;
      }),
      map(([isLoading, isAuthenticated]) => {
        if (callback) {
          return callback(isAuthenticated, stateUrl);
        } else {
          return this.defaultAuthenticationCallback(isAuthenticated, stateUrl);
        }
      })
    );
  }



  /** @ignore */
  private checkAuthentication(): void {
    this.isAuthenticated().then(async (isAuthenticated: boolean) => {
      this.updateCurrentAuthState(isAuthenticated);
      this.resetAuthentication(isAuthenticated);
      await this.authenticate();
    }).catch((error) => {
      console.error(error);
      this.resetAuthentication(false);
      this.isLoading$.next(false);
    });
  }

  /** @ignore */
  private resetAuthentication(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      return;
    }
    this.updateCurrentAuthState(false);
    this.setUser(null);
  }

  /** @ignore */
  private preLogOutCallBack(callback: () => void): () => void {
    this.updateCurrentAuthState(false);
    this.setUser(null);
    return callback;
  }

  /** @ignore */
  private setUser(newUser: any): void {
    this.user$.next(newUser);
  }

  /** @ignore */
  private updateCurrentAuthState(newAuthenticated: boolean): void {
    this.authenticated$.next(newAuthenticated);
    this.setUser(this.getClientUser());
  }

  /** @ignore */
  private cleanUrlTree(sourceUrlTree: UrlTree, stateUrl?: string): UrlTree {
    try {
      const path = !!stateUrl ? stateUrl.split('?')[0] : '';
      const queryParams = sourceUrlTree.queryParams;
      const { authorization_code, authorization_id, code, organization_domain, state, ...newParams } = queryParams;
      return this.router.createUrlTree([path], { queryParams: newParams, fragment: sourceUrlTree.fragment });
    } catch (error) {
      return sourceUrlTree;
    }
  }

  /** @ignore */
  private routeCleanedPath(): string {
    const path = this.location.path();
    const currentUrlTree = this.router.parseUrl(path);
    const newPath = this.cleanUrlTree(currentUrlTree, path).toString();
    return !!newPath ? newPath : '/';
  }

  /** @ignore */
  private cleanRouteState(): void {
    setTimeout(() => {
      this.location.replaceState(this.routeCleanedPath(), '');
    }, 2);
  }

  /** @ignore */
  private async authenticate(): Promise<boolean | UrlTree> {
    if (this.authenticated$.value) {
      this.isLoading$.next(false);
      return;
    }
    this.resetAuthentication(false);
    if (this.canHandleAuthentication()) {
      return this.handleRedirectCallback().then((tokens) => {
        const handled = this.handleTokens(tokens);
        this.updateCurrentAuthState(handled);
        if (handled) {
          this.cleanRouteState();
          this.isLoading$.next(false);
        } else {
          this.isLoading$.next(false);
        }
        return handled;
      }).catch((error) => {
        return false;
      }).finally(() => {
        this.isLoading$.next(false);
      });
    } else if (this.cryptrClient.canHandleInvitation()) {
      this.cryptrClient.handleInvitationState();
    } else {
      await this.cryptrClient.handleRefreshTokens();
      this.isAuthenticated().then((isAuthenticated) => {
        this.updateCurrentAuthState(isAuthenticated);
      }).catch((err) => {
        this.updateCurrentAuthState(false);
      }).finally(() => {
        this.isLoading$.next(false);
      });
    }
  }

  /** @ignore */
  private defaultAuthenticationCallback(isAuthenticated: boolean, stateUrl?: string): boolean {
    const { default_locale: defaultLocale, preferedAuthMethod } = this.config();
    if (isAuthenticated) {
      return true;
    } else {
      if (preferedAuthMethod === AuthnMethod.Gateway) {
        this.signInWithDomain(null, { locale: defaultLocale || 'en' });
      } else {
        this.signInWithMagicLink();
      }
      return false;
    }
  }

  /** @ignore */
  private signInWithMagicLink(stateUrl?: string): Observable<any> {
    const { audience, default_locale } = this.config();
    const redirectUri = audience.concat(stateUrl || '');

    // if (this.configFactory.get().has_ssr) {
    //   return this.signInWithRedirect(DEFAULT_SCOPE, default_locale, redirectUri);
    // } else {
    //   return this.signInWithRedirect();
    // }

    return this.signInWithDomain(null, { locale: default_locale });
  }
}

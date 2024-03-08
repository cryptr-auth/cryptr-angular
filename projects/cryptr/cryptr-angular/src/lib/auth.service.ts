import { Inject, Injectable, LOCALE_ID, OnDestroy } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { Tokens } from './utils/types';
import { ActivatedRoute, Router, UrlSegmentGroup, UrlSerializer, UrlTree } from '@angular/router';
import { CryptrClientService } from './auth.client';
import { filter, map } from 'rxjs/operators';
import { DEFAULT_SCOPE } from './utils/constants';
import { AuthClientConfig } from './auth.config';
import { Config, SsoSignOptsAttrs } from '@cryptr/cryptr-spa-js/dist/types/interfaces';
import Client from '@cryptr/cryptr-spa-js/dist/types/client';

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
    @Inject(CryptrClientService) private cryptrClient: Client,
    @Inject(LOCALE_ID) private locale: string,
    private location: Location,
    private navigator: AbstractNavigator,
    private router: Router,
    private route: ActivatedRoute,
    private configFactory: AuthClientConfig,
    private urlSerializer: UrlSerializer
  ) {
    this.checkAuthentication();
    window.addEventListener(CryptrSpa.events.REFRESH_INVALID_GRANT, (RigError) => {
      this.logOut();
    });
    window.addEventListener(CryptrSpa.events.REFRESH_EXPIRED, (ReError) => {
      this.logOut();
    });
  }

  /** @ignore */
  ngOnDestroy(): void {
    // this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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
  logOut(location: undefined | globalThis.Location = window.location, targetUrl?: string, sloAfterRevoke?: boolean): Observable<any> {
    let target = targetUrl === undefined || targetUrl === 'undefined' ? window.location.href : targetUrl;
    target = this.sanitizeUrl(target, ['request_id'])
    const executeSlo = sloAfterRevoke || this.cryptrClient.config.default_slo_after_revoke
    return from(this.cryptrClient.logOut(this.preLogOutCallBack(), location, target, executeSlo));
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
  private sanitizeUrl(urlString: string, queryParamsToRemove: string[]): string {
    const url = new URL(urlString)
    queryParamsToRemove.forEach(param => url.searchParams.delete(param))

    return url.toString()
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
  private preLogOutCallBack(): () => void {
    this.updateCurrentAuthState(false);
    this.setUser(null);
    return null;
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
    if (isAuthenticated) {
      return true;
    } else {
      this.signInWithDomain(null, { locale: this.currentLocale() });
      return false;
    }
  }

  /** @ignore */
  private currentLocale(): string {
    const LANG_INDEX = 0
    const lang = this.locale.split('-')[LANG_INDEX];
    return ['en', 'fr'].includes(lang) ? lang : 'en';
  }
}

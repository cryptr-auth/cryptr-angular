import { Inject, Injectable, OnDestroy } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { Config, CryptrClient, Tokens } from './utils/types';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { CryptrClientService } from './auth.client';
import { filter, map } from 'rxjs/operators';
import { DEFAULT_SCOPE } from './utils/constants';
import { AuthClientConfig } from './auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  /**
  * @ignore
  */
  private ngUnsubscribe$ = new Subject();
  /**
  * @ignore
  */
  private authenticated$ = new BehaviorSubject(false);
  /**
  * @ignore
  */
  private user$ = new BehaviorSubject(null);
  /**
  * @ignore
  */
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  checkAuthentication(): void {
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

  resetAuthentication(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      return;
    }
    this.updateCurrentAuthState(false);
    this.setUser(null);
  }

  /**
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
  * @param {string} [scope=email openid profile] - Scopes requested for this sign in process (whitespace separator), Minimum/Default: `"email openid profile"`
  * @param {string} locale - locale for this sign in process. Default: `config.default_locale` value
  * @param {string} redirectUri - URI where to redirect after sign in process. Default: `config.default_redirect_uri` value
  * @returns Redirects to Cryptr Sign in page
  */
  signInWithRedirect(scope?: string, locale?: string, redirectUri?: string): Observable<any> {
    if (this.cryptrClient) {
      return from(this.cryptrClient.signInWithRedirect(scope, redirectUri, locale));
    }
  }

  /**
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
  * @param {string} [scope="email openid profile"] - Scopes requested for this sign up process (whitespace separator), Minimum/Default: `"email openid profile"`
  * @param {string} locale - locale for this sign up process. Default: `config.default_locale` value
  * @param {string} redirectUri - URI where to redirect after sign up process. Default: `config.default_redirect_uri` value
  * @returns Redirects to Cryptr Sign up page
  */
  signUpWithRedirect(scope?: string, locale?: string, redirectUri?: string): Observable<any> {
    return from(this.cryptrClient.signUpWithRedirect(scope, redirectUri, locale));
  }

  preLogOutCallBack(callback: () => void): () => void {
    this.updateCurrentAuthState(false);
    this.setUser(null);
    return callback;
  }
  logOut(callback: () => void, location: any = window.location): Observable<any> {
    return from(this.cryptrClient.logOut(this.preLogOutCallBack(callback), location));
  }

  canHandleAuthentication(): boolean {
    return this.cryptrClient.canHandleAuthentication();
  }

  handleRedirectCallback(): Promise<any> {
    try {
      return this.cryptrClient.handleRedirectCallback();
    } catch (error) {
      console.error(error);
    }
  }

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

  isAuthenticated(): Promise<boolean> {
    return this.cryptrClient.isAuthenticated();
  }

  getAccessToken(): any {
    return this.cryptrClient.getCurrentAccessToken();
  }

  getIdToken(): any {
    return this.cryptrClient.getCurrentIdToken();
  }

  /**
  * @ignore
  */
  private setUser(newUser: any): void {
    this.user$.next(newUser);
  }

  getClientUser(): any {
    return this.cryptrClient.getUser();
  }

  userAccountAccess(): Promise<any> {
    return this.cryptrClient.userAccountAccess();
  }

  refreshTokens(): void {
    this.cryptrClient.handleRefreshTokens();
  }

  config(): Config {
    return this.cryptrClient.config;
  }

  getUser(): any {
    return this.user$.value;
  }

  authenticationInProgress(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  observableAuthenticated(): Observable<boolean> {
    return from(this.cryptrClient.isAuthenticated());
  }

  getObservableUser(): Observable<any> {
    return this.user$.asObservable();
  }


  currentAuthenticationState(): boolean {
    return this.authenticated$.value;
  }

  /**
  * @ignore
  */
  private updateCurrentAuthState(newAuthenticated: boolean): void {
    this.authenticated$.next(newAuthenticated);
    this.setUser(this.getClientUser());
  }

  currentAuthenticationObservable(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  /**
  * @ignore
  */
  private cleanUrlTree(sourceUrlTree: UrlTree, stateUrl?: string): UrlTree {
    try {
      const path = !!stateUrl ? stateUrl.split('?')[0] : '';
      const queryParams = sourceUrlTree.queryParams;
      const { authorization_id, code, state, ...newParams } = queryParams;
      return this.router.createUrlTree([path], { queryParams: newParams, fragment: sourceUrlTree.fragment });
    } catch (error) {
      return sourceUrlTree;
    }
  }

  /**
  * @ignore
  */
  private routeCleanedPath(): string {
    const path = this.location.path();
    const currentUrlTree = this.router.parseUrl(path);
    const newPath = this.cleanUrlTree(currentUrlTree, path).toString();
    return !!newPath ? newPath : '/';
  }

  /**
  * @ignore
  */
  private cleanRouteState(): void {
    setTimeout(() => {
      this.location.replaceState(this.routeCleanedPath(), '');
    }, 2);
  }

  async authenticate(): Promise<boolean | UrlTree> {
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
      // TODO: handle invitation process
      // } else if (this.cryptrClient.canHandleInvitation()) {
      //   console.log('can handle invite')
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

  /**
   * @ignore
   */
  private defaultAuthenticationCallback(isAuthenticated: boolean, stateUrl?: string): boolean {
    const { audience, default_locale } = this.config();
    const redirectUri = audience.concat(stateUrl || '');
    if (isAuthenticated) {
      return true;
    } else {
      if (this.configFactory.get().has_ssr) {
        this.signInWithRedirect(DEFAULT_SCOPE, default_locale, redirectUri);
      } else {
        this.signInWithRedirect();
      }
      return false;
    }
  }

  /**
  * @ignore
  */
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
}

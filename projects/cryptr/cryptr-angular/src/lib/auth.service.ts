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
  private ngUnsubscribe$ = new Subject();
  private authenticated$ = new BehaviorSubject(false);
  private user$ = new BehaviorSubject(null);
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
    this.isAuthenticated().then((isAuthenticated: boolean) => {
      this.updateCurrentAuthState(isAuthenticated);
      this.resetAuthentication(isAuthenticated);
      this.authenticate();
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

  signInWithRedirect(scope?: string, locale?: string, redirectUri?: string): Observable<any> {
    if (this.cryptrClient) {
      return from(this.cryptrClient.signInWithRedirect(scope, redirectUri, locale));
    }
  }

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
    const { valid, accessToken } = tokens;
    this.updateCurrentAuthState(valid && accessToken !== undefined);
    if (this.authenticated$.value) {
      this.setUser(this.getClientUser());
    } else {
      alert('failure, please check Javascript console');
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
    this.cryptrClient.refreshTokens();
  }

  config(): Config {
    return this.cryptrClient.config;
  }

  getUser(): any {
    return this.user$.value;
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

  private updateCurrentAuthState(newAuthenticated: boolean): void {
    this.authenticated$.next(newAuthenticated);
    this.setUser(this.getClientUser());
  }

  currentAuthenticationObservable(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

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

  private routeCleanedPath(): string {
    const path = this.location.path();
    const currentUrlTree = this.router.parseUrl(path);
    const newPath = this.cleanUrlTree(currentUrlTree, path).toString();
    return !!newPath ? newPath : '/';
  }

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
          this.refreshTokens();
          this.cleanRouteState();
          this.isLoading$.next(false);
        } else {
          this.isLoading$.next(false);
        }
        return handled;
      });
    } else {
      this.isLoading$.next(false);
    }
  }

  fullAuthenticateProcess(stateUrl?: string): Observable<boolean | UrlTree> {
    const { audience, default_locale } = this.config();
    const redirectUri = audience.concat(stateUrl || '');
    // const tree = this.router.parseUrl(stateUrl)
    // const newTree = this.cleanUrlTree(tree, stateUrl)
    return combineLatest(
      [this.isLoading$, this.authenticated$]
    ).pipe(
      filter(([isLoading, isAuthenticated]) => {
        return !isLoading;
      }),
      map(([isLoading, isAuthenticated]) => {
        if (isAuthenticated) {
          this.cleanRouteState();
          return true;
        } else {
          if (this.configFactory.get().has_ssr) {
            this.signInWithRedirect(DEFAULT_SCOPE, default_locale, redirectUri);
          } else {
            this.signInWithRedirect();
          }
          return false;
        }
      })
    );
  }
}

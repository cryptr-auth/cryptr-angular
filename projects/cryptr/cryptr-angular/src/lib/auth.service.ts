import { Inject, Injectable, OnDestroy } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { from, Observable, Subject } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { Config, CryptrClient } from './utils/types';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { CryptrClientService } from './auth.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private ngUnsubscribe$ = new Subject();
  private authenticated = false;
  private user;

  constructor(
    @Inject(CryptrClientService) private cryptrClient: CryptrClient,
    private location: Location,
    private navigator: AbstractNavigator,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    console.debug(`authService constructor`);
    this.checkAuthentication();
    console.debug(`before listeners`);
    window.addEventListener(CryptrSpa.events.REFRESH_INVALID_GRANT, (RigError) => {
      this.logOut(null);
    });
    window.addEventListener(CryptrSpa.events.REFRESH_EXPIRED, (ReError) => {
      this.logOut(null);
    });
  }

  checkAuthentication(): void {
    console.debug(`checkAuhentication`);
    this.isAuthenticated().then((isAuthenticated: boolean) => {
      console.debug(`isAuthenticated ${isAuthenticated}`);
      this.authenticated = isAuthenticated;
      this.resetAuthentication(isAuthenticated);
      this.authenticate();
    }).catch((error) => {
      console.error(error);
      this.resetAuthentication(false);
    });
  }

  resetAuthentication(isAuthenticated: boolean): void {
    console.debug(`resetAuthentication ${isAuthenticated}`);
    if (isAuthenticated) {
      return;
    }
    this.authenticated = false;
    this.user = null;
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
    this.authenticated = false;
    this.user = null;
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

  handleTokens(tokens: any): boolean {
    const { valid, accessToken } = tokens;
    this.authenticated = valid && accessToken !== undefined;
    if (this.authenticated) {
      this.user = this.getUser();
    } else {
      alert('failure, please check Javascript console');
    }
    return this.authenticated;
  }

  observableAuthenticated(): Observable<boolean> {
    return from(this.cryptrClient.isAuthenticated());
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

  getUser(): any {
    return this.cryptrClient.getUser();
  }

  userAccountAccess(): Promise<any> {
    return this.cryptrClient.userAccountAccess();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  refreshTokens(): void {
    this.cryptrClient.refreshTokens();
  }

  config(): Config {
    return this.cryptrClient.config;
  }

  // TODO: enhance this tomake a proper reload with query params
  routeCleanedPath(): string {
    return this.location.path().split('?')[0];
  }

  currentAuthenticationState(): boolean {
    return this.authenticated;
  }

  async authenticate(): Promise<boolean | UrlTree> {
    console.debug('authenticate');
    if (this.authenticated) {
      return;
    }
    // this.resetAuthentication(false)
    if (this.canHandleAuthentication()) {
      console.debug('canHandleAuthentication');
      return this.handleRedirectCallback().then((tokens) => {
        console.debug(`tokens`);
        console.debug(tokens);
        const handled = this.handleTokens(tokens);
        console.debug(handled);
        this.authenticated = handled;
        if (handled) {
          this.refreshTokens();
          console.debug(this.routeCleanedPath());
          return this.router.createUrlTree([this.routeCleanedPath()]);
        } else {
          return handled;
        }
      });
    }
  }

  async fullAuthenticateProcess(): Promise<boolean | UrlTree> {
    console.debug('fullAuthenticateProcess')
    return this.isAuthenticated().then((isAuthenticated: boolean) => {
      console.debug(`isAuthenticated ${isAuthenticated}`)
      this.authenticated = isAuthenticated;
      if (isAuthenticated) {
        return true;
      } else {
        console.debug(`redirect to root`)
        // redirect to root
        this.router.createUrlTree(['/']);
        // this.resetAuthentication(isAuthenticated);
        // if (this.canHandleAuthentication()) {
        //   return this.handleRedirectCallback().then((tokens) => {
        //     const handled = this.handleTokens(tokens);
        //     this.authenticated = handled;
        //     if (handled) {
        //       this.refreshTokens();
        //       return this.router.createUrlTree([this.routeCleanedPath()]);
        //     } else {
        //       return handled;
        //     }
        //   }).catch((error) => {
        //     console.error(error);
        //     return false;
        //   });
        // } else {
        //   this.signInWithRedirect();
        // }
      }
    });
  }
}

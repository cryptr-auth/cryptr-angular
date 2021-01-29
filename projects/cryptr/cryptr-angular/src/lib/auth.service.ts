import { Inject, Injectable, OnDestroy } from '@angular/core';
import CleeckSpa from '@cryptr/cryptr-spa-js';
import { from, Observable, Subject } from 'rxjs';
import { CleeckClientService } from './auth.client';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { Config, CryptrClient, Locale } from './utils/types';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private ngUnsubscribe$ = new Subject();
  private authenticated = false;
  private user;

  constructor(
    @Inject(CleeckClientService) private cleeckClient: CryptrClient,
    private location: Location,
    private navigator: AbstractNavigator,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.checkAuthentication();
    window.addEventListener(CleeckSpa.events.REFRESH_INVALID_GRANT, (RigError) => {
      this.logOut(null);
    });
    window.addEventListener(CleeckSpa.events.REFRESH_EXPIRED, (ReError) => {
      this.logOut(null);
    });
  }

  checkAuthentication(): void {
    this.isAuthenticated().then((isAuthenticated: boolean) => {
      this.authenticated = isAuthenticated;
      this.resetAuthentication(isAuthenticated);
    }).catch((error) => {
      console.error(error);
      this.resetAuthentication(false);
    });
  }

  resetAuthentication(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      return;
    }
    this.authenticated = false;
    this.user = null;
  }

  signInWithRedirect(scope?: string, locale?: Locale, redirectUri?: string): Observable<any> {
    if (this.cleeckClient) {
      return from(this.cleeckClient.signInWithRedirect(scope, redirectUri, locale));
    }
  }

  signUpWithRedirect(scope?: string, locale?: Locale, redirectUri?: string): Observable<any> {
    return from(this.cleeckClient.signUpWithRedirect(scope, redirectUri, locale));
  }

  preLogOutCallBack(callback: () => void): () => void {
    this.authenticated = false;
    this.user = null;
    return callback;
  }
  logOut(callback: () => void, location: any = window.location): Observable<any> {
    return from(this.cleeckClient.logOut(this.preLogOutCallBack(callback), location));
  }

  canHandleAuthentication(): boolean {
    return this.cleeckClient.canHandleAuthentication();
  }

  handleRedirectCallback(): Promise<any> {
    try {
      return this.cleeckClient.handleRedirectCallback();
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
    return from(this.cleeckClient.isAuthenticated());
  }
  isAuthenticated(): Promise<boolean> {
    return this.cleeckClient.isAuthenticated();
  }

  getAccessToken(): any {
    return this.cleeckClient.getCurrentAccessToken();
  }

  getIdToken(): any {
    return this.cleeckClient.getCurrentIdToken();
  }

  getUser(): any {
    return this.cleeckClient.getUser();
  }

  userAccountAccess(): Promise<any> {
    return this.cleeckClient.userAccountAccess();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  refreshTokens(): void {
    this.cleeckClient.refreshTokens();
  }

  config(): Config {
    return this.cleeckClient.config;
  }

  // TODO: enhance this tomake a proper reload with query params
  routeCleanedPath(): string {
    return this.location.path().split('?')[0];
  }

  currentAuthenticationState(): boolean {
    return this.authenticated;
  }

  async fullAuthenticateProcess(): Promise<boolean | UrlTree> {
    return this.isAuthenticated().then((isAuthenticated: boolean) => {
      this.authenticated = isAuthenticated;
      if (isAuthenticated) {
        return true;
      } else {
        this.resetAuthentication(isAuthenticated);
        if (this.canHandleAuthentication()) {
          return this.handleRedirectCallback().then((tokens) => {
            const handled = this.handleTokens(tokens);
            this.authenticated = handled;
            if (handled) {
              this.refreshTokens();
              return this.router.createUrlTree([this.routeCleanedPath()]);
            } else {
              return handled;
            }
          }).catch((error) => {
            console.error(error);
            return false;
          });
        } else {
          this.signInWithRedirect();
        }
      }
    });
  }
}

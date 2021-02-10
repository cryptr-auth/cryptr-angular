import { Inject, Injectable, OnDestroy } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { Config, CryptrClient, Tokens } from './utils/types';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { CryptrClientService } from './auth.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private ngUnsubscribe$ = new Subject();
  private authenticated$ = new BehaviorSubject(false);
  private user;

  constructor(
    @Inject(CryptrClientService) private cryptrClient: CryptrClient,
    private location: Location,
    private navigator: AbstractNavigator,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.checkAuthentication();
    window.addEventListener(CryptrSpa.events.REFRESH_INVALID_GRANT, (RigError) => {
      this.logOut(null);
    });
    window.addEventListener(CryptrSpa.events.REFRESH_EXPIRED, (ReError) => {
      this.logOut(null);
    });
  }

  checkAuthentication(): void {
    this.isAuthenticated().then((isAuthenticated: boolean) => {
      this.updateCurrentAuthState(isAuthenticated);
      this.resetAuthentication(isAuthenticated);
      this.authenticate();
    }).catch((error) => {
      console.error(error);
      this.resetAuthentication(false);
    });
  }

  resetAuthentication(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      return;
    }
    this.updateCurrentAuthState(false);
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
    this.updateCurrentAuthState(false);
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

  handleTokens(tokens: Tokens): boolean {
    const { valid, accessToken } = tokens;
    this.updateCurrentAuthState(valid && accessToken !== undefined);
    if (this.authenticated$.value) {
      this.user = this.getUser();
    } else {
      alert('failure, please check Javascript console');
    }
    return this.authenticated$.value;
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
    const splittedQuery = this.location.path().split('?');
    return splittedQuery[0] === '' ? '/' : splittedQuery[0];
  }

  currentAuthenticationState(): boolean {
    return this.authenticated$.value;
  }

  private updateCurrentAuthState(newAuthenticated: boolean): void {
    this.authenticated$.next(newAuthenticated);
  }

  currentAuthenticationObservable(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  async authenticate(): Promise<boolean | UrlTree> {
    if (this.authenticated$.value) {
      return;
    }
    this.resetAuthentication(false);
    if (this.canHandleAuthentication()) {
      return this.handleRedirectCallback().then((tokens) => {
        const handled = this.handleTokens(tokens);
        this.updateCurrentAuthState(handled);
        if (handled) {
          this.refreshTokens();
          this.location.replaceState(this.routeCleanedPath(), '');
        } else {
          return handled;
        }
      });
    }
  }

  async fullAuthenticateProcess(stateUrl?: string): Promise<boolean | UrlTree> {
    return this.isAuthenticated().then((isAuthenticated: boolean) => {
      this.updateCurrentAuthState(isAuthenticated);
      if (isAuthenticated) {
        return true;
      } else {
        this.signInWithRedirect();
      }
    });
  }
}

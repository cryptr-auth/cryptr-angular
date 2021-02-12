import { Inject, Injectable, OnDestroy } from '@angular/core';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { AbstractNavigator } from './abstract-navigator';
import { Location } from '@angular/common';
import { Config, CryptrClient, Tokens } from './utils/types';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { CryptrClientService } from './auth.client';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private ngUnsubscribe$ = new Subject();
  private authenticated$ = new BehaviorSubject(false);
  private user$ = new BehaviorSubject(null);
  private isLoading$ = new BehaviorSubject(false);

  constructor(
    @Inject(CryptrClientService) private cryptrClient: CryptrClient,
    private location: Location,
    private navigator: AbstractNavigator,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isLoading$.next(true);
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

  setUser(newUser: any): void {
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
    console.log('>>> authenticate');
    if (this.authenticated$.value) {
      console.log('<<< authenticate authenticated');
      this.isLoading$.next(false);
      return true;
    }
    this.resetAuthentication(false);
    if (this.canHandleAuthentication()) {
      console.log('can authenticate');
      return this.handleRedirectCallback().then((tokens) => {
        const handled = this.handleTokens(tokens);
        this.updateCurrentAuthState(handled);
        if (handled) {
          console.log('<<< authenticate handled');
          this.refreshTokens();
          this.location.replaceState(this.routeCleanedPath(), '');
          this.isLoading$.next(false);
          return true;
        } else {
          console.log('<<< authenticate !handled');
          this.isLoading$.next(false);
          return handled;
        }
      });
    } else {
      console.log('cannot authenticate');
      this.isLoading$.next(false);
      return false;
    }
  }

  fullAuthenticateProcess(stateUrl?: string): Observable<boolean | UrlTree> {
    console.log('fullAuthenticationProcess');
    return this.isLoading$
      .pipe(
        timeout(10000), // wait for 10 seconds before fail.
        map((isLoading: boolean) => {

          if (!isLoading && !this.authenticated$.value) { this.signInWithRedirect(); return false; }
          if (!isLoading && this.authenticated$.value) { return true; }
        }),
        catchError(() => { console.log('fullAuthenticationProcess'); return of(false); })
      );
  }
}

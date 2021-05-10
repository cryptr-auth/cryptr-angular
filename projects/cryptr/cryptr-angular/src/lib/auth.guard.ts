import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/** Cryptr Guard to limit access to routes depending on session presence */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  /** @ignore */
  constructor(private auth: AuthService) { }

  /**
   * Cryptr check if child can be loaded
   * depending on authentication state
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.auth.observableAuthenticated();
  }

  /**
   * Cryptr check if route can be activate
   * depending on authentication state.
   * If no session active will redirect to cryptr sign process
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.auth.fullAuthenticateProcess(state.url);
  }

  /**
   * Cryptr check if child route can be activate
   * depending on authentication state.
   * If no session active will redirect to cryptr sign process
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.auth.fullAuthenticateProcess(state.url);
  }
}

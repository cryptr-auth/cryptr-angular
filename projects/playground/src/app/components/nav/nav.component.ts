import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { AuthService } from 'projects/cryptr/cryptr-angular/src/lib/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  securedPath = '/mes-formations';
  unauthenticatedPath = '/';
  showLogoutModal = false;
  user: any;
  authenticated = false;

  logoSrc = 'https://images.prismic.io/shark-academy%2F76b9fccf-b146-4c3d-a068-a96c07d61085_logo_shark_academy__no_spacing.svg?auto=compress,format';
  //  O: normal, 1: invalid_grant, 2: expired
  logOutPopupStyle = 0;
  locale = 'fr';
  signType = "signin";
  redirectUri = 'http://localhost:4200/';

  constructor(public auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.cryptrListeners();
    this.auth.currentAuthenticationObservable().subscribe((isAuthenticated: boolean) => {
      this.authenticated = isAuthenticated;
    });
    this.auth.getObservableUser().subscribe((user) => {
      this.user = user;
    });
  }

  // CRYPTR BLOCK
  cryptrListeners(): void {
    window.addEventListener(CryptrSpa.events.REFRESH_INVALID_GRANT, (e) => {
      this.logOut(1);
    });
    window.addEventListener(CryptrSpa.events.REFRESH_EXPIRED, (e) => {
      console.error(e);
      this.logOut(2);
    });
  }

  logOut(popupStyle = 0): void {
    this.auth.logOut(() => {
      this.toggleModal(popupStyle);
    });
  }

  // GENERIC features
  redirectTo(routePath: string): void {
    this.router.navigateByUrl(routePath).then(navigated => {
      this.auth.refreshTokens();
    });
  }

  toggleModal(popupStyle: number): void {
    if (!this.showLogoutModal) {
      this.logOutPopupStyle = popupStyle;
    } else {
      this.logOutPopupStyle = 0;
      this.redirectTo(this.unauthenticatedPath);
    }
    this.showLogoutModal = !this.showLogoutModal;
  }

  // LOGOUT Design
  logoutPopupTitle(): string {
    return [
      'You are logged out',
      'Session closed',
      'Session expired',
    ][this.logOutPopupStyle];
  }

  logoutPopupDesc(): string {
    return [
      'See you soon',
      'The current session has been revoked from you account. Please sign in again',
      'Your session is no more valid. Please sign in again',
    ][this.logOutPopupStyle];
  }

  logoutIconBg(): string {
    return [
      'bg-green-200',
      'bg-red-200',
      'bg-orange-200',
    ][this.logOutPopupStyle];
  }

  logoutIconColor(): string {
    return [
      'text-green-600',
      'text-red-600',
      'text-orange-600',
    ][this.logOutPopupStyle];
  }
}

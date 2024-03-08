import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import CryptrSpa from '@cryptr/cryptr-spa-js';
import { AuthService } from 'projects/cryptr/cryptr-angular/src/lib/auth.service';
import { environment } from 'projects/playground/src/environments/environment';

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
  signType = 'signin';
  redirectUri = 'http://localhost:4200/';
  targetUrl: string = environment.targetUrl;

  constructor(public auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.auth.currentAuthenticationObservable().subscribe((isAuthenticated: boolean) => {
      this.authenticated = isAuthenticated;
    });
    this.auth.getObservableUser().subscribe((user) => {
      this.user = user;
    });
  }


  logOut(_popupStyle = 0): void {
    this.auth.logOut(window.location, this.redirectUri);
  }

  greetings(): string {
    return `Hello ${this.user?.given_name} ${this.user?.family_name}`
  }

  // GENERIC features
  redirectTo(routePath: string): void {
    this.router.navigateByUrl(routePath).then(navigated => {
      this.auth.refreshTokens();
    });

  }
}

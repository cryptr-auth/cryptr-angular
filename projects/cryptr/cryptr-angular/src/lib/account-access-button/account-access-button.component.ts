import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {
  BADGE_CLASS,
  DEFAULT_SCOPE,
  ERROR_BTN_CLASS,
  LOG_OUT_BTN_CLASS,
  SIGN_BTN_CLASS,
  TOGGLE_CASS_CLOSED,
  TOGGLE_CASS_OPENED,
  USER_ACCOUNT_BTN_CLASS
} from '../utils/constants';
import { LocalizedStrings } from '../utils/enums';
import { Sign, User } from '../utils/types';

@Component({
  selector: 'cryptr-account-access-button[auth]',
  templateUrl: './account-access-button.component.html',
  styleUrls: ['./account-access-button.component.scss']
})
export class AccountAccessButtonComponent implements OnChanges {
  @Input() auth: AuthService;
  @Input() isWidget: boolean;
  @Input() defaultSignType: Sign.In | Sign.Up;
  @Input() defaultSignText: string;
  @Input() unauthenticatedPath: string;
  @Input() locale: string;
  @Input() redirectUri: string;
  @Input() logoSrc: string;
  @Input() buttonLabel: string;
  @Input() logOutLabel: string;
  @Input() accountLabel: string;
  @Input() popupHeight: number;
  @Input() popupWidth: number;

  // STYLE config
  @Input() signBtnStyle: any;
  @Input() toggleBtnStyle: any;
  @Input() badgeStyle: any;
  @Input() accountBtnStyle: any;
  @Input() logOutBtnStyle: any;
  @Input() childStyle: any;

  // CLASS config
  @Input() signBtnClass: string;
  @Input() toggleBtnClass: string;
  @Input() badgeClass: string;
  @Input() accountBtnClass: string;
  @Input() logOutBtnClass: string;
  @Input() childClass: string;

  isOpened = false;
  accountPopup: Window;
  errorMessage: string = null;
  errorBtnClass = ERROR_BTN_CLASS;

  closeAccountPopup(): void {
    if (typeof this.accountPopup !== 'undefined' && this.accountPopup !== null) {
      this.accountPopup.close();
    }
  }

  constructor(private router: Router) {
    window.addEventListener('beforeunload', (e) => {
      this.closeAccountPopup();
    });

    this.router.events.subscribe((val) => {
      if (this.isOpened && (val instanceof NavigationEnd)) {
        this.isOpened = false;
      }
    });
  }

  currentLocale(): string {
    try {
      return this.locale || this.auth.config().default_locale || 'en';
    } catch (e) {
      return 'en';
    }
  }

  localizedString(key: string): string {
    return LocalizedStrings[this.currentLocale()][key];
  }

  setDefaults(): void {
    if (this.isWidget === undefined) {
      this.isWidget = true;
    }
    if (this.defaultSignType === undefined) {
      this.defaultSignType = Sign.In;
    }
    if (this.defaultSignText === undefined) {
      this.defaultSignText = this.localizedString(this.defaultSignType);
    }
    this.popupHeight = this.popupHeight || 935;
    this.popupWidth = this.popupWidth || 915;

    this.signBtnClass = this.signBtnClass || SIGN_BTN_CLASS;
    this.accountBtnClass = this.accountBtnClass || USER_ACCOUNT_BTN_CLASS;
    this.badgeClass = this.badgeClass || BADGE_CLASS;
    this.logOutBtnClass = this.logOutBtnClass || LOG_OUT_BTN_CLASS;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.checkConfig();
    this.setDefaults();
  }

  checkConfig(): void {
    // const { config: routerConfig } = this.router;
    // if (this.redirectUri) {
    //   const redirectUriPath = new URL(this.redirectUri).pathname;
    //   let match = false;
    //   routerConfig.forEach(({ path, canActivate }) => {
    //     if (canActivate !== undefined && `/${path}` === redirectUriPath) {
    //       match = true;
    //     }
    //   });
    //   if (!match) {
    //     this.errorMessage = `The path '${redirectUriPath}' MUST BE Configured in your router with 'canActivate: [AuthGuard]'`;
    //     throw new Error(this.errorMessage);
    //   }
    // }
  }

  toggleOpen(): void {
    this.isOpened = !this.isOpened;
  }

  logOut(): void {
    this.toggleOpen();
    this.auth.logOut(() => {
      window.location.href = this.unauthenticatedPath || '/';
    });
  }

  popupParams(): string {
    return `location=yes,height=${this.popupHeight},width=${this.popupWidth},scrollbars=yes,status=yes`;
  }

  userAccountAccess(): void {
    this.toggleOpen();
    this.auth.userAccountAccess().then(accountAccessData => {
      try {
        const { data: { data: { url } } } = accountAccessData;
        this.accountPopup = window.open(url, '_blank', this.popupParams());
      } catch (err) {
        console.error(err);
      }
    });
  }

  isAuthenticated(): boolean {
    return this.auth.currentAuthenticationState();
  }

  user(): User | undefined {
    return this.auth.getClientUser();
  }

  email(): string | undefined {
    if (!!this.user()) {
      return this.user().email;
    }
  }

  initials(): any {
    if (!this.isAuthenticated() || this.user() === undefined || this.fullName() === undefined) {
      return;
    }
    return this.fullName().match(/\b(\w)/g).join('');
  }

  fullName(): any {
    if (!this.isAuthenticated() || this.user() === undefined || this.email() === undefined) {
      return;
    }
    const emailName = this.email().split('@')[0];
    return emailName.split('.').join(' ');
  }

  widgetButtonText(): string {
    const tenantKey = 'tenant_domain';
    return this.buttonLabel || this.auth.config()[tenantKey].split('-').join(' ');
  }

  logOutText(): string {
    return this.logOutLabel || this.localizedString('logOut');
  }

  manageAccountText(): string {
    return this.accountLabel || this.localizedString('manageAccount');
  }

  showSigninButton(): boolean {
    return !this.isAuthenticated() && this.defaultSignType === Sign.In;
  }

  showSignupButton(): boolean {
    return !this.isAuthenticated() && this.defaultSignType === Sign.Up;
  }

  showWidgetBtn(): boolean {
    return this.isWidget && this.isAuthenticated();
  }

  showAccessButtonOnly(): boolean {
    return this.isAuthenticated() && !this.isWidget;
  }

  signInWithRedirect(): void {
    this.auth.signInWithRedirect(DEFAULT_SCOPE, this.locale, this.redirectUri);
  }

  signUpWithRedirect(): void {
    this.auth.signInWithRedirect(DEFAULT_SCOPE, this.locale, this.redirectUri);
  }

  currentToggleBtnClass(): string {
    let toggleClass = TOGGLE_CASS_CLOSED;
    if (this.toggleBtnClass !== undefined) {
      toggleClass = this.toggleBtnClass;
    } else if (this.isOpened) {
      toggleClass = TOGGLE_CASS_OPENED;
    }
    return toggleClass;
  }
}

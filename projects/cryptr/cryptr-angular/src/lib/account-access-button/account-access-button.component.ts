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

/**
 * Account AccessButton Component
 * Dynamic component to easily handle User session
 *
 * @example
 * <cryptr-account-access-button [auth]="auth">
 * </cryptr-account-access-button>
 */
@Component({
  selector: 'cryptr-account-access-button[auth]',
  templateUrl: './account-access-button.component.html',
  styleUrls: ['./account-access-button.component.scss']
})
export class AccountAccessButtonComponent implements OnChanges {
  /**
   * Cryptr Auth service to use for this component
   */
  @Input() auth: AuthService;
  /**
   * Choose if component should behave like a widget.
   *
   * **Default:** true
   */
  @Input() isWidget: boolean;
  /**
   * Choose if Component should prompt sign in or sign up when
   * no active session
   *
   * **Default:** Sign.In -> `"signin"`
   */
  @Input() defaultSignType: Sign.In | Sign.Up;
  /**
   * Text to show inside sign button when no active session
   */
  @Input() defaultSignText: string;
  /**
   * Path to redirect after logout process
   */
  @Input() unauthenticatedPath: string;
  /**
   * Chosen locale for this component.
   *
   * If none, `default_locale` from config. **Fallback:** `en`
   */
  @Input() locale: string;
  /**
   * Chosen redirect URI for this component.
   *
   * If none, `default_redirect_uri` from config. **Fallback:** current URI
   */
  @Input() redirectUri: string;
  /**
   * Chosen target URL for SLO end process.
   *
   * If none, `window.location.href` will be be used
   */
  @Input() targetUrl: undefined | string;
  /**
   * Source of logo you want in widget button
   */
  @Input() logoSrc: string;
  /**
   * Text to show in widget button.
   * If none it will display tenant domain string
   */
  @Input() buttonLabel: string;
  /**
   * Text to show inside logout button
   */
  @Input() logOutLabel: string;
  /**
   * Text for user account access button.
   * It will define either button inside widget or
   * account button when chosing widget `false`
   */
  @Input() accountLabel: string;
  /**
   * Desired height(px) for user account popup.
   * **Warning:** If user is in full screen it will be a new tab of browser
   */
  @Input() popupHeight: number;
  /**
   * Desired width(px) for user account popup
   * **Warning:** If user is in full screen it will be a new tab of browser
   */
  @Input() popupWidth: number;

  // STYLE config

  /**
   * Style for sign button when no active session
   */
  @Input() signBtnStyle: any;
  /**
   * Style for widget toggle button
   */
  @Input() toggleBtnStyle: any;
  /**
   * Style for initials badge in widget toggle button
   */
  @Input() badgeStyle: any;
  /**
   * Style for user account access button.
   * It will define either button inside widget or
   * account button when chosing widget `false`
   */
  @Input() accountBtnStyle: any;
  /**
   * Style for logout button
   */
  @Input() logOutBtnStyle: any;
  /**
   * Desired style to apply arrount `cryptrWidgetChild`
   */
  @Input() childStyle: any;

  // CLASS config

  /**
   * Class for sign button when no active session
   */
  @Input() signBtnClass: string;
  /**
   * Class for widget toggle button
   */
  @Input() toggleBtnClass: string;
  /**
   * Class for initials badge in widget toggle button
   */
  @Input() badgeClass: string;
  /**
   * Class for user account access button.
   * It will define either button inside widget or
   * account button when chosing widget `false`
   */
  @Input() accountBtnClass: string;
  /**
   * Class for logout button
   */
  @Input() logOutBtnClass: string;
  /**
   * Class for sign button when no active session
   */
  @Input() childClass: string;

  /** @ignore */
  isOpened = false;
  /** @ignore */
  accountPopup: Window;
  /** @ignore */
  errorMessage: string = null;
  /** @ignore */
  errorBtnClass = ERROR_BTN_CLASS;

  /** @ignore */
  closeAccountPopup(): void {
    if (typeof this.accountPopup !== 'undefined' && this.accountPopup !== null) {
      this.accountPopup.close();
    }
  }

  /** @ignore */
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

  /** @ignore */
  currentLocale(): string {
    try {
      return this.locale || this.auth.config().default_locale || 'en';
    } catch (e) {
      return 'en';
    }
  }

  /** @ignore */
  localizedString(key: string): string {
    return LocalizedStrings[this.currentLocale()][key];
  }

  /** @ignore */
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

  /** @ignore */
  ngOnChanges(_changes: SimpleChanges): void {
    this.checkConfig();
    this.setDefaults();
  }

  /** @ignore */
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

  /** @ignore */
  toggleOpen(): void {
    this.isOpened = !this.isOpened;
  }

  /** @ignore */
  logOut(): void {
    let target = this.targetUrl === 'undefined' || this.targetUrl === undefined ? window.location.href : this.targetUrl
    console.log("component logOut");
    console.log(this.targetUrl);
    console.log(typeof this.targetUrl);
    console.log(typeof target);
    this.toggleOpen();
    // this.auth.logOut(() => {
    //   window.location.href = this.unauthenticatedPath || '/';
    // }, window.location, target);
  }

  /** @ignore */
  popupParams(): string {
    return `location=yes,height=${this.popupHeight},width=${this.popupWidth},scrollbars=yes,status=yes`;
  }

  /** @ignore */
  userAccountAccess(): void {
    this.toggleOpen();
    this.auth.userAccountAccess().then(accountAccessData => {
      try {
        const { data: { data: { url } } } = accountAccessData;
        this.accountPopup = window.open(url, '_blank', this.popupParams());
      } catch (err) {
        console.error(err.message);
      }
    });
  }

  /** @ignore */
  isAuthenticated(): boolean {
    return this.auth.currentAuthenticationState();
  }

  /** @ignore */
  user(): User | undefined {
    return this.auth.getClientUser();
  }

  /** @ignore */
  cannotDisplayUser(): boolean {
    return !this.isAuthenticated() || typeof this.user() === 'undefined';
  }

  /** @ignore */
  email(): string | undefined {
    if (this.cannotDisplayUser()) {
      return;
    }
    return this.user().email;
  }

  /** @ignore */
  initials(): any {
    if (this.cannotDisplayUser()) {
      return;
    }
    return this.fullName().match(/\b(\w)/g).join('');
  }

  /** @ignore */
  fullName(): any {
    if (this.cannotDisplayUser()) {
      return;
    }
    const emailName = this.email().split('@')[0];
    return emailName.split('.').join(' ');
  }

  /** @ignore */
  widgetButtonText(): string {
    const tenantKey = 'tenant_domain';
    return this.buttonLabel || this.auth.config()[tenantKey].split('-').join(' ');
  }

  /** @ignore */
  logOutText(): string {
    return this.logOutLabel || this.localizedString('logOut');
  }

  /** @ignore */
  manageAccountText(): string {
    return this.accountLabel || this.localizedString('manageAccount');
  }

  /** @ignore */
  showSigninButton(): boolean {
    return !this.isAuthenticated() && this.defaultSignType === Sign.In;
  }

  /** @ignore */
  showSignupButton(): boolean {
    return !this.isAuthenticated() && this.defaultSignType === Sign.Up;
  }

  /** @ignore */
  showWidgetBtn(): boolean {
    return this.isWidget && this.isAuthenticated();
  }

  /** @ignore */
  showAccessButtonOnly(): boolean {
    return this.isAuthenticated() && !this.isWidget;
  }

  /** @ignore */
  signInWithRedirect(): void {
    this.auth.signInWithRedirect(DEFAULT_SCOPE, this.locale, this.redirectUri);
  }

  /** @ignore */
  signUpWithRedirect(): void {
    this.auth.signUpWithRedirect(DEFAULT_SCOPE, this.locale, this.redirectUri);
  }

  /** @ignore */
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

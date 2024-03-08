
import { CryptrClientFactory } from './auth.client';
import { AuthClientConfig, AuthConfig, HttpInterceptorConfig } from './auth.config';
import { AuthService } from './auth.service';

describe('AuthConfig', () => {
  describe('create', () => {
    it('succeed', () => {
      const httpInterceptor: HttpInterceptorConfig = {
        apiRequestsToSecure: ['http://localhost:5000/*']
      };
      const config: AuthConfig = {
        tenant_domain: 'shark-academy',
        client_id: 'e8666cc0-647d-4e17-8961-27bd25159688',
        audience: 'http://localhost:4200',
        default_redirect_uri: 'http://localhost:4200',
        default_slo_after_revoke: false,
        region: 'eu',
        cryptr_base_url: 'http://localhost:4000',
        httpInterceptor
      };
      const factory = new AuthClientConfig(config);

      const client = CryptrClientFactory.createClient(factory);

      const authService = new AuthService(client, null, null, null, null, null);
      expect(authService).not.toBe(null);
      expect(authService.getIdToken).not.toBe(null);
      expect(authService.getIdToken()).toBe(undefined);
      expect(authService.getAccessToken()).toBe(undefined);
      expect(authService.getUser()).toBe(undefined);
      expect(authService.canHandleAuthentication()).toBe(false);

      authService.isAuthenticated().then(canHandle => {
        expect(canHandle).toBe(false);
      }).catch(err => {
        expect(err).toBe(undefined);
      });

      expect(typeof authService.observableAuthenticated()).toBe('object');
      expect(authService.refreshTokens()).toBe(undefined);
      try {
        authService.handleRedirectCallback();
      } catch (error) {
        expect(error).not.toBe(undefined);
      }
      expect(authService.ngOnDestroy()).not.toBe(null);
      expect(authService.logOut(window.location)).not.toBe(null);
    });
  });
});

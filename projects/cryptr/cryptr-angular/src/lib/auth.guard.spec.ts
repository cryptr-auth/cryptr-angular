import { CryptrClientFactory } from './auth.client';
import { AuthClientConfig, AuthConfig, HttpInterceptorConfig } from './auth.config';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  describe('create', () => {
    it('succeed', () => {
      const httpInterceptor: HttpInterceptorConfig = {
        apiRequestsToSecure: ['a']
      };
      const config: AuthConfig = {
        tenant_domain: 'shark-academy',
        client_id: '123-xeab',
        audience: 'http://localhost:4200',
        default_redirect_uri: 'http://localhost:4200',
        cryptr_base_url: 'http://localhost:4000',
        httpInterceptor
      };
      const factory = new AuthClientConfig(config);

      const client = CryptrClientFactory.createClient(factory);

      const authService = new AuthService(client, null, null, null, null, null);
      const guard = new AuthGuard(authService);
      expect(guard).not.toBe(null);
    });
  });
});

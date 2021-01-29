import { CleeckClientFactory } from './auth.client';
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
        development: true,
        httpInterceptor
      };
      const factory = new AuthClientConfig(config);

      const client = CleeckClientFactory.createClient(factory);

      const authService = new AuthService(client, null, null, null, null);
      const guard = new AuthGuard(authService);
      expect(guard).not.toBe(null);
    });
  });
});

import { AuthModule } from './auth.module';


describe('AuthModule', () => {

  describe('forRoot', () => {
    it('returns an object', () => {
      const environment = {
        production: false,
        cryptrConfig: {
          tenant_domain: 'shark-academy',
          client_id: '724b141a-e1eb-4f5b-bfca-22eca8ae3cc4',
          audience: 'http://localhost:4200',
          default_redirect_uri: 'http://localhost:4200/',
          default_slo_after_revoke: false,
          region: 'eu',
          httpInterceptor: {
            apiRequestsToSecure: [
              'http://localhost:5000/*',
            ]
          },
        },
        resource_server_url: 'http://localhost:5000',
      };
      const authModule = AuthModule.forRoot(environment.cryptrConfig);
      expect(authModule.providers).not.toBeNull();
    });
  });
});

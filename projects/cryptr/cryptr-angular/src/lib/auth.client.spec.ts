import { CleeckClientFactory } from './auth.client';
import { AuthClientConfig, AuthConfig, HttpInterceptorConfig } from './auth.config';

describe('CleeckClientFactory', () => {
  describe('createclient', () => {
    it('create an instance if proper config', () => {
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

      const client = CleeckClientFactory.createClient(factory);
      expect(client).not.toBe(null);
      expect(client.memory).not.toBe(null);
      expect(client.config).toEqual(config);
    });

    it('fails if config empty httpInterceptor apiRequestsToSecure', () => {
      const httpInterceptor: HttpInterceptorConfig = {
        apiRequestsToSecure: []
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

      expect(() => {
        CleeckClientFactory.createClient(factory);
      }).toThrowError('You must specify at least one item in config.httpInterceptor.apiRequestsToSecure . Mainly use your Resource server url');
    });

    it('fails if config missing', () => {
      const factory = new AuthClientConfig(null);

      expect(() => {
        CleeckClientFactory.createClient(factory);
      }).toThrowError('Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set');
    });
    it('create an instance if config as chosen default locale', () => {
      const httpInterceptor: HttpInterceptorConfig = {
        apiRequestsToSecure: ['a']
      };
      const config: AuthConfig = {
        tenant_domain: 'shark-academy',
        client_id: '123-xeab',
        audience: 'http://localhost:4200',
        default_redirect_uri: 'http://localhost:4200',
        cryptr_base_url: 'http://localhost:4000',
        default_locale: 'fr',
        httpInterceptor
      };
      const factory = new AuthClientConfig(config);

      const client = CleeckClientFactory.createClient(factory);
      expect(client).not.toBe(null);
      expect(client.config.default_locale).toEqual('fr');
    });

    it('create an instance if config as chosen region', () => {
      const httpInterceptor: HttpInterceptorConfig = {
        apiRequestsToSecure: ['a']
      };
      const config: AuthConfig = {
        tenant_domain: 'shark-academy',
        client_id: '123-xeab',
        audience: 'http://localhost:4200',
        default_redirect_uri: 'http://localhost:4200',
        cryptr_base_url: 'http://localhost:4000',
        region: 'eu',
        httpInterceptor
      };
      const factory = new AuthClientConfig(config);

      const client = CleeckClientFactory.createClient(factory);
      expect(client).not.toBe(null);
      expect(client.config.region).toEqual('eu');
    });

    it('create an instance if config as chosen region', () => {
      const httpInterceptor: HttpInterceptorConfig = {
        apiRequestsToSecure: ['a']
      };
      const config: AuthConfig = {
        tenant_domain: 'shark-academy',
        client_id: '123-xeab',
        audience: 'http://localhost:4200',
        default_redirect_uri: 'http://localhost:4200',
        cryptr_base_url: 'http://localhost:4000',
        region: 'eu',
        httpInterceptor
      };
      const factory = new AuthClientConfig(config);

      const client = CleeckClientFactory.createClient(factory);
      expect(client).not.toBe(null);
      expect(client.config.region).toEqual('eu');
    });

    // xit('create an instance if config as wrong region', () => {
    //   const httpInterceptor: HttpInterceptorConfig = {
    //     apiRequestsToSecure: ['a']
    //   };
    //   const config: AuthConfig = {
    //     tenant_domain: 'shark-academy',
    //     client_id: '123-xeab',
    //     audience: 'http://localhost:4200',
    //     default_redirect_uri: 'http://localhost:4200',
    //     cryptr_base_url: 'http://localhost:4000',
    //     region: 'de',
    //     httpInterceptor
    //   };
    //   const factory = new AuthClientConfig(config);

    //   const client = CleeckClientFactory.createClient(factory);
    //   expect(client).not.toBe(null);
    //   expect(client.config.region).toEqual('eu');
    // });
  });
});

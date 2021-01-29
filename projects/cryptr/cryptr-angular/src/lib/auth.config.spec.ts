import { AuthClientConfig } from './auth.config';

describe('AuthConfig', () => {
  describe('create', () => {
    it('succeed', () => {
      const ClientConfig = new AuthClientConfig(null);
    });
  });
});

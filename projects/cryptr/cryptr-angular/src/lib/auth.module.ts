import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthConfig, AuthConfigService, AuthClientConfig } from './auth.config';
import { AuthGuard } from './auth.guard';
import { CommonModule } from '@angular/common';
import { CryptrClientFactory, CryptrClientService } from './auth.client';

@NgModule({
  imports: [CommonModule],
})
export class AuthModule {
  static forRoot(config?: AuthConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        AuthGuard,
        {
          provide: AuthConfigService,
          useValue: config,
        },
        {
          provide: CryptrClientService,
          useFactory: CryptrClientFactory.createClient,
          deps: [AuthClientConfig],
        },
      ],
    };
  }
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthConfig, AuthConfigService, AuthClientConfig } from './auth.config';
import { AuthGuard } from './auth.guard';
import { AccountAccessButtonComponent } from './account-access-button/account-access-button.component';
import { CommonModule } from '@angular/common';
import { CryptrClientFactory, CryptrClientService } from './auth.client';

@NgModule({
  imports: [CommonModule],
  declarations: [AccountAccessButtonComponent],
  exports: [AccountAccessButtonComponent],
  bootstrap: [AccountAccessButtonComponent]
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

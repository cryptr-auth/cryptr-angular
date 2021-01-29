import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthConfig, AuthConfigService, AuthClientConfig } from './auth.config';
import { CleeckClientService, CleeckClientFactory } from './auth.client';
import { AuthGuard } from './auth.guard';
import { AccountAccessButtonComponent } from './account-access-button/account-access-button.component';
import { CommonModule } from '@angular/common';

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
          provide: CleeckClientService,
          useFactory: CleeckClientFactory.createClient,
          deps: [AuthClientConfig],
        },
      ],
    };
  }
}

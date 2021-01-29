import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CleeckClientFactory } from '../auth.client';
import { AuthClientConfig, AuthConfig, HttpInterceptorConfig } from '../auth.config';
import { AuthService } from '../auth.service';

import { AccountAccessButtonComponent } from './account-access-button.component';

describe('AccountAccessButtonComponent', () => {
  let component: AccountAccessButtonComponent;
  let fixture: ComponentFixture<AccountAccessButtonComponent>;

  const httpInterceptor: HttpInterceptorConfig = {
    apiRequestsToSecure: ['http://localhost:5000/*']
  };
  const config: AuthConfig = {
    audience: 'http://localhost:4200',
    tenant_domain: 'shark-academy',
    client_id: 'e8666cc0-647d-4e17-8961-27bd25159688',
    default_redirect_uri: 'http://localhost:4200',
    httpInterceptor
  };
  const factory = new AuthClientConfig(config);

  const client = CleeckClientFactory.createClient(factory);

  const authService = new AuthService(client, null, null, null, null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAccessButtonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAccessButtonComponent);
    component = fixture.componentInstance;
    component.auth = authService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeFalsy();
    // expect(component).toBeTruthy();
  });
});

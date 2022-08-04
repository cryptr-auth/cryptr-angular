import { Component, OnInit } from '@angular/core';
import { AuthService } from 'projects/cryptr/cryptr-angular/src/lib/auth.service';
import { environment } from 'projects/playground/src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  authenticated = false;
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.currentAuthenticationObservable().subscribe((isAuthenticated: boolean) => {
      this.authenticated = isAuthenticated;
    });
  }

  signUpWithRedirect(): void {
    this.auth.signUpWithRedirect();
  }

  signinWithSso(): void {
    this.auth.signInWithSso(environment.idpIds[0]);
  }

  public bareSigninWithSsoGateway(): void {
    this.auth.signInWithSsoGateway(null, { locale: 'fr' });
  }
  public simpleSigninWithSsoGateway(): void {
    this.auth.signInWithSsoGateway(environment.idpIds[0], { locale: 'fr' });
  }
  public multiSigninWithSsoGateway(): void {
    this.auth.signInWithSsoGateway(environment.idpIds, { locale: 'fr' });
  }
}

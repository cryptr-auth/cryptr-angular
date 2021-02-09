import { Component, OnInit } from '@angular/core';
import { AuthService } from '@cryptr/cryptr-angular';

@Component({
  selector: 'app-growth-hacker',
  templateUrl: './growth-hacker.component.html',
  styleUrls: ['./growth-hacker.component.scss']
})
export class GrowthHackerComponent implements OnInit {
  authenticated = false;
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.observableAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.authenticated = isAuthenticated;
    });
  }

  signUpWithRedirect(): void {
    this.auth.signUpWithRedirect();
  }
  triggerError(): void {
    throw new Error(`My sentry signup error logrocket ${new Date().getTime()}`);
  }
}

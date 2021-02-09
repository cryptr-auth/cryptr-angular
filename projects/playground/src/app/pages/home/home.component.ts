import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '@cryptr/cryptr-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
}

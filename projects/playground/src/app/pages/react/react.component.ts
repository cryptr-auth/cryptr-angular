import { Component, OnInit } from '@angular/core';
import { AuthService } from '@cryptr/cryptr-angular';

@Component({
  selector: 'app-react',
  templateUrl: './react.component.html',
  styleUrls: ['./react.component.scss']
})
export class ReactComponent implements OnInit {
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

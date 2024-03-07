import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'projects/cryptr/cryptr-angular/src/public-api';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})
export class SidebarNavComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


  logOut(popupStyle = 0): void {
    this.auth.logOut(() => {
      alert('logged out')
    });
  }

}

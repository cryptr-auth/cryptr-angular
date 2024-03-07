import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'projects/playground/src/environments/environment';
import { ResponseData } from '../../interfaces';
import { AuthService } from 'projects/cryptr/cryptr-angular/src/lib/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: ResponseData;

  constructor(public auth: AuthService, public http: HttpClient) { }

  ngOnInit(): void {
    console.debug('should fetch data from backend on', environment.resource_server_url)
    if (this.auth.currentAuthenticationState()) {
      this.fetchSecuredData();
    } else {
      console.error('Vous n\'êtes pas authentifié');
    }
  }

  securedRoute(): string {
    const { resource_server_url } = environment;
    return `${resource_server_url}/`;
  }

  fetchSecuredData(): void {
    const headers = new HttpHeaders({});
    this.http
      .get<ResponseData>(this.securedRoute(), { headers })
      .subscribe((response) => {
        this.data = response
      })
  }
}

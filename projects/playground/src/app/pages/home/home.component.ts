import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'projects/playground/src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { ResponseData } from '../../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: ResponseData;

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
    console.debug('should fetch data from backend on', environment.resource_server_url)
    this.fetchSecuredData();
  }

  securedRoute(): string {
    const { resource_server_url } = environment;
    return `${resource_server_url}/public`;
  }

  fetchSecuredData(): void {
    this.http
      .get<ResponseData>(this.securedRoute())
      .subscribe((response) => {
        this.data = response
      })
  }
}

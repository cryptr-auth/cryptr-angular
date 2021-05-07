import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

/** @ignore */
@Injectable({
  providedIn: 'root',
})
export class AbstractNavigator {
  /** @ignore */
  private readonly router: Router;

  /** @ignore */
  constructor(private location: Location, injector: Injector) {
    try {
      this.router = injector.get(Router);
    } catch { }
  }

  /** @ignore */
  navigateByUrl(url: string): void {
    if (this.router) {
      setTimeout(() => {
        this.router.navigateByUrl(url);
      }, 0);

      return;
    }

    this.location.replaceState(url);
  }
}

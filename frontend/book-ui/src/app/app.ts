import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    @if(showHeader$ | async){
    <app-header></app-header>
    }
    <router-outlet></router-outlet>
  `,
})
export class App {
  public showHeader$: Observable<boolean>;
  constructor(private readonly router: Router) {
    this.showHeader$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => !this.router.url.startsWith('/login'))
    );
  }
}

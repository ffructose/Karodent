import { Component, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

type HeaderType = 'one' | 'two';
type FooterVariant = 'default' | 'contacts';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})

export class App {
  activeHeader: HeaderType = 'one';
  footerVariant: FooterVariant = 'default';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects.split('?')[0];

        // HEADER 
        this.activeHeader = (url === '/' || url === ''|| url === '/contacts') ? 'one' : 'two';

        // FOOTER 
        this.footerVariant = (url === '/contacts') ? 'contacts' : 'default';
      });
  }
}
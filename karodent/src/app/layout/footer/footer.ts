import { Component, HostListener, Input } from '@angular/core';

type FooterVariant = 'default' | 'contacts';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  @Input() variant: FooterVariant = 'default';

  showGoTop = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    this.showGoTop = scrollTop > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

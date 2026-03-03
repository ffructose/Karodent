import { Component, HostListener, Input } from '@angular/core';

type DropdownName = 'city' | 'lang' | null;

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {

  @Input() headerType: 'one' | 'two' = 'one';


  cities = ['WARSAW', 'PULAWY'];
  langs = ['PL', 'ENG', 'UA'];

  selectedCity = this.cities[0];
  selectedLang = this.langs[0];

  openDropdown: DropdownName = null;
  mobileMenuOpen = false;

  toggle(which: Exclude<DropdownName, null>) {
    this.openDropdown = this.openDropdown === which ? null : which;
  }

  closeDropdowns() { this.openDropdown = null; }

  toggleMobileMenu(ev?: Event) {
    ev?.stopPropagation();
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) this.closeDropdowns();
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.closeDropdowns();
  }

  onMobileNavClick() { this.closeMobileMenu(); }

  selectCity(city: string) {
    this.selectedCity = city;
    this.closeDropdowns();
  }

  selectLang(lang: string) {
    this.selectedLang = lang;
    this.closeDropdowns();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const clickedInside =
      !!target.closest('header.header') || !!target.closest('aside.mobile-panel');

    if (clickedInside) return;

    this.closeMobileMenu();
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeMobileMenu(); }


  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // поріг можна змінити (30/50/80)
    this.isScrolled = window.scrollY > 40;
  }
}

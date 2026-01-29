import { Component, HostListener } from '@angular/core';

type DropdownName = 'city' | 'lang' | null;

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  cities = ['WARSAW', 'PULAWY'];
  langs = ['PL', 'ENG', 'UA'];

  selectedCity = this.cities[0];
  selectedLang = this.langs[0];

  openDropdown: DropdownName = null;

  mobileMenuOpen = false;

  toggle(which: Exclude<DropdownName, null>) {
    this.openDropdown = this.openDropdown === which ? null : which;
  }

  closeDropdowns() {
    this.openDropdown = null;
  }

  toggleMobileMenu(ev?: Event) {
    ev?.stopPropagation();
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) this.closeDropdowns();
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.closeDropdowns();
  }

  onMobileNavClick() {
    // коли клікнули лінк — закриваємо меню
    this.closeMobileMenu();
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.closeDropdowns();
    // localStorage / navigation - за потреби
  }

  selectLang(lang: string) {
    this.selectedLang = lang;
    this.closeDropdowns();
  }

  // click outside: close dropdowns + mobile menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Якщо клік був всередині header або mobile-panel — НЕ закриваємо
    const clickedInside =
      !!target.closest('header.header') || !!target.closest('aside.mobile-panel');

    if (clickedInside) return;

    // Інакше — закрити все
    this.closeMobileMenu();
  }


  // Esc
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMobileMenu();
  }


}

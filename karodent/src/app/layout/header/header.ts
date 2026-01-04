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

  toggle(which: Exclude<DropdownName, null>) {
    this.openDropdown = this.openDropdown === which ? null : which;
  }

  closeAll() {
    this.openDropdown = null;
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.closeAll();
    // тут можеш робити навігацію/збереження в localStorage, якщо треба
  }

  selectLang(lang: string) {
    this.selectedLang = lang;
    this.closeAll();
    // тут можеш підключити i18n/ngx-translate і т.д.
  }

  // 1) click anywhere - close
  @HostListener('document:click')
  onDocumentClick() {
    this.closeAll();
  }

  // 2) any wheel move - close
  @HostListener('window:scroll')
  onScroll() {
    this.closeAll();
  }

  @HostListener('window:wheel')
  onWheel() {
    this.closeAll();
  }

  // 3) Esc — close
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeAll();
  }
}

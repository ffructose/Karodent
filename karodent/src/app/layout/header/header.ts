import {
  Component,
  HostListener,
  Input,
} from '@angular/core';

import {
  TranslateService,
} from '@ngx-translate/core';

type DropdownName = 'city' | 'lang' | null;
type LanguageCode = 'pl' | 'en' | 'uk';

interface LanguageOption {
  code: LanguageCode;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  @Input() headerType: 'one' | 'two' = 'one';

  cities = ['WARSAW', 'PULAWY'];

  readonly langs: LanguageOption[] = [
    { code: 'pl', label: 'PL' },
    { code: 'en', label: 'ENG' },
    { code: 'uk', label: 'UA' },
  ];

  selectedCity = this.cities[0];
  selectedLang: LanguageOption = this.langs[0];

  openDropdown: DropdownName = null;
  mobileMenuOpen = false;
  isScrolled = false;

  constructor(
    private readonly translate: TranslateService,
  ) {
    const savedLanguage =
      localStorage.getItem('karodent-language');

    const initialLanguage: LanguageCode =
      this.isLanguageCode(savedLanguage)
        ? savedLanguage
        : 'pl';

    this.selectedLang =
      this.langs.find(
        language => language.code === initialLanguage
      ) ?? this.langs[0];

    this.translate.use(initialLanguage);

    document.documentElement.lang =
      initialLanguage;
  }

  toggle(
    which: Exclude<DropdownName, null>
  ): void {
    this.openDropdown =
      this.openDropdown === which
        ? null
        : which;
  }

  closeDropdowns(): void {
    this.openDropdown = null;
  }

  toggleMobileMenu(ev?: Event): void {
    ev?.stopPropagation();

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

    if (!this.mobileMenuOpen) {
      this.closeDropdowns();
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.closeDropdowns();
  }

  onMobileNavClick(): void {
    this.closeMobileMenu();
  }

  selectCity(city: string): void {
    this.selectedCity = city;
    this.closeDropdowns();
  }

  selectLang(
    language: LanguageOption
  ): void {
    this.selectedLang = language;

    this.translate.use(language.code);

    localStorage.setItem(
      'karodent-language',
      language.code
    );

    document.documentElement.lang =
      language.code;

    this.closeDropdowns();
  }

  private isLanguageCode(
    value: string | null
  ): value is LanguageCode {
    return (
      value === 'pl' ||
      value === 'en' ||
      value === 'uk'
    );
  }

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(
    event: MouseEvent
  ): void {
    const target =
      event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const clickedInside =
      !!target.closest('header.header') ||
      !!target.closest('aside.mobile-panel');

    if (clickedInside) {
      return;
    }

    this.closeMobileMenu();
  }

  @HostListener(
    'document:keydown.escape'
  )
  onEsc(): void {
    this.closeMobileMenu();
  }

  @HostListener(
    'window:scroll'
  )
  onWindowScroll(): void {
    this.isScrolled =
      window.scrollY > 40;
  }
}
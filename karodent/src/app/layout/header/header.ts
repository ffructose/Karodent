import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  HostListener,
  Inject,
  Input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  private storage: Storage | null = null;

  constructor(
    private readonly translate: TranslateService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    // SSR uses Polish as the stable initial language.
    const initialLanguage: LanguageCode = 'pl';

    this.selectedLang =
      this.langs.find(
        language => language.code === initialLanguage,
      ) ?? this.langs[0];

    this.translate.use(initialLanguage);
    this.document.documentElement.lang = initialLanguage;

    // Runs only in the browser, never during server-side rendering.
    afterNextRender(() => {
      this.storage = localStorage;

      const savedLanguage =
        this.storage.getItem('karodent-language');

      if (!this.isLanguageCode(savedLanguage)) {
        return;
      }

      this.selectedLang =
        this.langs.find(
          language => language.code === savedLanguage,
        ) ?? this.langs[0];

      this.translate.use(savedLanguage);
      this.document.documentElement.lang = savedLanguage;
    });
  }

  toggle(
    which: Exclude<DropdownName, null>,
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
    language: LanguageOption,
  ): void {
    this.selectedLang = language;

    this.translate.use(language.code);

    this.storage?.setItem(
      'karodent-language',
      language.code,
    );

    this.document.documentElement.lang =
      language.code;

    this.closeDropdowns();
  }

  private isLanguageCode(
    value: string | null,
  ): value is LanguageCode {
    return (
      value === 'pl' ||
      value === 'en' ||
      value === 'uk'
    );
  }

  @HostListener(
    'document:click',
    ['$event'],
  )
  onDocumentClick(
    event: MouseEvent,
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
    'document:keydown.escape',
  )
  onEsc(): void {
    this.closeMobileMenu();
  }

  @HostListener(
    'window:scroll',
  )
  onWindowScroll(): void {
    this.isScrolled =
      (this.document.defaultView?.scrollY ?? 0) > 40;
  }
}
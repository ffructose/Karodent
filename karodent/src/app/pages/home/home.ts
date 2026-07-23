import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';

type CardState = 'left' | 'active' | 'right' | 'hidden';

interface ServiceItem {
  nameKey: string;
  titleKey: string;
  descKey: string;
}

interface CaseItem {
  before: string;
  after: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  photos = [
    '/assets/photos/photo_1.jpg',
    '/assets/photos/photo_2.jpg',
    '/assets/photos/photo_3.jpg',
    '/assets/photos/photo_4.jpg',
    '/assets/photos/photo_5.jpg',
  ];

  activeIndex = 0;

  setActive(i: number): void {
    this.activeIndex = i;
  }

  stateOf(i: number): CardState {
    const n = this.photos.length;

    if (n === 0) {
      return 'hidden';
    }

    const prev = (this.activeIndex - 1 + n) % n;
    const next = (this.activeIndex + 1) % n;

    if (i === this.activeIndex) return 'active';
    if (i === prev) return 'left';
    if (i === next) return 'right';

    return 'hidden';
  }

  services: ServiceItem[] = [
    {
      nameKey: 'HOME_PAGE.SERVICES.IMPLANTOLOGY.NAME',
      titleKey: 'HOME_PAGE.SERVICES.IMPLANTOLOGY.TITLE',
      descKey: 'HOME_PAGE.SERVICES.IMPLANTOLOGY.DESCRIPTION',
    },
    {
      nameKey: 'HOME_PAGE.SERVICES.AESTHETICS_SPA.NAME',
      titleKey: 'HOME_PAGE.SERVICES.AESTHETICS_SPA.TITLE',
      descKey: 'HOME_PAGE.SERVICES.AESTHETICS_SPA.DESCRIPTION',
    },
    {
      nameKey: 'HOME_PAGE.SERVICES.TOOTH_EXTRACTION.NAME',
      titleKey: 'HOME_PAGE.SERVICES.TOOTH_EXTRACTION.TITLE',
      descKey: 'HOME_PAGE.SERVICES.TOOTH_EXTRACTION.DESCRIPTION',
    },
  ];

  servicesActiveIndex = 0;
  isFading = false;

  private fadeTimerId: number | null = null;
  private failSafeTimerId: number | null = null;
  private readonly isBrowser: boolean;

  cases: CaseItem[] = [
    {
      before: '/assets/photos/photo_1.jpg',
      after: '/assets/photos/photo_2.jpg',
    },
    {
      before: '/assets/photos/photo_3.jpg',
      after: '/assets/photos/photo_4.jpg',
    },
    {
      before: '/assets/photos/photo_5.jpg',
      after: '/assets/photos/photo_6.jpg',
    },
  ];

  activeCase = 0;
  comparePercent = 55;
  protected isDragging = false;

  isCaseSliding = false;
  slideDir: 'next' | 'prev' | null = null;

  @ViewChild('frame', { static: true })
  frameRef!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone,
    @Inject(DOCUMENT)
    private readonly document: Document,
    @Inject(PLATFORM_ID)
    platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.document.addEventListener(
        'visibilitychange',
        this.onVisibilityChange,
      );
    }
  }

  private readonly onVisibilityChange = (): void => {
    if (!this.isBrowser || this.document.hidden) {
      return;
    }

    this.zone.run(() => {
      this.isFading = false;
      this.cdr.detectChanges();
    });
  };

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.document.removeEventListener(
        'visibilitychange',
        this.onVisibilityChange,
      );
    }

    this.clearTimers();
  }

  private clearTimers(): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      this.fadeTimerId = null;
      this.failSafeTimerId = null;
      return;
    }

    if (this.fadeTimerId !== null) {
      browserWindow.clearTimeout(this.fadeTimerId);
      this.fadeTimerId = null;
    }

    if (this.failSafeTimerId !== null) {
      browserWindow.clearTimeout(this.failSafeTimerId);
      this.failSafeTimerId = null;
    }
  }

  private normalizeIndex(i: number): number {
    const n = this.services.length;

    if (n === 0) {
      return 0;
    }

    return ((i % n) + n) % n;
  }

  select(index: number): void {
    const next = this.normalizeIndex(index);

    if (next === this.servicesActiveIndex) {
      return;
    }

    this.animateTo(next);
  }

  nextService(): void {
    this.animateTo(
      this.normalizeIndex(this.servicesActiveIndex + 1),
    );
  }

  prevService(): void {
    this.animateTo(
      this.normalizeIndex(this.servicesActiveIndex - 1),
    );
  }

  private animateTo(index: number): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      this.servicesActiveIndex = index;
      this.isFading = false;
      return;
    }

    this.clearTimers();

    this.isFading = true;
    this.cdr.detectChanges();

    this.failSafeTimerId = browserWindow.setTimeout(() => {
      this.zone.run(() => {
        this.isFading = false;
        this.cdr.detectChanges();
      });
    }, 2000);

    this.fadeTimerId = browserWindow.setTimeout(() => {
      this.zone.run(() => {
        this.servicesActiveIndex = index;
        this.cdr.detectChanges();

        browserWindow.requestAnimationFrame(() => {
          this.isFading = false;
          this.cdr.detectChanges();
          this.clearTimers();
        });
      });
    }, 220);
  }

  get serviceProgressPercent(): number {
    const total = this.services.length || 1;
    return ((this.servicesActiveIndex + 1) / total) * 100;
  }

  get prevCaseIndex(): number {
    const n = this.cases.length || 1;
    return (this.activeCase - 1 + n) % n;
  }

  get nextCaseIndexReal(): number {
    const n = this.cases.length || 1;
    return (this.activeCase + 1) % n;
  }

  nextCase(): void {
    if (this.isDragging || this.isCaseSliding) {
      return;
    }

    this.comparePercent = 50;
    this.slideDir = 'next';
    this.isCaseSliding = true;
    this.cdr.detectChanges();
  }

  prevCase(): void {
    if (this.isDragging || this.isCaseSliding) {
      return;
    }

    this.comparePercent = 50;
    this.slideDir = 'prev';
    this.isCaseSliding = true;
    this.cdr.detectChanges();
  }

  onCaseTransitionEnd(e: TransitionEvent): void {
    if (e.propertyName !== 'transform') {
      return;
    }

    if (!this.isCaseSliding || !this.slideDir) {
      return;
    }

    const n = this.cases.length || 1;

    if (this.slideDir === 'next') {
      this.activeCase = (this.activeCase + 1) % n;
    } else {
      this.activeCase = (this.activeCase - 1 + n) % n;
    }

    this.isCaseSliding = false;
    this.slideDir = null;
    this.cdr.detectChanges();
  }

  get casesProgress(): number {
    const total = this.cases.length || 1;
    return ((this.activeCase + 1) / total) * 100;
  }

  onPointerDown(e: PointerEvent): void {
    this.isDragging = true;
    this.frameRef.nativeElement.classList.add('is-dragging');
    this.updateCompare(e);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.updateCompare(e);
  }

  onPointerUp(): void {
    this.isDragging = false;
    this.frameRef.nativeElement.classList.remove('is-dragging');
  }

  private updateCompare(e: PointerEvent): void {
    const rect =
      this.frameRef.nativeElement.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;

    this.comparePercent =
      Math.min(100, Math.max(0, percent));
  }

  scrollToFooter(): void {
    if (!this.isBrowser) {
      return;
    }

    const footer =
      this.document.getElementById('page-footer');

    footer?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

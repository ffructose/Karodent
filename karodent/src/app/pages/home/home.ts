import { ChangeDetectorRef, Component, NgZone, ElementRef, ViewChild } from '@angular/core';

type CardState = 'left' | 'active' | 'right' | 'hidden';

interface ServiceItem {
  name: string;
  title: string;
  desc: string;
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
export class Home {

  photos = [
    '/assets/photos/photo_1.jpg',
    '/assets/photos/photo_2.jpg',
    '/assets/photos/photo_3.jpg',
    '/assets/photos/photo_4.jpg',
    '/assets/photos/photo_5.jpg',
  ];
  activeIndex = 0;

  setActive(i: number) {
    this.activeIndex = i;
  }

  // Визначаємо: ліва/активна/права (інші hidden)
  stateOf(i: number): CardState {
    const n = this.photos.length;
    if (n === 0) return 'hidden';

    const prev = (this.activeIndex - 1 + n) % n;
    const next = (this.activeIndex + 1) % n;

    if (i === this.activeIndex) return 'active';
    if (i === prev) return 'left';
    if (i === next) return 'right';
    return 'hidden';
  }


  // services
  services: ServiceItem[] = [
    {
      name: 'Implantology',
      title: 'Implantology',
      desc: 'Dental implants replace missing teeth with stable, natural-looking solutions. We work with proven systems and plan treatment individually for predictable results.',
    },
    {
      name: 'Aesthetics & Spa',
      title: 'Aesthetics & Spa',
      desc: 'Aesthetic treatments focused on harmony, comfort and natural results.',
    },
    {
      name: 'Tooth Extraction',
      title: 'Tooth Extraction',
      desc: 'Safe extractions, including surgical cases. Minimal trauma, good healing protocols.',
    },
    // додай решту
  ];

  servicesActiveIndex = 0;
  isFading = false;

  // зберігаємо id таймерів, щоб можна було чистити
  private fadeTimerId: number | null = null;
  private failSafeTimerId: number | null = null;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onVisibilityChange = () => {
    if (!document.hidden) {
      // повернулися на вкладку — скинемо можливий "завислий" fade
      this.zone.run(() => {
        this.isFading = false;
        this.cdr.detectChanges();
      });
    }
  };

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.fadeTimerId !== null) {
      clearTimeout(this.fadeTimerId);
      this.fadeTimerId = null;
    }
    if (this.failSafeTimerId !== null) {
      clearTimeout(this.failSafeTimerId);
      this.failSafeTimerId = null;
    }
  }

  private normalizeIndex(i: number): number {
    const n = this.services.length;
    if (n === 0) return 0;
    return ((i % n) + n) % n;
  }

  select(index: number): void {
    const next = this.normalizeIndex(index);
    if (next === this.servicesActiveIndex) return;
    this.animateTo(next);
  }

  nextService(): void {
    this.animateTo(this.normalizeIndex(this.servicesActiveIndex + 1));
  }

  prevService(): void {
    this.animateTo(this.normalizeIndex(this.servicesActiveIndex - 1));
  }

  private animateTo(index: number): void {
    // якщо зависло — не блокуй назавжди, просто перезапусти
    this.clearTimers();

    this.isFading = true;
    this.cdr.detectChanges();

    // FAIL-SAFE: якщо щось піде не так — через 2с зніми fade примусово
    this.failSafeTimerId = window.setTimeout(() => {
      this.zone.run(() => {
        this.isFading = false;
        this.cdr.detectChanges();
      });
    }, 2000);

    // нормальний таймер анімації
    this.fadeTimerId = window.setTimeout(() => {
      this.zone.run(() => {
        this.servicesActiveIndex = index;
        this.cdr.detectChanges();

        requestAnimationFrame(() => {
          this.isFading = false;
          this.cdr.detectChanges();
          this.clearTimers(); // прибираємо fail-safe, бо все успішно
        });
      });
    }, 220);
  }


  get serviceProgressPercent(): number {
    const total = this.services.length || 1;
    return ((this.servicesActiveIndex + 1) / total) * 100;
  }

  // ====== SLIDER (film strip) =======

  cases: CaseItem[] = [
    { before: '/assets/photos/photo_1.jpg', after: '/assets/photos/photo_2.jpg' },
    { before: '/assets/photos/photo_3.jpg', after: '/assets/photos/photo_4.jpg' },
    { before: '/assets/photos/photo_5.jpg', after: '/assets/photos/photo_6.jpg' },
  ];

  activeCase = 0;

  comparePercent = 55;
  protected isDragging = false;

  isCaseSliding = false;
  slideDir: 'next' | 'prev' | null = null;

  @ViewChild('frame', { static: true }) frameRef!: ElementRef<HTMLDivElement>;

  // індекси для трьох кадрів
  get prevCaseIndex(): number {
    const n = this.cases.length || 1;
    return (this.activeCase - 1 + n) % n;
  }
  get nextCaseIndexReal(): number {
    const n = this.cases.length || 1;
    return (this.activeCase + 1) % n;
  }

  nextCase(): void {
    if (this.isDragging || this.isCaseSliding) return;
    this.comparePercent = 50;           // або прибери, якщо хочеш зберігати позицію
    this.slideDir = 'next';
    this.isCaseSliding = true;
    this.cdr.detectChanges();
  }

  prevCase(): void {
    if (this.isDragging || this.isCaseSliding) return;
    this.comparePercent = 50;           // або прибери, якщо хочеш зберігати позицію
    this.slideDir = 'prev';
    this.isCaseSliding = true;
    this.cdr.detectChanges();
  }

  // важливо: ловимо transitionend саме від case-track, а не від дітей
  onCaseTransitionEnd(e: TransitionEvent): void {
    if (e.propertyName !== 'transform') return;
    if (!this.isCaseSliding || !this.slideDir) return;

    const n = this.cases.length || 1;

    if (this.slideDir === 'next') {
      this.activeCase = (this.activeCase + 1) % n;
    } else {
      this.activeCase = (this.activeCase - 1 + n) % n;
    }

    // скидаємо стан: трек автоматично повертається в center (через базовий transform -33.33%)
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
    if (!this.isDragging) return;
    this.updateCompare(e);
  }

  onPointerUp(): void {
    this.isDragging = false;
    this.frameRef.nativeElement.classList.remove('is-dragging');
  }

  private updateCompare(e: PointerEvent): void {
    const rect = this.frameRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;

    this.comparePercent = Math.min(100, Math.max(0, percent));
  }


  // SCROLLBAR
  scrollToFooter() {
    const footer = document.getElementById('page-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';

type CardState = 'left' | 'active' | 'right' | 'hidden';

@Component({
  selector: 'app-aboutus',
  standalone: false,
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus implements OnDestroy {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
    @Inject(PLATFORM_ID)
    platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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

  @ViewChild('track')
  track!: ElementRef<HTMLDivElement>;

  ourPhotos = [
    '/assets/photos/photo_1.jpg',
    '/assets/photos/photo_2.jpg',
    '/assets/photos/photo_3.jpg',
    '/assets/photos/photo_4.jpg',
    '/assets/photos/photo_5.jpg',
  ];

  loopPhotos: string[] = [];

  locked = false;
  settleTimer: number | null = null;
  lastLeft = 0;

  lightboxOpen = false;
  lightboxIndex = 0;
  private scrollY = 0;

  get lightboxSrc(): string {
    return this.ourPhotos[this.lightboxIndex];
  }

  ngOnInit(): void {
    this.loopPhotos = [
      ...this.ourPhotos,
      ...this.ourPhotos,
      ...this.ourPhotos,
    ];
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.document.defaultView?.requestAnimationFrame(() => {
      this.jumpToMiddle();
    });
  }

  ngOnDestroy(): void {
    const browserWindow = this.document.defaultView;

    if (
      browserWindow &&
      this.settleTimer !== null
    ) {
      browserWindow.clearTimeout(this.settleTimer);
    }
  }

  private trackEl(): HTMLDivElement {
    return this.track.nativeElement;
  }

  private firstCardEl(): HTMLElement | null {
    return this.trackEl()
      .querySelector<HTMLElement>('.card');
  }

  private cardsEl(): HTMLElement | null {
    return this.trackEl()
      .querySelector<HTMLElement>('.cards');
  }

  private step(): number {
    const card = this.firstCardEl();

    if (!card) {
      return 320;
    }

    const cards = this.cardsEl();
    const browserWindow = this.document.defaultView;

    const styles =
      cards && browserWindow
        ? browserWindow.getComputedStyle(cards)
        : null;

    const gapString =
      styles?.gap ||
      styles?.columnGap ||
      '0';

    const gap = parseFloat(gapString) || 0;

    return card.offsetWidth + gap;
  }

  private oneBlockWidth(): number {
    return this.ourPhotos.length * this.step();
  }

  private jumpToMiddle(): void {
    this.trackEl().scrollLeft = this.oneBlockWidth();
  }

  next(): void {
    this.scrollDir(1);
  }

  prev(): void {
    this.scrollDir(-1);
  }

  private scrollDir(dir: 1 | -1): void {
    if (this.locked) {
      return;
    }

    const element = this.trackEl();
    this.locked = true;

    element.scrollBy({
      left: dir * this.step(),
      behavior: 'smooth',
    });

    this.waitForScrollEnd(() => {
      this.normalizeLoopPosition();
      this.locked = false;
    });
  }

  private waitForScrollEnd(
    done: () => void,
  ): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      done();
      return;
    }

    const element = this.trackEl();

    if (this.settleTimer !== null) {
      browserWindow.clearTimeout(this.settleTimer);
    }

    this.lastLeft = element.scrollLeft;

    const check = (): void => {
      const currentLeft = element.scrollLeft;

      if (
        Math.abs(currentLeft - this.lastLeft) > 0.5
      ) {
        this.lastLeft = currentLeft;
        this.settleTimer =
          browserWindow.setTimeout(check, 80);
        return;
      }

      done();
    };

    this.settleTimer =
      browserWindow.setTimeout(check, 120);
  }

  private normalizeLoopPosition(): void {
    const element = this.trackEl();
    const width = this.oneBlockWidth();

    if (width <= 0) {
      return;
    }

    let x = element.scrollLeft % width;

    if (x < 0) {
      x += width;
    }

    element.scrollLeft = x + width;
  }

  openLightbox(loopIndex: number): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      return;
    }

    const length = this.ourPhotos.length;

    this.lightboxIndex =
      ((loopIndex % length) + length) % length;

    this.lightboxOpen = true;
    this.scrollY = browserWindow.scrollY;

    this.document.body.style.position = 'fixed';
    this.document.body.style.top =
      `-${this.scrollY}px`;
    this.document.body.style.left = '0';
    this.document.body.style.right = '0';
    this.document.body.style.width = '100%';
  }

  closeLightbox(): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      return;
    }

    this.lightboxOpen = false;

    this.document.body.style.position = '';
    this.document.body.style.top = '';
    this.document.body.style.left = '';
    this.document.body.style.right = '';
    this.document.body.style.width = '';

    browserWindow.scrollTo(0, this.scrollY);
  }

  lightboxNext(): void {
    this.lightboxIndex =
      (this.lightboxIndex + 1) %
      this.ourPhotos.length;
  }

  lightboxPrev(): void {
    this.lightboxIndex =
      (this.lightboxIndex - 1 +
        this.ourPhotos.length) %
      this.ourPhotos.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) {
      return;
    }

    if (e.key === 'Escape') {
      this.closeLightbox();
    }

    if (e.key === 'ArrowRight') {
      this.lightboxNext();
    }

    if (e.key === 'ArrowLeft') {
      this.lightboxPrev();
    }
  }
}

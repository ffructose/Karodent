import { ChangeDetectorRef, Component, NgZone, ElementRef, ViewChild, HostListener, QueryList, ViewChildren } from '@angular/core';

type CardState = 'left' | 'active' | 'right' | 'hidden';


@Component({
  selector: 'app-aboutus',
  standalone: false,
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus {
  scrollToFooter() {
    const footer = document.getElementById('page-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  //----------------------------


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
  //----------------------------

  // ===== SINGLE "OUR PHOTOS" CAROUSEL =====
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  ourPhotos = [
    '/assets/photos/photo_1.jpg',
    '/assets/photos/photo_2.jpg',
    '/assets/photos/photo_3.jpg',
    '/assets/photos/photo_4.jpg',
    '/assets/photos/photo_5.jpg',
  ];

  loopPhotos: string[] = [];

  locked = false;
  settleTimer: any = null;
  lastLeft = 0;

  // ===== LIGHTBOX (для single каруселі) =====
  lightboxOpen = false;
  lightboxIndex = 0;
  private scrollY = 0;

  get lightboxSrc(): string {
    return this.ourPhotos[this.lightboxIndex];
  }

  ngOnInit(): void {
    // loop = photos*3
    this.loopPhotos = [...this.ourPhotos, ...this.ourPhotos, ...this.ourPhotos];
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.jumpToMiddle(), 0);
  }

  private trackEl(): HTMLDivElement {
    return this.track.nativeElement;
  }

  private firstCardEl(): HTMLElement | null {
    return this.trackEl().querySelector<HTMLElement>('.card');
  }

  private cardsEl(): HTMLElement | null {
    return this.trackEl().querySelector<HTMLElement>('.cards');
  }

  private step(): number {
    const card = this.firstCardEl();
    if (!card) return 320;

    const cards = this.cardsEl();
    const styles = cards ? getComputedStyle(cards) : null;
    const gapStr = styles?.gap || styles?.columnGap || '0';
    const gap = parseFloat(gapStr) || 0;

    return card.offsetWidth + gap;
  }

  private oneBlockWidth(): number {
    return this.ourPhotos.length * this.step();
  }

  private jumpToMiddle(): void {
    this.trackEl().scrollLeft = this.oneBlockWidth();
  }

  next(): void { this.scrollDir(+1); }
  prev(): void { this.scrollDir(-1); }

  private scrollDir(dir: 1 | -1): void {
    if (this.locked) return;

    const el = this.trackEl();
    this.locked = true;

    el.scrollBy({ left: dir * this.step(), behavior: 'smooth' });

    this.waitForScrollEnd(() => {
      this.normalizeLoopPosition();
      this.locked = false;
    });
  }

  private waitForScrollEnd(done: () => void): void {
    const el = this.trackEl();

    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.lastLeft = el.scrollLeft;

    const check = () => {
      const now = el.scrollLeft;
      if (Math.abs(now - this.lastLeft) > 0.5) {
        this.lastLeft = now;
        this.settleTimer = setTimeout(check, 80);
        return;
      }
      done();
    };

    this.settleTimer = setTimeout(check, 120);
  }

  private normalizeLoopPosition(): void {
    const el = this.trackEl();
    const w = this.oneBlockWidth();
    if (w <= 0) return;

    let x = el.scrollLeft % w;
    if (x < 0) x += w;

    el.scrollLeft = x + w; // тримаємо в середньому блоці
  }

  // ===== LIGHTBOX =====
  openLightbox(loopIndex: number): void {
    const len = this.ourPhotos.length;

    this.lightboxIndex = ((loopIndex % len) + len) % len;
    this.lightboxOpen = true;

    // lock scroll (без стрибків)
    this.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';

    window.scrollTo(0, this.scrollY);
  }

  lightboxNext(): void {
    this.lightboxIndex = (this.lightboxIndex + 1) % this.ourPhotos.length;
  }

  lightboxPrev(): void {
    this.lightboxIndex = (this.lightboxIndex - 1 + this.ourPhotos.length) % this.ourPhotos.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowRight') this.lightboxNext();
    if (e.key === 'ArrowLeft') this.lightboxPrev();
  }

}

import { ChangeDetectorRef, Component, NgZone, ElementRef, ViewChild, HostListener, QueryList, ViewChildren } from '@angular/core';

type CardState = 'left' | 'active' | 'right' | 'hidden';

@Component({
  selector: 'app-doctors',
  standalone: false,
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors {
  // SCROLLBAR
  scrollToFooter() {
    const footer = document.getElementById('page-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  @ViewChildren('track') tracks!: QueryList<ElementRef<HTMLDivElement>>;

  doctors = [
    {
      name: 'Rafal Sulej',
      photo: '/assets/photos/Rafal.png',
      textKey: 'DOCTORS_PAGE.DOCTOR_1.TEXT',

      photos: [
        '/assets/photos/photo_1.jpg',
        '/assets/photos/photo_2.jpg',
        '/assets/photos/photo_3.jpg',
        '/assets/photos/photo_4.jpg',
        '/assets/photos/photo_5.jpg',
      ],
      loopPhotos: [] as string[],
      locked: false,
      settleTimer: null as any,
      lastLeft: 0,
    },
    {
      name: 'Robert Sulej',
      photo: '/assets/photos/Rafal.png',
      textKey: 'DOCTORS_PAGE.DOCTOR_2.TEXT',
      photos: [
        '/assets/photos/photo_1.jpg',
        '/assets/photos/photo_2.jpg',
        '/assets/photos/photo_3.jpg',
        '/assets/photos/photo_4.jpg',
        '/assets/photos/photo_5.jpg',
      ],
      loopPhotos: [] as string[],
      locked: false,
      settleTimer: null as any,
      lastLeft: 0,
    },
  ];

  // ===== LIGHTBOX (спільний для всіх) =====
  lightboxOpen = false;
  lightboxIndex = 0;
  lightboxDoctorIndex = 0;

  private scrollY = 0;

  get lightboxSrc(): string {
    return this.doctors[this.lightboxDoctorIndex].photos[this.lightboxIndex];
  }

  ngOnInit(): void {
    // loop = photos*3 для кожного лікаря
    for (const d of this.doctors) {
      d.loopPhotos = [...d.photos, ...d.photos, ...d.photos];
    }
  }

  ngAfterViewInit(): void {
    // після рендера — стрибаємо в середину для КОЖНОЇ каруселі
    setTimeout(() => {
      this.tracks.forEach((t, i) => this.jumpToMiddle(i));
    }, 0);
  }

  // ===== helpers per carousel =====
  private trackEl(i: number): HTMLDivElement {
    return this.tracks.toArray()[i].nativeElement;
  }

  private firstCardEl(i: number): HTMLElement | null {
    return this.trackEl(i).querySelector<HTMLElement>('.card');
  }

  private cardsEl(i: number): HTMLElement | null {
    return this.trackEl(i).querySelector<HTMLElement>('.cards');
  }

  private step(i: number): number {
    const card = this.firstCardEl(i);
    if (!card) return 320;

    const cards = this.cardsEl(i);
    const styles = cards ? getComputedStyle(cards) : null;
    const gapStr = styles?.gap || styles?.columnGap || '0';
    const gap = parseFloat(gapStr) || 0;

    return card.offsetWidth + gap;
  }

  private oneBlockWidth(i: number): number {
    return this.doctors[i].photos.length * this.step(i);
  }

  private jumpToMiddle(i: number): void {
    const el = this.trackEl(i);
    el.scrollLeft = this.oneBlockWidth(i);
  }

  next(i: number): void { this.scrollDir(i, +1); }
  prev(i: number): void { this.scrollDir(i, -1); }

  private scrollDir(i: number, dir: 1 | -1): void {
    const d = this.doctors[i];
    if (d.locked) return;

    const el = this.trackEl(i);
    d.locked = true;

    el.scrollBy({ left: dir * this.step(i), behavior: 'smooth' });

    this.waitForScrollEnd(i, () => {
      this.normalizeLoopPosition(i);
      d.locked = false;
    });
  }

  private waitForScrollEnd(i: number, done: () => void): void {
    const d = this.doctors[i];
    const el = this.trackEl(i);

    if (d.settleTimer) clearTimeout(d.settleTimer);
    d.lastLeft = el.scrollLeft;

    const check = () => {
      const now = el.scrollLeft;
      if (Math.abs(now - d.lastLeft) > 0.5) {
        d.lastLeft = now;
        d.settleTimer = setTimeout(check, 80);
        return;
      }
      done();
    };

    d.settleTimer = setTimeout(check, 120);
  }

  private normalizeLoopPosition(i: number): void {
    const el = this.trackEl(i);
    const w = this.oneBlockWidth(i);
    if (w <= 0) return;

    let x = el.scrollLeft % w;
    if (x < 0) x += w;

    el.scrollLeft = x + w; // тримаємо в середньому блоці
  }

  // ===== LIGHTBOX =====
  openLightbox(doctorIndex: number, loopIndex: number): void {
    const photosLen = this.doctors[doctorIndex].photos.length;

    this.lightboxDoctorIndex = doctorIndex;
    this.lightboxIndex = ((loopIndex % photosLen) + photosLen) % photosLen;
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
    const len = this.doctors[this.lightboxDoctorIndex].photos.length;
    this.lightboxIndex = (this.lightboxIndex + 1) % len;
  }

  lightboxPrev(): void {
    const len = this.doctors[this.lightboxDoctorIndex].photos.length;
    this.lightboxIndex = (this.lightboxIndex - 1 + len) % len;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowRight') this.lightboxNext();
    if (e.key === 'ArrowLeft') this.lightboxPrev();
  }
}

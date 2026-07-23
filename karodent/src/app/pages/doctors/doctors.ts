import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';

@Component({
  selector: 'app-doctors',
  standalone: false,
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors implements OnDestroy {
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

  @ViewChildren('track')
  tracks!: QueryList<ElementRef<HTMLDivElement>>;

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
      settleTimer: null as number | null,
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
      settleTimer: null as number | null,
      lastLeft: 0,
    },
  ];

  lightboxOpen = false;
  lightboxIndex = 0;
  lightboxDoctorIndex = 0;

  private scrollY = 0;

  get lightboxSrc(): string {
    return this.doctors[
      this.lightboxDoctorIndex
    ].photos[this.lightboxIndex];
  }

  ngOnInit(): void {
    for (const doctor of this.doctors) {
      doctor.loopPhotos = [
        ...doctor.photos,
        ...doctor.photos,
        ...doctor.photos,
      ];
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.document.defaultView?.requestAnimationFrame(() => {
      this.tracks.forEach((_, index) => {
        this.jumpToMiddle(index);
      });
    });
  }

  ngOnDestroy(): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      return;
    }

    for (const doctor of this.doctors) {
      if (doctor.settleTimer !== null) {
        browserWindow.clearTimeout(
          doctor.settleTimer,
        );
      }
    }
  }

  private trackEl(index: number): HTMLDivElement {
    return this.tracks.toArray()[index].nativeElement;
  }

  private firstCardEl(
    index: number,
  ): HTMLElement | null {
    return this.trackEl(index)
      .querySelector<HTMLElement>('.card');
  }

  private cardsEl(
    index: number,
  ): HTMLElement | null {
    return this.trackEl(index)
      .querySelector<HTMLElement>('.cards');
  }

  private step(index: number): number {
    const card = this.firstCardEl(index);

    if (!card) {
      return 320;
    }

    const cards = this.cardsEl(index);
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

  private oneBlockWidth(index: number): number {
    return (
      this.doctors[index].photos.length *
      this.step(index)
    );
  }

  private jumpToMiddle(index: number): void {
    const element = this.trackEl(index);
    element.scrollLeft =
      this.oneBlockWidth(index);
  }

  next(index: number): void {
    this.scrollDir(index, 1);
  }

  prev(index: number): void {
    this.scrollDir(index, -1);
  }

  private scrollDir(
    index: number,
    direction: 1 | -1,
  ): void {
    const doctor = this.doctors[index];

    if (doctor.locked) {
      return;
    }

    const element = this.trackEl(index);
    doctor.locked = true;

    element.scrollBy({
      left: direction * this.step(index),
      behavior: 'smooth',
    });

    this.waitForScrollEnd(index, () => {
      this.normalizeLoopPosition(index);
      doctor.locked = false;
    });
  }

  private waitForScrollEnd(
    index: number,
    done: () => void,
  ): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      done();
      return;
    }

    const doctor = this.doctors[index];
    const element = this.trackEl(index);

    if (doctor.settleTimer !== null) {
      browserWindow.clearTimeout(
        doctor.settleTimer,
      );
    }

    doctor.lastLeft = element.scrollLeft;

    const check = (): void => {
      const currentLeft = element.scrollLeft;

      if (
        Math.abs(
          currentLeft - doctor.lastLeft,
        ) > 0.5
      ) {
        doctor.lastLeft = currentLeft;
        doctor.settleTimer =
          browserWindow.setTimeout(check, 80);
        return;
      }

      done();
    };

    doctor.settleTimer =
      browserWindow.setTimeout(check, 120);
  }

  private normalizeLoopPosition(
    index: number,
  ): void {
    const element = this.trackEl(index);
    const width = this.oneBlockWidth(index);

    if (width <= 0) {
      return;
    }

    let x = element.scrollLeft % width;

    if (x < 0) {
      x += width;
    }

    element.scrollLeft = x + width;
  }

  openLightbox(
    doctorIndex: number,
    loopIndex: number,
  ): void {
    const browserWindow = this.document.defaultView;

    if (!browserWindow) {
      return;
    }

    const photosLength =
      this.doctors[doctorIndex].photos.length;

    this.lightboxDoctorIndex = doctorIndex;
    this.lightboxIndex =
      ((loopIndex % photosLength) +
        photosLength) %
      photosLength;

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
    const length =
      this.doctors[
        this.lightboxDoctorIndex
      ].photos.length;

    this.lightboxIndex =
      (this.lightboxIndex + 1) % length;
  }

  lightboxPrev(): void {
    const length =
      this.doctors[
        this.lightboxDoctorIndex
      ].photos.length;

    this.lightboxIndex =
      (this.lightboxIndex - 1 + length) %
      length;
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

import {
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';

type FooterVariant = 'default' | 'contacts';

type FormStatus =
  | 'idle'
  | 'sending'
  | 'success'
  | 'error';

interface ContactResponse {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnDestroy {
  @Input() variant: FooterVariant = 'default';

  showGoTop = false;

  formStatus: FormStatus = 'idle';
  formMessageKey = '';

  private readonly isBrowser: boolean;

  private sendingTimerId:
    ReturnType<typeof setTimeout> | null = null;

  private resetTimerId:
    ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly http: HttpClient,
    @Inject(DOCUMENT)
    private readonly document: Document,
    @Inject(PLATFORM_ID)
    platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get isFormLocked(): boolean {
    return (
      this.formStatus === 'sending' ||
      this.formStatus === 'success'
    );
  }

  get submitButtonKey(): string {
    switch (this.formStatus) {
      case 'sending':
        return 'FORM_STATUS.SENDING';

      case 'success':
        return 'FORM_STATUS.SUCCESS_BUTTON';

      case 'error':
        return 'FORM_STATUS.RETRY';

      default:
        return 'FOOTER.SUBMIT';
    }
  }

  submitForm(event: SubmitEvent): void {
    event.preventDefault();

    if (this.isFormLocked) {
      return;
    }

    this.clearTimers();

    const form =
      event.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const payload = {
      name: String(
        formData.get('name') ?? '',
      ).trim(),

      phone: String(
        formData.get('phone') ?? '',
      ).trim(),

      email: String(
        formData.get('email') ?? '',
      ).trim(),

      question: String(
        formData.get('question') ?? '',
      ).trim(),

      website: String(
        formData.get('website') ?? '',
      ).trim(),

      source: 'footer',
    };

    this.formStatus = 'sending';
    this.formMessageKey = '';

    const sendingStartedAt = Date.now();

    this.http
      .post<ContactResponse>(
        '/api/contact',
        payload,
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.showError();
            return;
          }

          const elapsed = Date.now() - sendingStartedAt;
          const remainingSendingTime = Math.max(0, 1500 - elapsed);

          this.sendingTimerId = setTimeout(() => {
            form.reset();

            this.formStatus = 'success';
            this.formMessageKey =
              'FORM_STATUS.SUCCESS_MESSAGE';
            this.sendingTimerId = null;

            this.resetTimerId = setTimeout(() => {
              this.formStatus = 'idle';
              this.formMessageKey = '';
              this.resetTimerId = null;
            }, 2000);
          }, remainingSendingTime);
        },

        error: () => {
          this.showError();
        },
      });
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private showError(): void {
    this.formStatus = 'error';
    this.formMessageKey =
      'FORM_STATUS.ERROR_MESSAGE';
  }

  private clearTimers(): void {
    if (this.sendingTimerId !== null) {
      clearTimeout(this.sendingTimerId);
      this.sendingTimerId = null;
    }

    if (this.resetTimerId !== null) {
      clearTimeout(this.resetTimerId);
      this.resetTimerId = null;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    const browserWindow =
      this.document.defaultView;

    if (!browserWindow) {
      return;
    }

    const scrollTop =
      browserWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;

    this.showGoTop = scrollTop > 300;
  }

  scrollToTop(): void {
    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
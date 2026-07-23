import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnDestroy {
  formStatus: FormStatus = 'idle';
  formMessageKey = '';

  private sendingTimerId:
    ReturnType<typeof setTimeout> | null = null;

  private resetTimerId:
    ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

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
        return 'CONTACT_PAGE.SUBMIT';
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

      source: 'contacts',
    };

    this.formStatus = 'sending';
    this.formMessageKey = '';
    this.changeDetectorRef.detectChanges();

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

          const elapsed =
            Date.now() - sendingStartedAt;

          const remainingSendingTime =
            Math.max(0, 1500 - elapsed);

          this.sendingTimerId = setTimeout(() => {
            form.reset();

            this.formStatus = 'success';
            this.formMessageKey =
              'FORM_STATUS.SUCCESS_MESSAGE';

            this.sendingTimerId = null;
            this.changeDetectorRef.detectChanges();

            this.resetTimerId = setTimeout(() => {
              this.formStatus = 'idle';
              this.formMessageKey = '';
              this.resetTimerId = null;

              this.changeDetectorRef.detectChanges();
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

    this.changeDetectorRef.detectChanges();

    this.resetTimerId = setTimeout(() => {
      this.formStatus = 'idle';
      this.formMessageKey = '';
      this.resetTimerId = null;

      this.changeDetectorRef.detectChanges();
    }, 3000);
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
}
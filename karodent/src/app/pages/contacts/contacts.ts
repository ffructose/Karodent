import {
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

  private resetTimerId:
    ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly http: HttpClient,
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

    this.clearResetTimer();

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

          form.reset();

          this.formStatus = 'success';
          this.formMessageKey =
            'FORM_STATUS.SUCCESS_MESSAGE';

          this.resetTimerId = setTimeout(() => {
            this.formStatus = 'idle';
            this.formMessageKey = '';
            this.resetTimerId = null;
          }, 3000);
        },

        error: () => {
          this.showError();
        },
      });
  }

  ngOnDestroy(): void {
    this.clearResetTimer();
  }

  private showError(): void {
    this.formStatus = 'error';
    this.formMessageKey =
      'FORM_STATUS.ERROR_MESSAGE';
  }

  private clearResetTimer(): void {
    if (this.resetTimerId !== null) {
      clearTimeout(this.resetTimerId);
      this.resetTimerId = null;
    }
  }
}

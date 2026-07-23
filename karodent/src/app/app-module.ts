import {
  NgModule,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

import {
  provideTranslateService,
  TranslatePipe,
} from '@ngx-translate/core';
import {
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Footer } from './layout/footer/footer';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { Doctors } from './pages/doctors/doctors';
import { Aboutus } from './pages/aboutus/aboutus';
import { Results } from './pages/results/results';
import { Prices } from './pages/prices/prices';
import { Contacts } from './pages/contacts/contacts';
import { Header } from './layout/header/header';

@NgModule({
  declarations: [
    App,
    Footer,
    Home,
    Services,
    Doctors,
    Aboutus,
    Results,
    Prices,
    Contacts,
    Header,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslatePipe,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
        failOnError: true,
      }),
      fallbackLang: 'pl',
      lang: 'pl',
    }),

    provideClientHydration(
      withEventReplay(),
    ),
  ],
  bootstrap: [App],
})
export class AppModule { }

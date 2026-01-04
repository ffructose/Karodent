import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
    Header
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }

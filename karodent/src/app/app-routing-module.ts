import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { Doctors } from './pages/doctors/doctors';
import { Aboutus } from './pages/aboutus/aboutus';
import { Results } from './pages/results/results';
import { Prices } from './pages/prices/prices';
import { Contacts } from './pages/contacts/contacts';

const routes: Routes = [
  { path: '', component: Home },

  { path: 'services', component: Services },
  { path: 'doctors', component: Doctors },
  { path: 'about-us', component: Aboutus },
  { path: 'results', component: Results },
  { path: 'prices', component: Prices },
  { path: 'contacts', component: Contacts },

  { path: '**', redirectTo: '' }, // fallback
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

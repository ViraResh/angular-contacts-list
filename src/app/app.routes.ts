import { Routes } from '@angular/router';

import { ContactsListComponent } from './components/contacts-list/contacts-list.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';

export const routes: Routes = [
  { path: '', component: ContactsListComponent },
  { path: 'contacts', component: ContactsListComponent },
  { path: 'contacts/:id', component: ContactDetailsComponent },
];

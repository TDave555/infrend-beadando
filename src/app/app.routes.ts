import { Routes } from '@angular/router';
import { ApartmentListComponent } from './components/apartment-list/apartment-list.component';
import { ApartmentCreateComponent } from './components/apartment-create/apartment-create.component';
import { ApartmentDetailsComponent } from './components/apartment-details/apartment-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/apartments', pathMatch: 'full' },
  { path: 'apartments', component: ApartmentListComponent },
  { path: 'apartments/create', component: ApartmentCreateComponent },
  { path: 'apartments/:id', component: ApartmentDetailsComponent },

];

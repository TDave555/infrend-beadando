import { Routes } from '@angular/router';
import { ApartmentListComponent } from './components/apartment-list/apartment-list.component';
import { ApartmentCreateComponent } from './components/apartment-create/apartment-create.component';
import { ApartmentDetailsComponent } from './components/apartment-details/apartment-details.component';
import { Resident } from '../../backend/src/entity/Resident';
import { ResidentListComponent } from './components/resident-list/resident-list.component';
import { ApartmentMoveComponent } from './components/apartment-move/apartment-move.component';
import { ResidentDetailsComponent } from './components/resident-details/resident-details.component';
import { PaymentCreateComponent } from './components/payment-create/payment-create.component';
import { CostCrateComponent } from './components/cost-crate/cost-crate.component';

export const routes: Routes = [
  //{ path: '', redirectTo: '/apartments', pathMatch: 'full' },
  { path: 'apartments', component: ApartmentListComponent },
  { path: 'apartments/create', component: ApartmentCreateComponent },
  { path: 'apartments/:id', component: ApartmentDetailsComponent },

  { path: 'residents', component: ResidentListComponent },
  { path: 'residents/:id', component: ResidentDetailsComponent },

  { path: 'move' , component: ApartmentMoveComponent },

  { path: 'transactions/payment', component: PaymentCreateComponent },
  { path: 'transactions/cost', component: CostCrateComponent },

  //{ path: '**', redirectTo: '/apartments'},


];

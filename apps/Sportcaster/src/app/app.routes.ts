import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailsComponent } from '../../../../libs/frontend/features/src/lib/users/user-details/user-details.component';
import { UserEditComponent } from '../../../../libs/frontend/features/src/lib/users/user-edit/user-edit.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'user/details', component: UserDetailsComponent },
    { path: 'user/:id/edit', component: UserEditComponent },


    { path: '**', redirectTo: 'dashboard' }

];

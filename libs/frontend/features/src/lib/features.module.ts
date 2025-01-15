import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './users/user.service';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './auth/auth.service';
import { UserPreferencesComponent } from './users/user-preferences/user-preferences.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule
    ],
    declarations: [
        UserDetailsComponent,
        UserListComponent,
        UserEditComponent,
        UserPreferencesComponent
    ],
    providers: [
        UserService,
        AuthService,
    ],
    exports: [
        FormsModule,  // Voeg FormsModule toe
        ReactiveFormsModule // Voeg ReactiveFormsModule toe
    ],
})
export class FeaturesModule {}





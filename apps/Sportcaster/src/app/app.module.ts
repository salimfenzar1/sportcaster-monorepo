import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { appRoutes } from './app.routes';
import { HeaderComponent } from './components/header/header.component';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from '@libs/frontend/features/src/lib/auth/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking'
  }),

    RegisterComponent,
    LoginComponent
  ],
  providers: [
    provideHttpClient(), 
    AuthService
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

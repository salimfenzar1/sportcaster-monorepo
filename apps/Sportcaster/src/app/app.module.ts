import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { appRoutes } from './app.routes';
import { HeaderComponent } from './components/header/header.component';

// ✅ Standalone componenten moeten alleen in `imports[]` staan, NIET in `declarations[]`
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
    RouterModule.forRoot(appRoutes),

    // ✅ Standalone componenten importeren HIER
    RegisterComponent,
    LoginComponent
  ],
  providers: [
    provideHttpClient(), 
    AuthService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

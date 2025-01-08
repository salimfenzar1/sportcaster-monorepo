import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@libs/frontend/features/src/lib/auth/auth.service';
import { IUserIdentity, IUserRegistration } from '@libs/shared/api/src';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true, // ✅ Zorg ervoor dat dit aanwezig is
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule] // ✅ Nodige modules importeren
})
export class RegisterComponent {
  registrationData: IUserRegistration = {
    name: '',
    emailAddress: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.authService.register(this.registrationData).subscribe({
        next: (response: any) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
        },
        error: (err) => {
            console.error('Registration error occurred:', err);

            if (err.error?.errors) {
                this.errorMessage = err.error.errors
                    .map((e: any) => `${e.field}: ${e.message}`)
                    .join(', ');
            } else {
                this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
            }
        }
    });
}
}


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@libs/frontend/features/src/lib/auth/auth.service';
import { IUserRegistration } from '@libs/shared/api/src';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  registrationData: IUserRegistration = {
    name: '',
    emailAddress: '',
    password: ''
  };

  confirmPassword: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  passwordsMatch(): boolean {
    return this.registrationData.password === this.confirmPassword;
  }

  register(): void {
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register(this.registrationData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
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

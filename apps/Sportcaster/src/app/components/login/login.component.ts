import { Component } from '@angular/core';
import { AuthService } from '../../../../../../libs/frontend/features/src/lib/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUserIdentity, IUserCredentials } from '@libs/shared/api/src';

@Component({
    standalone: true, // ✅ Zorg ervoor dat dit aanwezig is
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [CommonModule, FormsModule] // ✅ Nodige modules importeren
  })

export class LoginComponent {
    credentials: IUserCredentials = { emailAddress: '', password: '' };
    errorMessage: string | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    login(): void {
        console.log('logging in')
        this.authService.login(this.credentials).subscribe({
            next: (response: IUserIdentity) => {
                console.log('Login response:', response);
                if (localStorage.getItem('token')) {
                    localStorage.removeItem('token');
                }
                
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/']);
                } else {
                    this.errorMessage = 'Login failed. Please try again.';
                }
            },
            error: (err) => {
                this.errorMessage = 'Invalid email or password';
                console.error('Login error', err);
            },
        });
        
    }
    

    navigateToRegister(): void {
        this.router.navigate(['/register']);
      }
      
    
}

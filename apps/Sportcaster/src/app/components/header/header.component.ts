import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@libs/frontend/features/src/lib/auth/auth.service';

@Component({
  standalone: false, // ✅ Zorg ervoor dat dit aanwezig is
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Controleer of de gebruiker is ingelogd
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Controleer of een token in localStorage is opgeslagen
  }

  // Uitloggen
  logout(): void {
    localStorage.removeItem('token'); // Verwijder het token
    this.router.navigate(['/login']); // Redirect naar de loginpagina
  }
}
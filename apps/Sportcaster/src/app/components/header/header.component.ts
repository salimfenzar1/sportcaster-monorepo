import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@libs/frontend/features/src/lib/auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: false, // ✅ Zorg ervoor dat dit aanwezig is
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.setUsernameFromToken();
  }

  // Controleer of de gebruiker is ingelogd
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Controleer of een token in localStorage is opgeslagen
  }

  private setUsernameFromToken(): void {
    const token = localStorage.getItem('token');
    console.log('my token: ' + token)
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodeer het JWT-token
        console.log('naam: ' + decodedToken.emailAddress)
        this.username = decodedToken.name || null; // Haal de naam uit de payload
      } catch (error) {
        console.error('Invalid token format', error);
        this.username = null;
      }
    }
  }

  // Uitloggen
  logout(): void {
    localStorage.removeItem('token'); // Verwijder het token
    this.username = null; // Reset de gebruikersnaam
    this.router.navigate(['/login']); // Redirect naar de loginpagina
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@libs/frontend/features/src/lib/auth/auth.service';

@Component({
  standalone:false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Abonneer op de user$ Observable om gebruikersnaam bij te werken
    this.authService.user$.subscribe((name) => {
      this.username = name;
    });

    // Initialiseer gebruikersinformatie bij componentopstart
    this.authService.initializeUser();
  }

  // Controleer of de gebruiker is ingelogd
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Uitloggen
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

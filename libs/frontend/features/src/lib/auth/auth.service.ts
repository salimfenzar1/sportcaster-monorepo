import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUserIdentity, IUserCredentials } from '@libs/shared/api/src';
import { environment } from '@libs/shared/util-env/src';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.dataApiUrl}/auth`;

  private userSubject = new BehaviorSubject<string | null>(null);
  public user$ = this.userSubject.asObservable(); // Observable om te abonneren op gebruikersinformatie

  constructor(private http: HttpClient) {}

  // Login-methode
  login(credentials: IUserCredentials): Observable<IUserIdentity> {
    return this.http.post<IUserIdentity>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: IUserIdentity) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Token opslaan in localStorage
          const decodedToken: any = jwtDecode(response.token); // Decodeer het JWT-token
          this.userSubject.next(decodedToken.name); // Update de BehaviorSubject met de gebruikersnaam
        }
      })
    );
  }

  register(user: IUserCredentials): Observable<IUserIdentity> {
    return this.http.post<IUserIdentity>(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token'); // Verwijder token uit localStorage
    this.userSubject.next(null); // Reset de BehaviorSubject
  }

  initializeUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodeer token
        this.userSubject.next(decodedToken.name); // Update de BehaviorSubject
      } catch {
        this.userSubject.next(null);
      }
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Huidige tijd in seconden
      return decodedToken.exp > currentTime; // Controleer of token niet verlopen is
    } catch {
      return false;
    }
  }
}

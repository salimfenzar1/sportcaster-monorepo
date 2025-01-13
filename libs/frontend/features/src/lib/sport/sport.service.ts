import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ISport } from '../../../../../shared/api/src'; 
import { environment } from '@libs/shared/util-env/src';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private apiUrl = `${environment.dataApiUrl}/sports`; // Backend API URL

  private sportsSubject = new BehaviorSubject<ISport[] | null>(null); // Houdt een lijst van sporten bij
  public sports$ = this.sportsSubject.asObservable(); // Observable om te abonneren op sportgegevens

  constructor(private http: HttpClient) {}

  /**
   * Haal alle sporten op van de backend
   */
  findAll(): Observable<ISport[]> {
    return this.http.get<ISport[]>(this.apiUrl).pipe(
      tap((sports: ISport[]) => {
        this.sportsSubject.next(sports); // Werk de BehaviorSubject bij met de nieuwe sportenlijst
      })
    );
  }

  /**
   * Haal één sport op aan de hand van het ID
   * @param id Het ID van de sport
   */
  findOne(id: string): Observable<ISport> {
    return this.http.get<ISport>(`${this.apiUrl}/${id}`);
  }

  /**
   * Voeg een nieuwe sport toe
   * @param sport De gegevens van de sport
   */
  create(sport: ISport): Observable<ISport> {
    return this.http.post<ISport>(this.apiUrl, sport).pipe(
      tap((newSport: ISport) => {
        const currentSports = this.sportsSubject.getValue() || [];
        this.sportsSubject.next([...currentSports, newSport]); // Voeg de nieuwe sport toe aan de BehaviorSubject
      })
    );
  }


}

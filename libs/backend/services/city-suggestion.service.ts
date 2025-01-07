import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitySuggestionService {
  private apiKey = 'c77e12bee0954e1aa7516dde68aa7914'; 
  private apiUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';

  constructor(private http: HttpClient) {}

  getCitySuggestions(query: string): Observable<{ name: string; country: string }[]> {
    const url = `${this.apiUrl}?text=${query}&type=city&format=json&apiKey=${this.apiKey}`;

    return this.http.get<{ results: any[] }>(url).pipe(
      map((response) => {
        console.log('Geoapify API Response:', response); 

        if (!response || !Array.isArray(response.results)) { 
          console.error('Fout: Geen resultaten gevonden in API response.', response);
          return []; 
        }

        const uniqueCities = response.results
          .map((place: any): { name: string; country: string } => ({
            name: place.city || place.name || 'Onbekende stad',
            country: place.country || 'Onbekend land'
          }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => t.name === value.name && t.country === value.country) 
          );

        console.log('Unieke stadssuggesties:', uniqueCities); 
        return uniqueCities;
      }),
      catchError((error) => {
        console.error('Fout bij ophalen van suggesties:', error);
        return []; 
      })
    );
  }
}

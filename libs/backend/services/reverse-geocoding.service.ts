import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReverseGeocodingService {
  private readonly apiKey = '42a92a05ba44452bad1e8d7c437b4edd'; 
  private readonly apiUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private http: HttpClient) {}

  getCityFromCoordinates(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?q=${latitude}+${longitude}&key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}

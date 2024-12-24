import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'f3d9383ab566f26d2e802fb83f63346d'; // Vervang met je eigen API-sleutel
  private currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  // Huidig weer ophalen op basis van locatie
  getCurrentWeather(location: string): Observable<any> {
    return this.http.get(
      `${this.currentWeatherUrl}?q=${location}&units=metric&appid=${this.apiKey}`
    );
  }

  // Weersvoorspelling ophalen op basis van locatie
  getWeatherForecast(location: string): Observable<any> {
    return this.http.get(
      `${this.forecastUrl}?q=${location}&units=metric&appid=${this.apiKey}`
    );
  }

  // Huidig weer ophalen op basis van coördinaten
  getWeatherByCoordinates(latitude: number, longitude: number): Observable<any> {
    return this.http.get(
      `${this.currentWeatherUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`
    );
  }

  // Weersvoorspelling ophalen op basis van coördinaten
  getForecastByCoordinates(latitude: number, longitude: number): Observable<any> {
    return this.http.get(
      `${this.forecastUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`
    );
  }
}

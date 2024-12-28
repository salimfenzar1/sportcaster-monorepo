import { Injectable } from '@angular/core';
import { ReverseGeocodingService } from './reverse-geocoding.service';
import { WeatherService } from './weather.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class WeatherHelperService {
    constructor(
      private reverseGeocodingService: ReverseGeocodingService,
      private weatherService: WeatherService
    ) {}
  
    getLocationDetails(location: string): Observable<any> {
      return this.weatherService.getWeatherByCity(location);
    }
  
    getWeatherData(latitude: number, longitude: number): Observable<any> {
      return forkJoin({
        currentWeather: this.weatherService.getWeatherByCoordinates(latitude, longitude),
        forecast: this.weatherService.getForecastByCoordinates(latitude, longitude),
        location: this.reverseGeocodingService.getCityFromCoordinates(latitude, longitude),
      });
    }
  
    determineBackgroundCondition(condition: string): string {
      switch (condition.toLowerCase()) {
        case 'clear':
        case 'sunny':
          return 'sunny';
        case 'rain':
        case 'rainy':
          return 'rainy';
        case 'snow':
          return 'snowy';
        case 'clouds':
        case 'cloudy':
          return 'cloudy';
        case 'mist':
        case 'fog':
          return 'misty';
        default:
          return 'cloudy';
      }
    }
  
    getWeatherIcon(condition: string): string {
        console.log(condition)
      const icons: { [key: string]: string } = {
        Sunny: 'assets/weather-icons/sunny.png',
        Clear: 'assets/weather-icons/sunny.png',
        Rain: 'assets/weather-icons/rainy.png',
        Cloudy: 'assets/weather-icons/cloudy.png',
        Snowy: 'assets/weather-icons/snowy.png',
        Fog: 'assets/weather-icons/misty.png',
        Mist: 'assets/weather-icons/misty.png',
      };
      return icons[condition] || 'assets/weather-icons/cloudy.png';
    }
  }
  
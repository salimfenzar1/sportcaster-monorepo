import { Component } from '@angular/core';
import { WeatherHelperService } from '@libs/backend/services/weather-helper.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  currentWeather: any = null;
  weatherForecast: any = null;
  currentWeatherCondition: string = '';
  enteredLocation: string = '';

  sportsRecommendations = [
    { name: 'Cycling', duration: '30 minutes', intensity: 'Moderate', indoor: false },
    { name: 'Yoga', duration: '60 minutes', intensity: 'Low', indoor: true },
    { name: 'Running', duration: '45 minutes', intensity: 'High', indoor: false },
  ];

  constructor(public weatherHelperService: WeatherHelperService) {}

  getCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          this.updateWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to fetch your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  searchWeather(): void {
    if (!this.enteredLocation || this.enteredLocation.trim() === '') {
      alert('Voer een geldige locatie in (stad).');
      return;
    }

    const location = this.enteredLocation.trim();

    this.weatherHelperService.getLocationDetails(location).subscribe(
      (response) => {
        if (response && response.length > 0) {
          const latitude = response[0].lat;
          const longitude = response[0].lon;
          this.updateWeatherData(latitude, longitude);
        } else {
          alert('Geen locatie gevonden voor deze stad.');
        }
      },
      (error) => {
        console.error('Fout bij het ophalen van coördinaten:', error);
        alert('Er is een fout opgetreden bij het zoeken naar deze locatie.');
      }
    );
  }

  private updateWeatherData(latitude: number, longitude: number): void {
    this.weatherHelperService.getWeatherData(latitude, longitude).subscribe(
      (data) => {
        this.currentWeather = {
          temperature: `${Math.round(data.currentWeather.main.temp)}°C`,
          feelsLike: `${Math.round(data.currentWeather.main.feels_like)}°C`,
          condition: data.currentWeather.weather[0].main,
          windSpeed: `${Math.round(data.currentWeather.wind.speed * 3.6)} km/h`,
          humidity: `${data.currentWeather.main.humidity}%`,
          precipitation: data.currentWeather.rain ? `${data.currentWeather.rain['1h']} mm` : '0 mm',
          location: `${data.location.results[0].components.city || 'Unknown City'}, 
                     ${data.location.results[0].components.state || 'Unknown Province'}, 
                     ${data.location.results[0].components.country || 'Unknown Country'}`,
        };

        this.weatherForecast = data.forecast.list.slice(0, 3).map((forecast: any) => ({
          time: new Date(forecast.dt_txt).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          temperature: `${Math.round(forecast.main.temp)}°C`,
          windSpeed: `${Math.round(forecast.wind.speed * 3.6)} km/h`,
          precipitation: forecast.rain ? `${forecast.rain['3h']} mm` : '0 mm',
        }));

        this.currentWeatherCondition = this.weatherHelperService.determineBackgroundCondition(
          this.currentWeather.condition
        );
      },
      (error) => {
        console.error('Fout bij het ophalen van de weergegevens:', error);
        alert('Er is een fout opgetreden bij het ophalen van de weergegevens.');
      }
    );
  }
}

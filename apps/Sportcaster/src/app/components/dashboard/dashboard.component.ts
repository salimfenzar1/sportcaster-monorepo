import { Component } from '@angular/core';
import { ReverseGeocodingService } from '@libs/backend/services/reverse-geocoding.service';
import { WeatherService } from '@libs/backend/services/weather.service';

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
  sportsRecommendations = [
    {
      name: 'Cycling',
      duration: '30 minutes',
      intensity: 'Moderate',
      indoor: false,
    },
    {
      name: 'Yoga',
      duration: '60 minutes',
      intensity: 'Low',
      indoor: true,
    },
    {
      name: 'Running',
      duration: '45 minutes',
      intensity: 'High',
      indoor: false,
    },
  ];
  enteredLocation: string = '';

  constructor(
    private reverseGeocodingService: ReverseGeocodingService,
    private weatherService: WeatherService
  ) {}

  getCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          this.updateWeatherDataByCoordinates(latitude, longitude);
  
          // Reverse geocoding om stad, provincie en land te verkrijgen
          this.reverseGeocodingService
            .getCityFromCoordinates(latitude, longitude)
            .subscribe(
              (response) => {
                if (response.results && response.results.length > 0) {
                  const city = response.results[0].components.city || 'Unknown City';
                  const province = response.results[0].components.state_code || 'Unknown Province';
                  const country = response.results[0].components.country || 'Unknown Country';
  
                  this.currentWeather.location = `${city}, ${province}, ${country}`;
                } else {
                  console.error('Geen resultaten van OpenCage API.');
                  this.currentWeather.location = 'Unknown Location';
                }
              },
              (error) => {
                console.error('Fout bij het ophalen van de locatie:', error);
              }
            );
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
  
  updateWeatherDataByCoordinates(latitude: number, longitude: number): void {
    this.weatherService.getWeatherByCoordinates(latitude, longitude).subscribe(
      (data) => {
        this.currentWeather = {
          ...this.currentWeather,
          temperature: `${Math.round(data.main.temp)}°C`,
          feelsLike: `${Math.round(data.main.feels_like)}°C`,
          condition: data.weather[0].main,
          windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
          humidity: `${data.main.humidity}%`,
          precipitation: data.rain ? `${data.rain['1h']} mm` : '0 mm',

        };
        console.log(this.currentWeather.condition)
        this.updateBackgroundCondition(this.currentWeather.condition);
      },
      (error) => {
        console.error('Fout bij het ophalen van het weer:', error);
        alert('Er is een fout opgetreden bij het ophalen van het weer.');
      }
    );
  
    this.weatherService.getForecastByCoordinates(latitude, longitude).subscribe(
      (data) => {
        this.weatherForecast = data.list.slice(0, 3).map((forecast: any) => ({
          time: new Date(forecast.dt_txt).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          temperature: `${Math.round(forecast.main.temp)}°C`,
          condition: forecast.weather[0].main,
          precipitation: forecast.rain ? `${forecast.rain['3h']} mm` : '0 mm',
          windSpeed: `${Math.round(forecast.wind.speed * 3.6)} km/h`,
        }));
      },
      (error) => {
        console.error('Fout bij het ophalen van de weersvoorspelling:', error);
      }
    );
  }
  
  updateBackgroundCondition(condition: string): void {
    console.log(this.currentWeatherCondition)
    switch (condition) {
      case 'clear':
      case 'sunny':
        this.currentWeatherCondition = 'sunny';
        break;
      case 'rain':
      case 'rainy':
        this.currentWeatherCondition = 'rainy';
        break;
      case 'snow':
        this.currentWeatherCondition = 'snowy';
        break;
      case 'clouds':
      case 'cloudy':
        this.currentWeatherCondition = 'cloudy';
        break;
      case 'mist':
      case 'misty':
        this.currentWeatherCondition = 'misty'
        break;
      default:
        this.currentWeatherCondition = 'cloudy';

    }
  }
  getWeatherIcon(condition: string): string {
    const icons: { [key: string]: string } = {
      Sunny: 'assets/weather-icons/sunny.png',
      Rainy: 'assets/weather-icons/rainy.png',
      Cloudy: 'assets/weather-icons/cloudy.png',
      Snowy: 'assets/weather-icons/snowy.png',
      Mist: 'assets/weather-icons/misty.png',
    };
    return icons[condition] || 'assets/weather-icons/cloudy.png';
  }
}

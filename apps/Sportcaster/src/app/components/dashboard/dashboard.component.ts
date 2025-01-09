import { Component, OnInit } from '@angular/core';
import { WeatherHelperService } from '@libs/backend/services/weather-helper.service';
import { CitySuggestionService } from '@libs/backend/services/city-suggestion.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentWeather: any = null;
  weatherForecast: any = null;
  currentWeatherCondition: string = ''; // Toevoegen van currentWeatherCondition
  enteredLocation: string = '';
  isCurrentLocation: boolean = true;
  suggestedCities: any[] = [];
  sportsRecommendations: any[] = [];
  showModal: boolean = false;
  showForecast: boolean = false; 


  preferences = {
    indoor: null,
    equipment: '',
    intensity: ''
  };

  constructor(
    public weatherHelperService: WeatherHelperService,
    private citySuggestionService: CitySuggestionService
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  openPreferencesModal(): void {
    this.showModal = true;
  }

  closePreferencesModal(): void {
    this.showModal = false;
  }

  submitPreferences(): void {
    this.fetchRecommendedSports();
    this.closePreferencesModal();
  }
  toggleForecast(): void {
    this.showForecast = !this.showForecast; 
  }

  fetchRecommendedSports(): void {
    console.log('Huidige voorkeuren:', this.preferences);
  
    // Controleer of voorkeuren correct zijn ingesteld
    const indoorFilter = this.preferences.indoor !== null
      ? (sport: any) => sport.indoor === this.preferences.indoor
      : () => true;
    const equipmentFilter = this.preferences.equipment.trim() !== ''
      ? (sport: any) => sport.equipment.toLowerCase().includes(this.preferences.equipment.toLowerCase())
      : () => true;
    const intensityFilter = this.preferences.intensity.trim() !== ''
      ? (sport: any) => sport.intensity.toLowerCase() === this.preferences.intensity.toLowerCase()
      : () => true;
  
    // Data van sporten
    const sportsData = [
      { name: 'Cycling', indoor: false, equipment: 'Bicycle', intensity: 'Moderate' },
      { name: 'Yoga', indoor: true, equipment: 'Mat', intensity: 'Low' },
      { name: 'Running', indoor: false, equipment: '', intensity: 'High' },
    ];
  
    // Pas filters toe
    this.sportsRecommendations = sportsData.filter(
      (sport) => indoorFilter(sport) && equipmentFilter(sport) && intensityFilter(sport)
    );
  
    console.log('Aanbevolen sporten:', this.sportsRecommendations);
  }
  
  
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

  refreshWeather(): void {
    if (this.isCurrentLocation) {
      this.getCurrentLocation();
    } else {
      this.searchWeather();
    }
  }

  searchWeather(): void {
    if (!this.enteredLocation || this.enteredLocation.trim() === '') {
      this.getCurrentLocation();
      this.isCurrentLocation = true;
      return;
    }

    const location = this.enteredLocation.trim();
    this.isCurrentLocation = false;

    this.weatherHelperService.getLocationDetails(location).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          const latitude = response[0].lat;
          const longitude = response[0].lon;
          this.updateWeatherData(latitude, longitude);
        } else {
          alert('Geen locatie gevonden voor deze stad.');
        }
      },
      error: (error) => {
        console.error('Fout bij het ophalen van coördinaten:', error);
        alert('Er is een fout opgetreden bij het zoeken naar deze locatie.');
      },
    });
  }

  selectCity(city: any): void {
    this.enteredLocation = city.name;
    this.suggestedCities = [];
    this.searchWeather();
  }

  onCityInput(): void {
    if (this.enteredLocation.length < 2) {
      this.suggestedCities = [];
      return;
    }

    this.citySuggestionService.getCitySuggestions(this.enteredLocation).subscribe({
      next: (response) => {
        this.suggestedCities = response.map((city: any) => ({
          name: `${city.name}, ${city.country}`
        }));
      },
      error: (error) => {
        console.error('Fout bij ophalen van suggesties:', error);
      },
    });
  }

  private updateWeatherData(latitude: number, longitude: number): void {
    this.weatherHelperService.getWeatherData(latitude, longitude).subscribe({
      next: (data) => {
        const locationComponents = data.location.results[0].components;

        const cityOrVillage =
          locationComponents.city ||
          locationComponents.town ||
          locationComponents.village ||
          'Onbekende plaats';

        const country = locationComponents.country || 'Onbekend land';

        this.currentWeather = {
          temperature: `${Math.round(data.currentWeather.main.temp)}°C`,
          feelsLike: `${Math.round(data.currentWeather.main.feels_like)}°C`,
          condition: data.currentWeather.weather[0].main,
          windSpeed: `${Math.round(data.currentWeather.wind.speed * 3.6)} km/h`,
          humidity: `${data.currentWeather.main.humidity}%`,
          precipitation: data.currentWeather.rain ? `${data.currentWeather.rain['1h']} mm` : '0 mm',
          location: `${cityOrVillage}, ${country}`,
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

        // Bepaal de achtergrondconditie op basis van weer
        this.currentWeatherCondition = this.weatherHelperService.determineBackgroundCondition(
          this.currentWeather.condition
        );
      },
      error: (error) => {
        console.error('Fout bij het ophalen van de weergegevens:', error);
        alert('Er is een fout opgetreden bij het ophalen van de weergegevens.');
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { WeatherHelperService } from '@libs/backend/services/weather-helper.service';
import { CitySuggestionService } from '@libs/backend/services/city-suggestion.service';
import { SportService } from '@libs/frontend/features/src/lib/sport/sport.service'; // Import SportService
import { Equipment, ISport, SportType } from '@libs/shared/api/src/lib/models/sport.interface'; // Import Sport Interface

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentWeather: any = null;
  weatherForecast: any = null;
  currentWeatherCondition: string = '';
  enteredLocation: string = '';
  isCurrentLocation: boolean = true;
  suggestedCities: any[] = [];
  sportsRecommendations: ISport[] = [];
  showModal: boolean = false;
  showForecast: boolean = false;
  allSports: ISport[] = []; 
  sportTypes = Object.values(SportType);
  equipmentOptions = Object.values(Equipment);
  forecastBackgroundCondition: string = '';


  preferences = {
    indoor: null as boolean | null,
    equipment: [] as string[],
    intensity: '',
    type: ''
  };
  

  constructor(
    public weatherHelperService: WeatherHelperService,
    private citySuggestionService: CitySuggestionService,
    private sportService: SportService // Injecteer SportService
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
    this.loadAllSports(); // Haal sporten op bij het laden van de pagina
    this.setForecastBackgroundCondition(); // Zet de achtergrondconditie

  }
  setForecastBackgroundCondition(): void {
    if (this.weatherForecast && this.weatherForecast.length > 0) {
      const condition = this.weatherForecast[0].condition.toLowerCase();
      if (condition.includes('rain')) {
        this.forecastBackgroundCondition = 'rainy';
      } else if (condition.includes('sun')) {
        this.forecastBackgroundCondition = 'sunny';
      } else if (condition.includes('cloud')) {
        this.forecastBackgroundCondition = 'cloudy';
      } else if (condition.includes('snow')) {
        this.forecastBackgroundCondition = 'snowy';
      } else if (condition.includes('mist')) {
        this.forecastBackgroundCondition = 'misty';
      } else {
        this.forecastBackgroundCondition = 'default';
      }
    } else {
      this.forecastBackgroundCondition = 'default';
    }
  }
  loadAllSports(): void {
    this.sportService.findAll().subscribe({
      next: (sports) => {
        this.allSports = sports;
        console.log('Sporten uit de database:', this.allSports);
      },
      error: (err) => {
        console.error('Fout bij het ophalen van sporten:', err);
      },
    });
  }
  toggleEquipment(equipment: Equipment): void {
    const index = this.preferences.equipment.indexOf(equipment);
    if (index > -1) {
      this.preferences.equipment.splice(index, 1);
    } else {
      this.preferences.equipment.push(equipment);
    }
    console.log('Bijgewerkte equipment:', this.preferences.equipment);
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
    
    if (typeof this.preferences.indoor === 'string') {
      if (this.preferences.indoor === 'true') {
        this.preferences.indoor = true;
      } else if (this.preferences.indoor === 'false') {
        this.preferences.indoor = false;
      } else if (this.preferences.indoor === 'null') {
        this.preferences.indoor = null;
      }
    }
    
    
  
    // Indoor filter
    const indoorFilter = this.preferences.indoor !== null
      ? (sport: ISport) => {
          const result = sport.isIndoor === this.preferences.indoor;
          console.log(`Indoor filter - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
      : () => true;
  
    // Type filter
    const typeFilter = this.preferences.type
      ? (sport: ISport) => {
          const result = sport.type === this.preferences.type;
          console.log(`Type filter - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
      : () => true;
  
    // Equipment filter
    const equipmentFilter = this.preferences.equipment.length
      ? (sport: ISport) => {
          const sportEquipment = sport.equipment || [];
          const result = this.preferences.equipment.every((item) =>
            sportEquipment.includes(item as Equipment)
          );
          console.log(`Equipment filter - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
      : () => true;
  
    // Intensity filter
    const intensityFilter = this.preferences.intensity
      ? (sport: ISport) => {
          const result =
            sport.intensity.toLowerCase() === this.preferences.intensity.toLowerCase();
          console.log(`Intensity filter - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
      : () => true;
  
    // Weather filter
    const weatherFilter = (sport: ISport) => {
      if (this.currentWeather) {
        if (this.currentWeather.precipitation !== '0 mm') {
          const result = sport.isIndoor; // Suggest indoor sports if it rains
          console.log(`Weather filter (Rain) - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
        if (parseFloat(this.currentWeather.temperature) < 10) {
          const result = sport.isIndoor; // Suggest indoor sports if it's too cold
          console.log(`Weather filter (Cold) - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
        if (parseFloat(this.currentWeather.temperature) > 25) {
          const result = !sport.isIndoor; // Suggest outdoor sports if it's hot
          console.log(`Weather filter (Hot) - Sport: ${sport.name}, Result: ${result}`);
          return result;
        }
      }
      return true;
    };
  
    // Combine filters and apply
    this.sportsRecommendations = this.allSports.filter((sport) => {
      const passesIndoorFilter = indoorFilter(sport);
      const passesTypeFilter = typeFilter(sport);
      const passesEquipmentFilter = equipmentFilter(sport);
      const passesIntensityFilter = intensityFilter(sport);
      const passesWeatherFilter = weatherFilter(sport);
  
      const isRecommended =
        passesIndoorFilter &&
        passesTypeFilter &&
        passesEquipmentFilter &&
        passesIntensityFilter &&
        passesWeatherFilter;
  
      console.log(`
        Sport: ${sport.name}
        Indoor Filter: ${passesIndoorFilter}
        Type Filter: ${passesTypeFilter}
        Equipment Filter: ${passesEquipmentFilter}
        Intensity Filter: ${passesIntensityFilter}
        Weather Filter: ${passesWeatherFilter}
        Recommended: ${isRecommended}
      `);
  
      return isRecommended;
    });
  
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
          name: `${city.name}, ${city.country}`,
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

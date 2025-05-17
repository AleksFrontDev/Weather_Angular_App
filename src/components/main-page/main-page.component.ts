import { HttpClient} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { API_KEY } from '../../api_key';
import { CITY_ID } from '../../city-list';
import { ProcessedWeatherData, WeatherApiResponse } from './main-page.interface';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})

export class MainPageComponent implements OnInit, OnDestroy {
  public formControl: FormControl = new FormControl('');
  private apiKey = API_KEY;
  private city_id = CITY_ID;
  public weatherData: ProcessedWeatherData[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCityData()
    this.formControl = new FormControl('');
  }

  getCityData(): void {
    this.city_id.forEach((id) => {
      this.http.get<WeatherApiResponse>(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${this.apiKey}`)
        .subscribe(data => {
          const processData = this.processWeatherData(data);
          this.weatherData.push(processData)
        });
    });
  }

  processWeatherData(data: WeatherApiResponse): ProcessedWeatherData {
    return {
      cityName: data.name,
      temp: Math.round(data.main.temp - 273.15),
      weather: data.weather[0].description,
      temperature: Math.round(data.main.temp - 273.15),
      feels_like: Math.round(data.main.feels_like - 273.15),
      pressure: data.main.pressure,
      wind: data.wind.speed
    }
  }

  ngOnDestroy(): void {
  }
}

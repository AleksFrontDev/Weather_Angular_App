import { catchError, filter, from, map, mergeMap, of, Subject, takeUntil, tap } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { API_KEY } from '../../api_key';
import { CITY_ID } from '../../city-list';
import { ProcessedWeatherData, WeatherApiResponse } from './main-page.interface';
import { SearchComponent } from '../search/search/search.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrl: './styles/main-page.component.scss',
  imports: [
    SearchComponent
  ],
})

export class MainPageComponent implements OnInit, OnDestroy {
  protected apiKey = API_KEY;
  protected city_id = CITY_ID;
  protected destroy$ = new Subject<void>();
  public weatherData: ProcessedWeatherData[] = [];

  constructor(protected http: HttpClient) { }

  ngOnInit(): void {
    this.getCityData()
  }

  getCityData(): void {
    from(this.city_id).pipe(
      mergeMap(id => this.http.get<WeatherApiResponse>(
        `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${this.apiKey}`
      ).pipe(
        catchError(err => {
          console.error(`Error fetching data for city ${id}:`, err);
          return of(null);
        })
      )),
      takeUntil(this.destroy$),
      filter((data): data is WeatherApiResponse => data !== null),
      map(data => this.processWeatherData(data)),
      tap(processedData => {
        this.weatherData.push(processedData);
      })
    ).subscribe();
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
   this.destroy$.next();
   this.destroy$.complete();
  }
};

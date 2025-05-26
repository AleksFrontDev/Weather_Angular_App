import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, catchError, tap, filter } from 'rxjs/operators';
import { ProcessedWeatherData, WeatherApiResponse } from '../../main-page/main-page.interface';
import { CommonModule } from '@angular/common';
import { API_KEY } from '../../../api_key';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  protected apiKey = API_KEY;
  searchControl = new FormControl('');
  destroy$ = new Subject<void>();
  public weatherData: ProcessedWeatherData[] = [];
  public isLoading = false;
  public error = '';

  constructor(protected http: HttpClient) { }

  ngOnInit(): void {
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.error = '';
      }),
      switchMap(searchTerm => this.searchCities(searchTerm)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private searchCities(searchTerm: string | null) {
    return this.http.get<any>(
      `https://api.openweathermap.org/data/2.5/find?q=${searchTerm}&appid=${this.apiKey}`
    ).pipe(
      tap((response) => {
        this.weatherData = response.list.map((data: any) => this.processWeatherData(data));
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Error fetching search results:', err);
        this.isLoading = false;
        this.error = 'Не удалось загрузить данные';
        return of([]);
      })
    );
  }

  processWeatherData(data: any): ProcessedWeatherData {
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
}

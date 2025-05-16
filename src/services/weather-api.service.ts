import { Injectable } from '@angular/core';
import {CITY_LIST} from '../city-list'
import {API_KEY} from '../api_key'

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {
  private apiKey = API_KEY;
  private city_name = CITY_LIST;

  getWeather(): any {
      const url = `https://api.openweathermap.org/data/2.5/weather?q={this.city_name}&appid={this.apiKey}`
      console.log(url)
  }
};

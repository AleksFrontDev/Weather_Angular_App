interface WeatherInfo {
  description: string
}

export interface WeatherApiResponse {
  name: string;
  weather: WeatherInfo[];
  main: {
    feels_like: number;
    temp: number;
    pressure: number;
  };
  wind: {
    speed: number;
  }
}

export interface ProcessedWeatherData {
  cityName: string;
  temp: number;
  weather: string;
  temperature: number;
  feels_like: number;
  pressure: number;
  wind: number;
}

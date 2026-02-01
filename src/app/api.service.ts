import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrayerTimeResponse} from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api: HttpClient = inject(HttpClient);

  getPrayerTimes(city: string, date: string): Observable<PrayerTimeResponse> {
    return this.api.get<PrayerTimeResponse>(
      `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=MA&method=21&timezonestring=Africa%2FCasablanca`
    );
  }
}

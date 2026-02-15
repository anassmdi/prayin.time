import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrayerTimeResponse} from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http: HttpClient = inject(HttpClient);

  getPrayerTimes(city: string, date: string): Observable<PrayerTimeResponse> {
    return this.http.get<PrayerTimeResponse>(
      `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=MA&method=21&timezonestring=Africa%2FCasablanca`
    );
  }

  getTodayHijri(): Observable<any> {
    const date = new Date();
    const format = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    return this.http.get<any>(`https://api.aladhan.com/v1/gToH/${format}?calendarMethod=UAQ`);
  }
}

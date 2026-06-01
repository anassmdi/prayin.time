import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrayerTimeResponse } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class Api {
  http: HttpClient = inject(HttpClient);

  getPrayerTimes(city: string, date: string): Observable<PrayerTimeResponse> {
    return this.http.get<PrayerTimeResponse>(
      `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=MA&method=21&timezonestring=Africa%2FCasablanca`,
    );
  }

  getTodayHijri(date: string): Observable<any> {
    return this.http.get<any>(`https://api.aladhan.com/v1/gToH/${date}?calendarMethod=UAQ`);
  }
}

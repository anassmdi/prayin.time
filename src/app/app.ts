import {Component, HostListener, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Data, Prayer, TimeLeft, Timings} from './models';
import {ApiService} from './api.service';
import {FormsModule} from '@angular/forms';
import {CITIES, DAYS, PRAYERS} from './data';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    NgStyle
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.hidden) {
      // console.log('Tab is now inactive.');
    } else {
      // console.log('Tab is now active.');
      this.updateTime();
      this.getPrayerTimes(this.currentCity);
    }
  }

  api: ApiService = inject(ApiService);
  prayerTimes: Timings;

  days: Data[] = DAYS;
  prayers: Prayer[] = PRAYERS;
  cities: Data[] = CITIES;

  time: Date = new Date();
  timeInterval: any;
  currentCity: string = '';

  updatedPrayers: boolean = false;

  hijriDate = signal<string[]>([]);
  hijriMonth = signal<string>('');

  ngOnInit() {
    if (localStorage.getItem('city') != null) {
      this.currentCity = localStorage.getItem('city')!;
      this.getPrayerTimes(localStorage.getItem('city')!);
    }
    this.api.getTodayHijri().subscribe({
      next: value => {
        this.hijriDate.set(value['data']['hijri']['date'].split('-'));
        this.hijriMonth.set(value['data']['hijri']['month']['ar']);
      }
    });
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  /* DateTime */

  getCurrentDayName(): string {
    for (let day of this.days) {
      if (this.currentDay(day.id)) {
        return day.name!;
      }
    }
    return "";
  }

  currentDay(id: string): boolean {
    return id.toLowerCase() === this.time.toLocaleDateString("en-EN", {weekday: 'long'}).toLowerCase();
  }

  getTime(): string {
    return `${this.time.getHours().toString().padStart(2, '0')}:${this.time.getMinutes().toString().padStart(2, '0')}:${this.time.getSeconds().toString().padStart(2, '0')}`;
  }

  getDate(): string {
    return `${this.time.getDate()}-${this.time.getMonth() + 1}-${this.time.getFullYear()}`;
  }

  private updateTime() {
    this.time = new Date();
    if (this.time.getHours() === 0 && this.time.getMinutes() <= 1 && !this.updatedPrayers) {
      this.getPrayerTimes(this.currentCity);
      this.updatedPrayers = true;
    }
    if (this.time.getHours() === 0 && this.time.getMinutes() > 1 && this.updatedPrayers) {
      this.updatedPrayers = false;
    }
  }

  getHijriDate(): string {
    return `${this.hijriDate()[0]} ${this.hijriMonth()} ${this.hijriDate()[2]}`;
  }

  /* Prayer Time */

  onCityChange($event: Event) {
    const event = $event.target as HTMLInputElement;
    this.currentCity = event.value;
    localStorage.setItem('city', event.value);
    this.getPrayerTimes(this.currentCity);
  }

  getPrayerTimes(city: string) {
    if (city && city?.trim() !== '') {
      this.api.getPrayerTimes(city, this.getDate())
        ?.subscribe({
          next: (response) => {
            this.prayerTimes = response?.data?.timings;
            this.updatePrayerTime();
          }
        });
    }
  }

  private updatePrayerTime() {
    this.prayers.forEach((prayer) => {
      switch (prayer.id) {
        case 'Fajr':
          prayer.time = this.prayerTimes?.Fajr;
          break;
        case 'Sunrise':
          prayer.time = this.prayerTimes?.Sunrise;
          break;
        case 'Dhuhr':
          prayer.time = this.prayerTimes?.Dhuhr;
          break;
        case 'Asr':
          prayer.time = this.prayerTimes?.Asr;
          break;
        case 'Maghrib':
          prayer.time = this.prayerTimes?.Maghrib;
          break;
        case 'Isha':
          prayer.time = this.prayerTimes?.Isha;
          break;
      }
      const timeNumber = prayer.time.split(':');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      prayer.timeNumber = new Date(today.getTime() + (((+timeNumber[0]) * 60 * 60 + (+timeNumber[1]) * 60) * 1000)).getTime();
    })
  }

  getTimeLeft(): TimeLeft {
    if (this.prayerTimes) {
      let next;
      if (this.prayers.find(prayer => prayer.id === this.nextPrayerId())?.id === 'Fajr') {
        next = this.prayers.find(prayer => prayer.id === 'Fajr')?.timeNumber! + 24 * 60 * 60 * 1000;
      } else {
        next = this.prayers.find(prayer => prayer.id === this.nextPrayerId())?.timeNumber!;
      }
      const now = this.time.getTime();
      const diff = next - now;
      const left = new Date(diff);
      return {
        time: diff,
        text: `${left.getHours().toString().padStart(2, '0')}:${left.getMinutes().toString().padStart(2, '0')}`
      };
    }
    return {
      time: 0,
      text: "--:--"
    };
  }

  getPercentTimeLeft(): number {
    return this.getTimeLeft()?.time * 100 / this.getTotalTimeLeft()?.time;
  }

  getTotalTimeLeft(): TimeLeft {
    if (this.prayerTimes) {
      let next;
      if (this.prayers.find(prayer => prayer.id === this.nextPrayerId())?.id === 'Fajr') {
        next = this.prayers.find(prayer => prayer.id === 'Fajr')?.timeNumber! + 24 * 60 * 60 * 1000;
      } else {
        next = this.prayers.find(prayer => prayer.id === this.nextPrayerId())?.timeNumber!;
      }
      let current = this.prayers.find(prayer => prayer.id === this.currentPrayerId())?.timeNumber!;
      const diff = next - current;
      const left = new Date(diff);
      return {
        time: diff,
        text: `${left.getHours().toString().padStart(2, '0')}:${left.getMinutes().toString().padStart(2, '0')}`
      };
    }
    return {
      time: 0,
      text: "--:--"
    };
  }

  nextPrayerId(): string {
    if (this.prayerTimes) {
      switch (this.currentPrayerId()) {
        case 'Fajr':
          return 'Sunrise';
        case 'Sunrise':
          return 'Dhuhr';
        case 'Dhuhr':
          return 'Asr';
        case 'Asr':
          return 'Maghrib';
        case 'Maghrib':
          return 'Isha';
        case 'Isha':
          return 'Fajr';
      }
    }
    return '--';
  }

  nextPrayerName(): string {
    if (this.prayerTimes) {
      return this.prayers.find(value => value?.id === this.nextPrayerId())?.name!;
    }
    return '--';
  }

  currentPrayerId(): string {
    if (this.prayerTimes) {
      const now = this.time.getTime();
      const fajr = this.prayers.find(prayer => prayer.id === 'Fajr')?.timeNumber!;
      const sunrise = this.prayers.find(prayer => prayer.id === 'Sunrise')?.timeNumber!;
      const dhuhr = this.prayers.find(prayer => prayer.id === 'Dhuhr')?.timeNumber!;
      const asr = this.prayers.find(prayer => prayer.id === 'Asr')?.timeNumber!;
      const maghrib = this.prayers.find(prayer => prayer.id === 'Maghrib')?.timeNumber!;
      const isha = this.prayers.find(prayer => prayer.id === 'Isha')?.timeNumber!;
      if (now < fajr)
        return 'Isha';
      else if (now >= fajr && now < sunrise)
        return 'Fajr';
      else if (now >= sunrise && now < dhuhr)
        return 'Sunrise';
      else if (now >= dhuhr && now < asr)
        return 'Dhuhr';
      else if (now >= asr && now < maghrib)
        return 'Asr';
      else if (now >= maghrib && now < isha)
        return 'Maghrib';
      else
        return 'Isha';
    }
    return '--';
  }
}

import { Component, computed, effect, inject, model, OnInit, Signal, signal } from '@angular/core';
import { Api } from './services/api';
import { Data } from '@angular/router';
import { CITIES, DAYS, PRAYERS } from './data/data';
import { Prayer, TimeLeft, Timings } from './models/models';
import { get, LSKeys, set } from './models/utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '(document:visibilitychange)': 'onVisibilityChange()',
  },
})
export class App implements OnInit {
  api: Api = inject(Api);

  prayerTimes = computed<Timings>(() => this.prayerTimesApi.value()?.data?.timings!);

  time = signal<Date>(new Date());
  days = signal<Data[]>(DAYS);
  cities = signal<Data[]>(CITIES);

  prayers = computed<Prayer[]>(() => {
    if (!this.prayerTimes()) return PRAYERS;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return PRAYERS.map((p) => {
      const timeStr = this.prayerTimes()[p.id as keyof Timings] || '00:00';
      const [hours, minutes] = timeStr.split(':').map(Number);
      const timeNumber = today.getTime() + (hours * 3600 + minutes * 60) * 1000;
      return { ...p, time: timeStr, timeNumber };
    });
  });

  currentCity = model<string>(get(LSKeys.city) || (null as any as string));

  timeOfDay = computed<'morning' | 'evening' | 'night'>(() => {
    const hour = this.time().getHours();
    if (hour >= 6 && hour < 17) return 'morning';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  });

  currentDate: Signal<string> = computed(() => {
    const t = this.time();
    return `${t.getDate()}-${t.getMonth() + 1}-${t.getFullYear()}`;
  });

  currentTime: Signal<string> = computed(() => {
    return `${this.time().getHours().toString().padStart(2, '0')}:${this.time().getMinutes().toString().padStart(2, '0')}:${this.time().getSeconds().toString().padStart(2, '0')}`;
  });

  currentGregDateAr: Signal<string> = computed(() => {
    return new Intl.DateTimeFormat('ar-MA', {
      dateStyle: 'long',
    }).format(this.time());
  });

  currentHijriDateAr: Signal<string> = computed(() => {
    const hijri = this.hijriDateApi.value()?.data?.hijri;
    if (!hijri) return '--';
    const parts = hijri.date.split('-');
    return `${parts[0]} ${hijri.month.ar} ${parts[2]}`;
  });

  timeLeft = computed<TimeLeft>(() => {
    if (!this.prayerTimes()) return { time: 0, text: '--:--' };
    return this.calculateTimeLeft(this.time().getTime());
  });

  totalTimeLeft = computed<TimeLeft>(() => {
    if (!this.prayerTimes()) return { time: 0, text: '--:--' };
    const currentPrayerTime = this.getPrayerTimeNumber(this.currentPrayerId());
    return this.calculateTimeLeft(currentPrayerTime);
  });

  percentageOfTimeLeft = computed(() => {
    const total = this.totalTimeLeft().time;
    if (!total) return 0;
    return Math.floor((this.timeLeft().time * 10000) / total) / 100;
  });

  private calculateTimeLeft(time: number): TimeLeft {
    let next = this.getPrayerTimeNumber(this.nextPrayerId());
    if (this.nextPrayerId() === 'Fajr') {
      next += 24 * 60 * 60 * 1000;
    }

    const diff = next - time;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    return {
      time: diff,
      text: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    };
  }

  private getPrayerTimeNumber(id: string): number {
    return this.prayers().find((p) => p.id === id)?.timeNumber || 0;
  }

  nextPrayerId: Signal<string> = computed(() => {
    if (!this.prayerTimes()) return '--';
    const chain: Record<string, string> = {
      Fajr: 'Sunrise',
      Sunrise: 'Dhuhr',
      Dhuhr: 'Asr',
      Asr: 'Maghrib',
      Maghrib: 'Isha',
      Isha: 'Fajr',
    };
    return chain[this.currentPrayerId()] || '--';
  });

  nextPrayerName: Signal<string> = computed(() => {
    return this.prayers().find((p) => p.id === this.nextPrayerId())?.name || '--';
  });

  currentPrayerId: Signal<string> = computed(() => {
    if (this.prayerTimes()) {
      const now = this.time().getTime();
      const fajr = this.getPrayer('Fajr')?.timeNumber!;
      const sunrise = this.getPrayer('Sunrise')?.timeNumber!;
      const dhuhr = this.getPrayer('Dhuhr')?.timeNumber!;
      const asr = this.getPrayer('Asr')?.timeNumber!;
      const maghrib = this.getPrayer('Maghrib')?.timeNumber!;
      const isha = this.getPrayer('Isha')?.timeNumber!;
      if (now < fajr) return 'Isha';
      else if (now >= fajr && now < sunrise) return 'Fajr';
      else if (now >= sunrise && now < dhuhr) return 'Sunrise';
      else if (now >= dhuhr && now < asr) return 'Dhuhr';
      else if (now >= asr && now < maghrib) return 'Asr';
      else if (now >= maghrib && now < isha) return 'Maghrib';
      else return 'Isha';
    }
    return '--';
  });

  private lastNotifiedPrayer = signal<string>('');

  constructor() {
    effect(() => {
      const remainingMs = this.timeLeft().time;
      const nextPrayer = this.nextPrayerId();

      const fiveMinutesInMs = 310000;

      if (
        remainingMs <= fiveMinutesInMs &&
        remainingMs > 0 &&
        nextPrayer !== '--' &&
        this.lastNotifiedPrayer() !== nextPrayer
      ) {
        this.lastNotifiedPrayer.update((old) => nextPrayer);
        this.sendNotification(this.nextPrayerName());
      }
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.time.set(new Date());
    }, 1000);

    this.requestNotificationPermission();
  }

  prayerTimesApi = rxResource({
    params: () =>
      this.currentCity() ? { city: this.currentCity(), date: this.currentDate() } : undefined,
    stream: ({ params }) => this.api.getPrayerTimes(params.city!, params.date),
  });

  hijriDateApi = rxResource({
    params: () => ({ date: this.currentDate() }),
    stream: ({ params }) => this.api.getTodayHijri(params?.date),
  });

  isDayCurrentDay(id: string): boolean {
    return (
      id.toLowerCase() ===
      this.time().toLocaleDateString('en-EN', { weekday: 'long' }).toLowerCase()
    );
  }

  protected onCityChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.currentCity.set(value);
    set(LSKeys.city, value);
  }

  onVisibilityChange(): void {
    if (!document.hidden) {
      this.time.set(new Date());
    }
  }

  getPrayer(id: string): Prayer {
    return this.prayers().find((item) => item?.id === id)!;
  }

  private requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  private sendNotification(prayerName: string) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }
    new Notification('تذكير بالصلاة', {
      body: `بقي 5 دقائق لصلاة : ${prayerName}`,
      requireInteraction: true,
    });
  }
}

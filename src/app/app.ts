import { Component, computed, effect, inject, model, OnInit, Signal, signal } from '@angular/core';
import { Api } from './services/api';
import { CITIES, DAYS, PRAYERS } from './data/data';
import { KeyValue, Prayer, TimeLeft, Timings } from './models/models';
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
  days = signal<KeyValue[]>(DAYS);
  cities = signal<KeyValue[]>(CITIES);

  prayers = computed<Prayer[]>(() => {
    const timings = this.prayerTimes();
    if (!timings) return PRAYERS;

    const staticToday = new Date();
    staticToday.setHours(0, 0, 0, 0);
    const midnightTimestamp = staticToday.getTime();

    return PRAYERS.map((p) => {
      const timeStr = timings[p.id as keyof Timings] || '00:00';
      const [hours, minutes] = timeStr.split(':').map(Number);
      const timeNumber = midnightTimestamp + (hours * 3600 + minutes * 60) * 1000;

      return { ...p, time: timeStr, timeNumber };
    });
  });

  currentCity = model<string>(get(LSKeys.city)!);

  timeOfDay = signal<'morning' | 'evening' | 'night'>(this.calculateTimeOfDay());

  currentDayOfWeek = signal<string>(null as any as string);

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
    return Math.floor((this.timeLeft().time * 100) / total);
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

  currentPrayerId = signal<string>('--');

  private lastNotifiedPrayer = signal<string>('');

  prayerTimesApi = rxResource({
    params: () =>
      this.currentCity() ? { city: this.currentCity(), date: this.currentDate() } : undefined,
    stream: ({ params }) => this.api.getPrayerTimes(params.city!, params.date),
  });

  hijriDateApi = rxResource({
    params: () => ({ date: this.currentDate() }),
    stream: ({ params }) => this.api.getTodayHijri(params?.date),
  });

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

    this.currentDayOfWeek.set(
      this.time().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
    );
    this.currentPrayerId.set(this.calculateActivePrayerId());

    setInterval(() => {
      const freshTimeOfDay = this.calculateTimeOfDay();
      if (this.timeOfDay() !== freshTimeOfDay) {
        this.timeOfDay.set(freshTimeOfDay);
      }

      const today = this.time().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (this.currentDayOfWeek() !== today) {
        this.currentDayOfWeek.set(today);
      }

      const activePrayer = this.calculateActivePrayerId();
      if (this.currentPrayerId() !== activePrayer) {
        this.currentPrayerId.set(activePrayer);
      }
    }, 60000);

    this.requestNotificationPermission();
  }

  private calculateActivePrayerId(): string {
    if (!this.prayerTimes()) return '--';

    const now = this.time().getTime();
    const currentPrayers = this.prayers();
    const getNum = (id: string) => currentPrayers.find((p) => p.id === id)?.timeNumber || 0;

    const fajr = getNum('Fajr');
    const sunrise = getNum('Sunrise');
    const dhuhr = getNum('Dhuhr');
    const asr = getNum('Asr');
    const maghrib = getNum('Maghrib');
    const isha = getNum('Isha');

    if (now < fajr) return 'Isha';
    if (now >= fajr && now < sunrise) return 'Fajr';
    if (now >= sunrise && now < dhuhr) return 'Sunrise';
    if (now >= dhuhr && now < asr) return 'Dhuhr';
    if (now >= asr && now < maghrib) return 'Asr';
    if (now >= maghrib && now < isha) return 'Maghrib';
    return 'Isha';
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

  private calculateTimeOfDay(): 'morning' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) return 'morning';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
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

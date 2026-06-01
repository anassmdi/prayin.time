export class Data {
  id: string;
  name: string;
}

export class Prayer {
  id: string;
  name: string;
  time: string;
  timeNumber?: number;
}

export class TimeLeft {
  time: number;
  text: string;
}

export class PrayerTimeResponse {
  code: number;
  status: string;
  data: PTData;
}

export class PTData {
  timings: Timings;
  date: DateData;
  meta: Meta;
}

export class Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

class HijriWeekday {
  en: string;
  ar: string;
}

class HijriMonth {
  number: number;
  en: string;
  ar: string;
  days: number;
}

class Designation {
  abbreviated: string;
  expanded: string;
}

class Hijri {
  date: string;
  format: string;
  day: string;
  weekday: HijriWeekday;
  month: HijriMonth;
  year: string;
  designation: Designation;
  holidays: any[];
  adjustedHolidays: string[];
  method: string;
}

class GregorianWeekday {
  en: string;
}

class GregorianMonth {
  number: number;
  en: string;
}

class Gregorian {
  date: string;
  format: string;
  day: string;
  weekday: GregorianWeekday;
  month: GregorianMonth;
  year: string;
  designation: Designation;
  lunarSighting: boolean;
}

class DateData {
  readable: string;
  timestamp: string;
  hijri: Hijri;
  gregorian: Gregorian;
}

class MethodParams {
  Fajr: number;
  Isha: number;
}

class MethodLocation {
  latitude: number;
  longitude: number;
}

class Method {
  id: number;
  name: string;
  params: MethodParams;
  location: MethodLocation;
}

class Offset {
  Imsak: number;
  Fajr: number;
  Sunrise: number;
  Dhuhr: number;
  Asr: number;
  Sunset: number;
  Maghrib: number;
  Isha: number;
  Midnight: number;
}

class Meta {
  latitude: number;
  longitude: number;
  timezone: string;
  method: Method;
  latitudeAdjustmentMethod: string;
  midnightMode: string;
  school: string;
  offset: Offset;
}

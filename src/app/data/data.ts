import { KeyValue, Prayer } from '../models/models';

export const CITIES: KeyValue[] = [
  {
    key: 'Azilal',
    value: 'أزيلال',
  },
  {
    key: 'Inezgane-Ait Melloul',
    value: 'إنزكان - آيت ملول',
  },
  {
    key: 'Ifrane',
    value: 'إفران',
  },
  {
    key: 'Berkane',
    value: 'بركان',
  },
  {
    key: 'Berrechid',
    value: 'برشيد',
  },
  {
    key: 'Benslimane',
    value: 'بنسليمان',
  },
  {
    key: 'Boujdour',
    value: 'بوجدور',
  },
  {
    key: 'Boulemane',
    value: 'بولمان',
  },
  {
    key: 'Béni Mellal',
    value: 'بني ملال',
  },
  {
    key: 'Béni Mellal-Khénifra',
    value: 'بني ملال - خنيفرة',
  },
  {
    key: 'Tarfaya',
    value: 'طرفاية',
  },
  {
    key: 'Tata',
    value: 'طاطا',
  },
  {
    key: 'Tan-Tan',
    value: 'طانطان',
  },
  {
    key: 'Tanger-Assilah',
    value: 'طنجة - أصيلة',
  },
  {
    key: 'Tanger-Tétouan-Al Hoceïma',
    value: 'طنجة - تطوان - الحسيمة',
  },
  {
    key: 'Taza',
    value: 'تازة',
  },
  {
    key: 'Taounate',
    value: 'تاونات',
  },
  {
    key: 'Taourirt',
    value: 'تاوريرت',
  },
  {
    key: 'Taroudannt',
    value: 'تارودانت',
  },
  {
    key: 'Tinghir',
    value: 'تنغير',
  },
  {
    key: 'Tétouan',
    value: 'تطوان',
  },
  {
    key: 'Tiznit',
    value: 'تيزنيت',
  },
  {
    key: 'Jerada',
    value: 'جرادة',
  },
  {
    key: 'Guercif',
    value: 'جرسيف',
  },
  {
    key: 'El Jadida',
    value: 'الجديدة',
  },
  {
    key: 'Al Hoceïma',
    value: 'الحسيمة',
  },
  {
    key: 'Al Haouz',
    value: 'الحوز',
  },
  {
    key: 'El Hajeb',
    value: 'الحاجب',
  },
  {
    key: 'Rehamna',
    value: 'الرحامنة',
  },
  {
    key: 'Rabat',
    value: 'الرباط',
  },
  {
    key: 'Rabat-Salé-Kénitra',
    value: 'الرباط - سلا - القنيطرة',
  },
  {
    key: 'Errachidia',
    value: 'الرشيدية',
  },
  {
    key: 'Larache',
    value: 'العرائش',
  },
  {
    key: 'Ouarzazate',
    value: 'ورزازات',
  },
  {
    key: 'Ouezzane',
    value: 'وزان',
  },
  {
    key: 'Oued Ed-Dahab',
    value: 'وادي الذهب',
  },
  {
    key: 'Oujda',
    value: 'وجدة',
  },
  {
    key: 'Zagora',
    value: 'زاكورة',
  },
  {
    key: 'Settat',
    value: 'سطات',
  },
  {
    key: 'Sefrou',
    value: 'صفرو',
  },
  {
    key: 'Salé',
    value: 'سلا',
  },
  {
    key: 'Sidi Bennour',
    value: 'سيدي بنور',
  },
  {
    key: 'Sidi Ifni',
    value: 'سيدي إفني',
  },
  {
    key: 'Sidi Kacem',
    value: 'سيدي قاسم',
  },
  {
    key: 'Sidi Slimane',
    value: 'سيدي سليمان',
  },
  {
    key: 'Chefchaouen',
    value: 'شفشاون',
  },
  {
    key: 'Souss-Massa',
    value: 'سوس - ماسة',
  },
  {
    key: 'Chichaoua',
    value: 'شيخاوة',
  },
  {
    key: 'Chtouka-Ait Baha',
    value: 'شتوكة آيت باها',
  },
  {
    key: "L'Oriental",
    value: 'الشرق',
  },
  {
    key: 'Skhirate-Témara',
    value: 'الصخيرات - تمارة',
  },
  {
    key: 'Essaouira',
    value: 'الصويرة',
  },
  {
    key: 'Drâa-Tafilalet',
    value: 'درعة - تافيلالت',
  },
  {
    key: 'Dakhla-Oued Ed-Dahab',
    value: 'الداخلة - وادي الذهب',
  },
  {
    key: 'Driouch',
    value: 'الدريوش',
  },
  {
    key: 'Khémisset',
    value: 'الخميسات',
  },
  {
    key: 'Khouribga',
    value: 'خريبكة',
  },
  {
    key: 'Khénifra',
    value: 'خنيفرة',
  },
  {
    key: 'Laâyoune',
    value: 'العيون',
  },
  {
    key: 'Laâyoune-Sakia El Hamra',
    value: 'العيون - الساقية الحمراء',
  },
  {
    key: 'Guelmim',
    value: 'كلميم',
  },
  {
    key: 'Kénitra',
    value: 'القنيطرة',
  },
  {
    key: 'El Kelâa des Sraghna',
    value: 'قلعة السراغنة',
  },
  {
    key: 'Casablanca',
    value: 'الدار البيضاء',
  },
  {
    key: 'Casablanca-Settat',
    value: 'الدار البيضاء - سطات',
  },
  {
    key: 'Médiouna',
    value: 'مديونة',
  },
  {
    key: 'Marrakech',
    value: 'مراكش',
  },
  {
    key: 'Marrakech-Safi',
    value: 'مراكش - آسفي',
  },
  {
    key: 'Meknès',
    value: 'مكناس',
  },
  {
    key: 'Mohammadia',
    value: 'المحمدية',
  },
  {
    key: 'M’diq-Fnideq',
    value: 'المضيق - الفنيدق',
  },
  {
    key: 'Midelt',
    value: 'ميدلت',
  },
  {
    key: 'Moulay Yacoub',
    value: 'مولاي يعقوب',
  },
  {
    key: 'Nador',
    value: 'الناظور',
  },
  {
    key: 'Nouaceur',
    value: 'النواصر',
  },
  {
    key: 'Fahs-Anjra',
    value: 'فحص أنجرة',
  },
  {
    key: 'Fquih Ben Salah',
    value: 'الفقيه بن صالح',
  },
  {
    key: 'Figuig',
    value: 'فجيج',
  },
  {
    key: 'Fès',
    value: 'فاس',
  },
  {
    key: 'Fès-Meknès',
    value: 'فاس - مكناس',
  },
  {
    key: 'Youssoufia',
    value: 'اليوسفية',
  },
];

export const DAYS: KeyValue[] = [
  {
    key: 'monday',
    value: 'الإثنين',
  },
  {
    key: 'tuesday',
    value: 'الثلاثاء',
  },
  {
    key: 'wednesday',
    value: 'الأربعاء',
  },
  {
    key: 'thursday',
    value: 'الخميس',
  },
  {
    key: 'friday',
    value: 'الجمعة',
  },
  {
    key: 'saturday',
    value: 'السبت',
  },
  {
    key: 'sunday',
    value: 'الأحد',
  },
];

export const PRAYERS: Prayer[] = [
  {
    id: 'Fajr',
    name: 'الفجر 🌃',
    time: '--:--',
  },
  {
    id: 'Sunrise',
    name: 'الشروق 🌅',
    time: '--:--',
  },
  {
    id: 'Dhuhr',
    name: 'الظهر 🏙️',
    time: '--:--',
  },
  {
    id: 'Asr',
    name: 'العصر 🏙️',
    time: '--:--',
  },
  {
    id: 'Maghrib',
    name: 'المغرب 🌇',
    time: '--:--',
  },
  {
    id: 'Isha',
    name: 'العشاء 🌃',
    time: '--:--',
  },
];

// Список поездок. Чтобы добавить свою поездку — скопируйте один блок { ... }
// и заполните своими данными. lat/lng можно найти, кликнув правой кнопкой
// на точке на Google Maps.
//
// startDate / endDate — формат "ГГГГ-ММ-ДД", используются для календаря справа.
// notes — описание поездки, может быть любой длины.
// photos — список фото; caption необязателен (можно убрать строку или оставить "").
const trips = [
  {
    city: "Стокгольм",
    country: "Швеция",
    lat: 59.3293,
    lng: 18.0686,
    startDate: "2025-10-16",
    endDate: "2025-10-27",
    dateLabel: "16–27 октября 2025",
    title: "Стокгольм — Палермо",
    notes: "Первая остановка большого путешествия: осенний Стокгольм, велопарковки у станций и жёлтые городские автобусы.",
    cover: "photos/stockholm/03.jpg",
    photos: [
      { url: "photos/stockholm/01.jpg", caption: "", lat: 59.639503, lng: 17.941715 },
      { url: "photos/stockholm/02.jpg", caption: "", lat: 59.639474, lng: 17.941626 },
      { url: "photos/stockholm/03.jpg", caption: "Велопарковка у станции", lat: 59.857709, lng: 17.647157 },
      { url: "photos/stockholm/04.jpg", caption: "", lat: 59.858405, lng: 17.646198 },
      { url: "photos/stockholm/05.jpg", caption: "", lat: 59.855359, lng: 17.641467 },
      { url: "photos/stockholm/06.jpg", caption: "", lat: 59.852582, lng: 17.628289 },
      { url: "photos/stockholm/07.jpg", caption: "", lat: 59.852168, lng: 17.628634 },
      { url: "photos/stockholm/08.jpg", caption: "", lat: 59.857636, lng: 17.634528 },
      { url: "photos/stockholm/09.jpg", caption: "", lat: 59.330467, lng: 18.071130 },
      { url: "photos/stockholm/10.jpg", caption: "", lat: 59.640094, lng: 17.941194 },
      { url: "photos/stockholm/11.jpg", caption: "", lat: 59.327843, lng: 18.031648 }
    ]
  },
  {
    city: "Фуншал",
    country: "Мадейра, Португалия",
    lat: 32.6669,
    lng: -16.9241,
    startDate: "2026-01-04",
    endDate: "2026-01-11",
    dateLabel: "4–11 января 2026",
    title: "Мадейра",
    notes: "Серпантины над океаном и вечерний вид на Фуншал с высоты.",
    cover: "photos/madeira/05.jpg",
    photos: [
      { url: "photos/madeira/01.jpg", caption: "", lat: 32.775343, lng: -16.826629 },
      { url: "photos/madeira/02.jpg", caption: "", lat: 32.774176, lng: -16.827003 },
      { url: "photos/madeira/03.jpg", caption: "", lat: 32.774000, lng: -16.827151 },
      { url: "photos/madeira/04.jpg", caption: "", lat: 32.639806, lng: -16.851884 },
      { url: "photos/madeira/05.jpg", caption: "Ночной серпантин над Фуншалом", lat: 32.638573, lng: -16.850606 }
    ]
  },
  {
    city: "Ныммевески",
    country: "Эстония",
    lat: 59.504172,
    lng: 25.788222,
    startDate: "2026-08-21",
    endDate: "2026-08-21",
    dateLabel: "21 августа 2026",
    title: "Ныммевески",
    notes: "Стоянка для костра на берегу Валгейыги в Лахемаа: жёлтая от болотной воды река, старые известняковые глыбы и небольшой, но эффектный водопад в глубоком каньоне.",
    cover: "photos/nommeveski/cover.jpg",
    photos: [
      { url: "photos/nommeveski/01.jpg", caption: "", lat: 59.507249, lng: 25.787876 },
      { url: "photos/nommeveski/02.jpg", caption: "", lat: 59.504820, lng: 25.786832 },
      { url: "photos/nommeveski/03.jpg", caption: "Водопад Ныммевески", lat: 59.504161, lng: 25.788186 },
      { url: "photos/nommeveski/04.jpg", caption: "", lat: 59.504002, lng: 25.788144 },
      { url: "photos/nommeveski/05.jpg", caption: "", lat: 59.503143, lng: 25.787879 },
      { url: "photos/nommeveski/06.jpg", caption: "", lat: 59.503082, lng: 25.787996 },
      { url: "photos/nommeveski/07.jpg", caption: "", lat: 59.503072, lng: 25.788657 }
    ]
  }
];

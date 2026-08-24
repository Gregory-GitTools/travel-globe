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
      { url: "photos/stockholm/01.jpg", caption: "" },
      { url: "photos/stockholm/02.jpg", caption: "" },
      { url: "photos/stockholm/03.jpg", caption: "Велопарковка у станции" },
      { url: "photos/stockholm/04.jpg", caption: "" },
      { url: "photos/stockholm/05.jpg", caption: "" },
      { url: "photos/stockholm/06.jpg", caption: "" },
      { url: "photos/stockholm/07.jpg", caption: "" },
      { url: "photos/stockholm/08.jpg", caption: "" },
      { url: "photos/stockholm/09.jpg", caption: "" },
      { url: "photos/stockholm/10.jpg", caption: "" },
      { url: "photos/stockholm/11.jpg", caption: "" }
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
      { url: "photos/madeira/01.jpg", caption: "" },
      { url: "photos/madeira/02.jpg", caption: "" },
      { url: "photos/madeira/03.jpg", caption: "" },
      { url: "photos/madeira/04.jpg", caption: "" },
      { url: "photos/madeira/05.jpg", caption: "Ночной серпантин над Фуншалом" }
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
      { url: "photos/nommeveski/01.jpg", caption: "" },
      { url: "photos/nommeveski/02.jpg", caption: "" },
      { url: "photos/nommeveski/03.jpg", caption: "Водопад Ныммевески" },
      { url: "photos/nommeveski/04.jpg", caption: "" },
      { url: "photos/nommeveski/05.jpg", caption: "" },
      { url: "photos/nommeveski/06.jpg", caption: "" },
      { url: "photos/nommeveski/07.jpg", caption: "" }
    ]
  }
];

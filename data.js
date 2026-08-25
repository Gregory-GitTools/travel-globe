// Список поездок. Чтобы добавить свою поездку — скопируйте один блок { ... }
// и заполните своими данными. lat/lng можно найти, кликнув правой кнопкой
// на точке на Google Maps.
//
// startDate / endDate — формат "ГГГГ-ММ-ДД", используются для календаря справа.
// notes — описание поездки, может быть любой длины.
// photos — список фото; caption необязателен (можно убрать строку или оставить "").
// music — необязательное поле поездки: имя файла из папки music/ (например
// "music/Wildfire - Jessie Villa.mp3") или "random" — тогда во время слайдшоу
// будет случайно выбран один из треков в musicLibrary ниже.
const musicLibrary = [
  "music/Bring It Together - Telecasted.mp3",
  "music/Mourning Dove - Zachariah Hickman.mp3",
  "music/Town This Small - Anno Domini Beats.mp3",
  "music/Two Things - Anno Domini Beats.mp3",
  "music/Under The Sun - Everet Almond.mp3",
  "music/Wildfire - Jessie Villa.mp3"
];

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
      { url: "photos/stockholm/01.jpg", caption: "Radisson Blu Airport Terminal Hotel, Stockholm-Arlanda Airport", lat: 59.639503, lng: 17.941715 },
      { url: "photos/stockholm/02.jpg", caption: "Radisson Blu Airport Terminal Hotel, Stockholm-Arlanda Airport", lat: 59.639474, lng: 17.941626 },
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
  },
  {
    city: "Таллин",
    country: "Эстония",
    lat: 59.439051,
    lng: 24.845401,
    startDate: "2026-08-12",
    endDate: "2026-08-12",
    dateLabel: "12 августа 2026",
    title: "Солнечное затмение",
    notes: "Частичное солнечное затмение прошло в Эстонии вечером 12 августа 2026 года, совпав по времени с закатом солнца и пиком метеорного потока Персеиды.",
    cover: "photos/eclipse/cover.jpg",
    music: "random",
    photos: [
      { url: "photos/eclipse/01.jpg", caption: "", lat: 59.439051, lng: 24.845401 },
      { url: "photos/eclipse/02.jpg", caption: "", lat: 59.439051, lng: 24.845401 },
      { url: "photos/eclipse/03.jpg", caption: "", lat: 59.439051, lng: 24.845401 }
    ]
  },
  {
    city: "Силламяэ",
    country: "Эстония",
    lat: 59.399728,
    lng: 27.765953,
    startDate: "2026-07-03",
    endDate: "2026-07-03",
    dateLabel: "3–4 июля 2026",
    title: "В гостях у Стасика в Силламяэ",
    notes: "Небольшая поездка вдоль побережья Ида-Вирумаа 3–4 июля 2026 года: по дороге — водопад Валасте на клинте, замок Германа в Нарве и старый санаторий в Нарва-Йыэсуу, а вечером — приморский бульвар Силламяэ и в гости к Стасику. На второй день — прогулка лесной тропой вдоль ручья и праздник в саду с друзьями.",
    cover: "photos/sillamae/14.jpg",
    photos: [
      { url: "photos/sillamae/01.jpg", caption: "", lat: 59.407022, lng: 27.108166 },
      { url: "photos/sillamae/02.jpg", caption: "", lat: 59.443851, lng: 27.335806 },
      { url: "photos/sillamae/03.jpg", caption: "", lat: 59.444022, lng: 27.335447 },
      { url: "photos/sillamae/04.jpg", caption: "Водопад Валасте", lat: 59.444341, lng: 27.335265 },
      { url: "photos/sillamae/05.jpg", caption: "Замок Германа, Нарва", lat: 59.371752, lng: 28.20375 },
      { url: "photos/sillamae/06.jpg", caption: "", lat: 59.373233, lng: 28.201884 },
      { url: "photos/sillamae/07.jpg", caption: "", lat: 59.377166, lng: 28.203375 },
      { url: "photos/sillamae/08.jpg", caption: "", lat: 59.460891, lng: 28.032576 },
      { url: "photos/sillamae/09.jpg", caption: "Санаторий в Нарва-Йыэсуу", lat: 59.462067, lng: 28.03642 },
      { url: "photos/sillamae/10.jpg", caption: "", lat: 59.462481, lng: 28.034701 },
      { url: "photos/sillamae/11.jpg", caption: "", lat: 59.396176, lng: 27.762477 },
      { url: "photos/sillamae/12.jpg", caption: "", lat: 59.396176, lng: 27.762477 },
      { url: "photos/sillamae/13.jpg", caption: "", lat: 59.396525, lng: 27.763034 },
      { url: "photos/sillamae/14.jpg", caption: "Приморский бульвар Силламяэ", lat: 59.399728, lng: 27.765953 },
      { url: "photos/sillamae/15.jpg", caption: "", lat: 59.401587, lng: 27.757544 },
      { url: "photos/sillamae/16.jpg", caption: "Лесная тропа с мостиком", lat: 59.39683, lng: 27.830714 },
      { url: "photos/sillamae/17.jpg", caption: "", lat: 59.396473, lng: 27.823687 },
      { url: "photos/sillamae/18.jpg", caption: "", lat: 59.39625, lng: 27.821617 },
      { url: "photos/sillamae/19.jpg", caption: "", lat: 59.396249, lng: 27.821592 },
      { url: "photos/sillamae/20.jpg", caption: "", lat: 59.395148, lng: 27.819257 },
      { url: "photos/sillamae/21.jpg", caption: "", lat: 59.394373, lng: 27.81335 },
      { url: "photos/sillamae/22.jpg", caption: "", lat: 59.394592, lng: 27.806809 },
      { url: "photos/sillamae/23.jpg", caption: "", lat: 59.394596, lng: 27.806539 },
      { url: "photos/sillamae/24.jpg", caption: "", lat: 59.400005, lng: 27.76591 },
      { url: "photos/sillamae/25.jpg", caption: "", lat: 59.396832, lng: 27.763499 },
      { url: "photos/sillamae/26.jpg", caption: "", lat: 59.395972, lng: 27.76501 },
      { url: "photos/sillamae/27.jpg", caption: "Праздник в саду у Стасика", lat: 59.385619, lng: 27.795568 },
      { url: "photos/sillamae/28.jpg", caption: "Цапли на камне у моря" }
    ]
  }
];

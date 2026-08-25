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
    city: "Нафплион",
    country: "Греция",
    lat: 37.5679,
    lng: 22.7997,
    startDate: "2026-08-02",
    endDate: "2026-08-10",
    dateLabel: "2–10 августа 2026",
    title: "Нафплион",
    notes: "Неделя в старом городе на побережье Арголического залива: венецианская крепость Паламиди над черепичными крышами, узкие улочки Старого города и вечера у моря.",
    cover: "photos/nafplio/01.jpg",
    photos: [
      { url: "photos/nafplio/01.jpg", caption: "", lat: 37.562922, lng: 22.800321 },
      { url: "photos/nafplio/02.jpg", caption: "", lat: 37.560040, lng: 22.801886 },
      { url: "photos/nafplio/03.jpg", caption: "", lat: 37.552890, lng: 22.806386 },
      { url: "photos/nafplio/04.jpg", caption: "", lat: 37.551265, lng: 22.809213 },
      { url: "photos/nafplio/05.jpg", caption: "", lat: 37.548952, lng: 22.810223 },
      { url: "photos/nafplio/06.jpg", caption: "", lat: 37.547651, lng: 22.811116 },
      { url: "photos/nafplio/07.jpg", caption: "Крепость Паламиди", lat: 37.545786, lng: 22.813477 },
      { url: "photos/nafplio/08.jpg", caption: "", lat: 37.548967, lng: 22.810943 },
      { url: "photos/nafplio/09.jpg", caption: "", lat: 37.549404, lng: 22.809822 },
      { url: "photos/nafplio/10.jpg", caption: "", lat: 37.549774, lng: 22.809561 },
      { url: "photos/nafplio/11.jpg", caption: "", lat: 37.550052, lng: 22.809435 },
      { url: "photos/nafplio/12.jpg", caption: "", lat: 37.552310, lng: 22.808748 },
      { url: "photos/nafplio/13.jpg", caption: "", lat: 37.564985, lng: 22.800107 },
      { url: "photos/nafplio/14.jpg", caption: "", lat: 37.564985, lng: 22.800107 },
      { url: "photos/nafplio/15.jpg", caption: "", lat: 37.563488, lng: 22.798911 },
      { url: "photos/nafplio/16.jpg", caption: "", lat: 37.564508, lng: 22.798209 },
      { url: "photos/nafplio/17.jpg", caption: "", lat: 37.564257, lng: 22.797785 },
      { url: "photos/nafplio/18.jpg", caption: "", lat: 37.564699, lng: 22.796348 },
      { url: "photos/nafplio/19.jpg", caption: "", lat: 37.563139, lng: 22.793200 },
      { url: "photos/nafplio/20.jpg", caption: "", lat: 37.563146, lng: 22.799113 },
      { url: "photos/nafplio/21.jpg", caption: "", lat: 37.564846, lng: 22.800700 },
      { url: "photos/nafplio/22.jpg", caption: "", lat: 37.564922, lng: 22.804451 },
      { url: "photos/nafplio/23.jpg", caption: "", lat: 37.560560, lng: 22.803753 },
      { url: "photos/nafplio/24.jpg", caption: "", lat: 37.562351, lng: 22.804118 },
      { url: "photos/nafplio/25.jpg", caption: "", lat: 37.563173, lng: 22.799187 },
      { url: "photos/nafplio/26.jpg", caption: "", lat: 37.514520, lng: 22.856860 },
      { url: "photos/nafplio/27.jpg", caption: "", lat: 37.519565, lng: 22.858442 },
      { url: "photos/nafplio/28.jpg", caption: "", lat: 37.519664, lng: 22.858376 },
      { url: "photos/nafplio/29.jpg", caption: "", lat: 37.566419, lng: 22.792717 },
      { url: "photos/nafplio/30.jpg", caption: "", lat: 37.569500, lng: 22.791841 },
      { url: "photos/nafplio/31.jpg", caption: "", lat: 37.567816, lng: 22.798502 },
      { url: "photos/nafplio/32.jpg", caption: "", lat: 37.564858, lng: 22.799484 },
      { url: "photos/nafplio/33.jpg", caption: "", lat: 37.566358, lng: 22.794000 },
      { url: "photos/nafplio/34.jpg", caption: "", lat: 37.565168, lng: 22.793232 },
      { url: "photos/nafplio/35.jpg", caption: "", lat: 37.566447, lng: 22.795924 },
      { url: "photos/nafplio/36.jpg", caption: "", lat: 37.562539, lng: 22.792261 }
    ]
  }
];

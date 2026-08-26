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
    endDate: "2025-10-16",
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
    endDate: "2026-01-04",
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
  },
  {
    city: "Нафплион",
    country: "Греция",
    lat: 37.5679,
    lng: 22.7997,
    startDate: "2026-08-02",
    endDate: "2026-08-02",
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
  },
  {
    city: "Центральная Эстония",
    country: "Эстония",
    lat: 58.818867,
    lng: 25.756507,
    startDate: "2026-07-26",
    endDate: "2026-07-26",
    dateLabel: "26 июля 2026",
    title: "Дни открытых хуторов 2026",
    notes: "Поездка по хуторам Центральной Эстонии в рамках ежегодного дня открытых дверей — фермы и усадьбы Ярвамаа, Вильяндимаа и Йыгевамаа, открытые для гостей всего один день в году.",
    cover: "photos/hutorud/01.jpg",
    music: "random",
    photos: [
      { url: "photos/hutorud/01.jpg", caption: "", lat: 58.837297, lng: 25.816558 },
      { url: "photos/hutorud/02.jpg", caption: "", lat: 58.837311, lng: 25.815924 },
      { url: "photos/hutorud/03.jpg", caption: "", lat: 58.808925, lng: 25.931864 },
      { url: "photos/hutorud/04.jpg", caption: "", lat: 58.809374, lng: 25.932186 },
      { url: "photos/hutorud/05.jpg", caption: "", lat: 58.809740, lng: 25.931554 },
      { url: "photos/hutorud/06.jpg", caption: "", lat: 58.809748, lng: 25.932063 },
      { url: "photos/hutorud/07.jpg", caption: "" },
      { url: "photos/hutorud/08.jpg", caption: "", lat: 58.655447, lng: 25.967317 },
      { url: "photos/hutorud/09.jpg", caption: "", lat: 58.654350, lng: 25.967193 },
      { url: "photos/hutorud/10.jpg", caption: "", lat: 58.804662, lng: 25.428851 },
      { url: "photos/hutorud/11.jpg", caption: "", lat: 58.883156, lng: 25.583173 },
      { url: "photos/hutorud/12.jpg", caption: "", lat: 58.888873, lng: 25.571256 },
      { url: "photos/hutorud/13.jpg", caption: "", lat: 58.889717, lng: 25.573818 },
      { url: "photos/hutorud/14.jpg", caption: "", lat: 58.888526, lng: 25.569785 },
      { url: "photos/hutorud/15.jpg", caption: "", lat: 58.887016, lng: 25.569549 }
    ]
  },
  {
    city: "Лауласмаа",
    country: "Эстония",
    lat: 59.400864,
    lng: 24.201927,
    startDate: "2026-07-11",
    endDate: "2026-07-11",
    dateLabel: "11 июля 2026",
    title: "Лауласмаа",
    notes: "Прогулка по побережью Лохусалуского полуострова — сосновый лес, пляж и закат над заливом в Лауласмаа.",
    cover: "photos/laulasmaa/01.jpg",
    music: "random",
    photos: [
      { url: "photos/laulasmaa/01.jpg", caption: "", lat: 59.400864, lng: 24.201927 },
      { url: "photos/laulasmaa/02.jpg", caption: "", lat: 59.398920, lng: 24.203086 },
      { url: "photos/laulasmaa/03.jpg", caption: "", lat: 59.397110, lng: 24.208106 },
      { url: "photos/laulasmaa/04.jpg", caption: "", lat: 59.391226, lng: 24.233016 }
    ]
  },
  {
    city: "Неэме",
    country: "Харьюмаа, Эстония",
    lat: 59.473921,
    lng: 25.152025,
    startDate: "2026-07-12",
    endDate: "2026-07-12",
    dateLabel: "12 июля 2026",
    title: "Неэме",
    notes: "Вечерняя поездка на полуостров Виймси — рыбацкая деревня Неэме на берегу Финского залива.",
    cover: "photos/neeme/01.jpg",
    music: "random",
    photos: [
      { url: "photos/neeme/01.jpg", caption: "", lat: 59.473921, lng: 25.152025 },
      { url: "photos/neeme/02.jpg", caption: "", lat: 59.473591, lng: 25.141351 },
      { url: "photos/neeme/03.jpg", caption: "", lat: 59.475870, lng: 25.152426 },
      { url: "photos/neeme/04.jpg", caption: "", lat: 59.486710, lng: 25.162695 },
      { url: "photos/neeme/05.jpg", caption: "", lat: 59.501093, lng: 25.183969 }
    ]
  }
];

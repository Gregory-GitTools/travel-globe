// Список поездок. Чтобы добавить свою поездку — скопируйте один блок { ... }
// и заполните своими данными. lat/lng можно найти, кликнув правой кнопкой
// на точке на Google Maps.
const trips = [
  {
    city: "Париж",
    country: "Франция",
    lat: 48.8566,
    lng: 2.3522,
    date: "Май 2024",
    title: "Весна в Париже",
    notes: "Прогулка вдоль Сены, круассаны по утрам и вид на город с Монмартра.",
    cover: "https://picsum.photos/seed/paris/200/200",
    photos: [
      "https://picsum.photos/seed/paris1/400/300",
      "https://picsum.photos/seed/paris2/400/300",
      "https://picsum.photos/seed/paris3/400/300"
    ]
  },
  {
    city: "Токио",
    country: "Япония",
    lat: 35.6762,
    lng: 139.6503,
    date: "Октябрь 2023",
    title: "Осень в Токио",
    notes: "Неон Синдзюку, тишина храма Мэйдзи и лучший рамен в жизни.",
    cover: "https://picsum.photos/seed/tokyo/200/200",
    photos: [
      "https://picsum.photos/seed/tokyo1/400/300",
      "https://picsum.photos/seed/tokyo2/400/300",
      "https://picsum.photos/seed/tokyo3/400/300"
    ]
  },
  {
    city: "Кейптаун",
    country: "ЮАР",
    lat: -33.9249,
    lng: 18.4241,
    date: "Февраль 2023",
    title: "На краю Африки",
    notes: "Подъём на Столовую гору, пингвины на пляже Боулдерс и закат на мысе Доброй Надежды.",
    cover: "https://picsum.photos/seed/capetown/200/200",
    photos: [
      "https://picsum.photos/seed/capetown1/400/300",
      "https://picsum.photos/seed/capetown2/400/300",
      "https://picsum.photos/seed/capetown3/400/300"
    ]
  },
  {
    city: "Рио-де-Жанейро",
    country: "Бразилия",
    lat: -22.9068,
    lng: -43.1729,
    date: "Январь 2023",
    title: "Карнавал и пляжи",
    notes: "Копакабана на рассвете, статуя Христа-Искупителя в облаках и самба до утра.",
    cover: "https://picsum.photos/seed/rio/200/200",
    photos: [
      "https://picsum.photos/seed/rio1/400/300",
      "https://picsum.photos/seed/rio2/400/300",
      "https://picsum.photos/seed/rio3/400/300"
    ]
  }
];

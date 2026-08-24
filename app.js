const globe = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
  .htmlElementsData(trips)
  .htmlLat('lat')
  .htmlLng('lng')
  .htmlElement(trip => {
    const el = document.createElement('div');
    el.className = 'photo-pin';
    el.style.backgroundImage = `url(${trip.cover})`;
    el.style.pointerEvents = 'auto';
    el.title = `${trip.city}, ${trip.country}`;
    el.onclick = () => openTrip(trip);
    return el;
  });

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.4;

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const weekdayLetters = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dateRange(startStr, endStr) {
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const dates = [];
  let d = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  while (d <= end) {
    dates.push(formatDateLocal(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

const dayToTrip = {};
trips.forEach((trip, tripIndex) => {
  dateRange(trip.startDate, trip.endDate).forEach(dateStr => {
    if (!(dateStr in dayToTrip)) dayToTrip[dateStr] = tripIndex;
  });
});
const tripMonths = Array.from(new Set(Object.keys(dayToTrip).map(d => d.slice(0, 7)))).sort();

const calendarModal = document.getElementById('calendarModal');
const calendarModalContent = calendarModal.querySelector('.modal-content');
const calendarModalClose = document.getElementById('calendarModalClose');
const calendarPrev = document.getElementById('calendarPrev');
const calendarNext = document.getElementById('calendarNext');
const calendarMonthSelect = document.getElementById('calendarMonthSelect');
const calendarYearSelect = document.getElementById('calendarYearSelect');
const calendarViewMonth = document.getElementById('calendarViewMonth');
const calendarViewYear = document.getElementById('calendarViewYear');
const calendarWeekdaysRow = document.getElementById('calendarWeekdays');
const calendarGrid = document.getElementById('calendarGrid');
const calendarYearGrid = document.getElementById('calendarYearGrid');

monthNames.forEach((name, i) => {
  const opt = document.createElement('option');
  opt.value = String(i + 1).padStart(2, '0');
  opt.textContent = name;
  calendarMonthSelect.appendChild(opt);
});

const tripYears = tripMonths.map(m => Number(m.slice(0, 4)));
const thisYear = new Date().getFullYear();
const minCalendarYear = Math.min(thisYear, ...tripYears) - 1;
const maxCalendarYear = Math.max(thisYear, ...tripYears) + 2;
for (let y = minCalendarYear; y <= maxCalendarYear; y++) {
  const opt = document.createElement('option');
  opt.value = String(y);
  opt.textContent = String(y);
  calendarYearSelect.appendChild(opt);
}

let currentCalendarMonth = tripMonths[0] || formatDateLocal(new Date()).slice(0, 7);
let calendarViewMode = 'month';

function fillDayGrid(container, year, month) {
  container.innerHTML = '';
  const firstOfMonth = new Date(year, month - 1, 1);
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  for (let i = 0; i < leadingBlanks; i++) {
    container.appendChild(document.createElement('div'));
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.textContent = day;
    if (dateStr in dayToTrip) {
      cell.classList.add('travel-day');
      const trip = trips[dayToTrip[dateStr]];
      cell.title = `${trip.city}, ${trip.country}`;
      cell.onclick = () => {
        closeCalendarModal();
        focusTrip(dayToTrip[dateStr]);
      };
    }
    container.appendChild(cell);
  }
}

function renderCalendarMonth() {
  const [year, month] = currentCalendarMonth.split('-').map(Number);
  calendarMonthSelect.value = String(month).padStart(2, '0');
  calendarYearSelect.value = String(year);

  calendarWeekdaysRow.innerHTML = '';
  weekdayLetters.forEach(w => {
    const cell = document.createElement('div');
    cell.textContent = w;
    calendarWeekdaysRow.appendChild(cell);
  });

  fillDayGrid(calendarGrid, year, month);
}

function renderCalendarYear() {
  const year = Number(calendarYearSelect.value);
  calendarYearGrid.innerHTML = '';
  for (let m = 1; m <= 12; m++) {
    const block = document.createElement('div');
    block.className = 'calendar-year-month';

    const header = document.createElement('div');
    header.className = 'calendar-year-month-header';
    header.textContent = monthNames[m - 1];
    header.onclick = () => {
      currentCalendarMonth = `${year}-${String(m).padStart(2, '0')}`;
      setCalendarViewMode('month');
    };
    block.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid calendar-grid-compact';
    block.appendChild(grid);
    fillDayGrid(grid, year, m);

    calendarYearGrid.appendChild(block);
  }
}

function setCalendarViewMode(mode) {
  calendarViewMode = mode;
  calendarViewMonth.classList.toggle('active', mode === 'month');
  calendarViewYear.classList.toggle('active', mode === 'year');
  calendarMonthSelect.classList.toggle('hidden', mode === 'year');
  calendarWeekdaysRow.classList.toggle('hidden', mode === 'year');
  calendarGrid.classList.toggle('hidden', mode === 'year');
  calendarYearGrid.classList.toggle('hidden', mode === 'month');
  calendarModalContent.classList.toggle('wide', mode === 'year');

  if (mode === 'month') {
    renderCalendarMonth();
  } else {
    calendarYearSelect.value = currentCalendarMonth.slice(0, 4);
    renderCalendarYear();
  }
}

function shiftCalendarMonth(delta) {
  const [year, month] = currentCalendarMonth.split('-').map(Number);
  currentCalendarMonth = formatDateLocal(new Date(year, month - 1 + delta, 1)).slice(0, 7);
  renderCalendarMonth();
}

function openCalendarModal() {
  setCalendarViewMode(calendarViewMode);
  calendarModal.classList.remove('hidden');
}

function closeCalendarModal() {
  calendarModal.classList.add('hidden');
}

document.getElementById('openCalendarBtn').onclick = openCalendarModal;
document.getElementById('goTodayBtn').onclick = () => {
  currentCalendarMonth = formatDateLocal(new Date()).slice(0, 7);
  calendarViewMode = 'month';
  openCalendarModal();
};
calendarModalClose.onclick = closeCalendarModal;
calendarModal.onclick = e => { if (e.target === calendarModal) closeCalendarModal(); };
calendarPrev.onclick = () => {
  if (calendarViewMode === 'year') {
    calendarYearSelect.value = String(Number(calendarYearSelect.value) - 1);
    renderCalendarYear();
  } else {
    shiftCalendarMonth(-1);
  }
};
calendarNext.onclick = () => {
  if (calendarViewMode === 'year') {
    calendarYearSelect.value = String(Number(calendarYearSelect.value) + 1);
    renderCalendarYear();
  } else {
    shiftCalendarMonth(1);
  }
};
calendarMonthSelect.onchange = () => {
  currentCalendarMonth = `${calendarYearSelect.value}-${calendarMonthSelect.value}`;
  renderCalendarMonth();
};
calendarYearSelect.onchange = () => {
  if (calendarViewMode === 'year') {
    renderCalendarYear();
  } else {
    currentCalendarMonth = `${calendarYearSelect.value}-${calendarMonthSelect.value}`;
    renderCalendarMonth();
  }
};
calendarViewMonth.onclick = () => setCalendarViewMode('month');
calendarViewYear.onclick = () => setCalendarViewMode('year');

const albumsModal = document.getElementById('albumsModal');
const albumsModalClose = document.getElementById('albumsModalClose');
const albumsSearchText = document.getElementById('albumsSearchText');
const albumsSearchDate = document.getElementById('albumsSearchDate');
const albumsSearchClear = document.getElementById('albumsSearchClear');

function buildAlbums() {
  const container = document.getElementById('albums');
  container.innerHTML = '';

  const textQuery = albumsSearchText.value.trim().toLowerCase();
  const dateQuery = albumsSearchDate.value;

  const filtered = trips
    .map((trip, tripIndex) => ({ trip, tripIndex }))
    .filter(({ trip }) => {
      if (textQuery) {
        const haystack = `${trip.title} ${trip.city} ${trip.country}`.toLowerCase();
        if (!haystack.includes(textQuery)) return false;
      }
      if (dateQuery && !dateRange(trip.startDate, trip.endDate).includes(dateQuery)) {
        return false;
      }
      return true;
    });

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'albums-empty';
    empty.textContent = 'Ничего не найдено';
    container.appendChild(empty);
    return;
  }

  filtered.forEach(({ trip, tripIndex }) => {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.onclick = () => {
      closeAlbumsModal();
      focusTrip(tripIndex);
    };

    const thumb = document.createElement('div');
    thumb.className = 'album-thumb';
    thumb.style.backgroundImage = `url(${trip.cover})`;
    card.appendChild(thumb);

    const info = document.createElement('div');
    info.className = 'album-info';

    const title = document.createElement('div');
    title.className = 'album-title';
    title.textContent = trip.title;
    info.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'album-meta';
    meta.textContent = `${trip.city}, ${trip.country} — ${trip.dateLabel}`;
    info.appendChild(meta);

    const notes = document.createElement('div');
    notes.className = 'album-notes';
    notes.textContent = trip.notes;
    info.appendChild(notes);

    card.appendChild(info);
    container.appendChild(card);
  });
}

function openAlbumsModal() {
  buildAlbums();
  albumsModal.classList.remove('hidden');
}

function closeAlbumsModal() {
  albumsModal.classList.add('hidden');
}

document.getElementById('openAlbumsBtn').onclick = openAlbumsModal;
albumsModalClose.onclick = closeAlbumsModal;
albumsModal.onclick = e => { if (e.target === albumsModal) closeAlbumsModal(); };
albumsSearchText.oninput = () => {
  albumsSearchDate.value = '';
  buildAlbums();
};
albumsSearchDate.onchange = buildAlbums;
albumsSearchClear.onclick = () => {
  albumsSearchText.value = '';
  albumsSearchDate.value = '';
  buildAlbums();
};

function focusTrip(tripIndex) {
  const trip = trips[tripIndex];
  globe.pointOfView({ lat: trip.lat, lng: trip.lng, altitude: 1.5 }, 1000);
  openTrip(trip);
}

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalNotes = document.getElementById('modalNotes');
const modalGallery = document.getElementById('modalGallery');
const modalClose = document.getElementById('modalClose');
const modalSpeak = document.getElementById('modalSpeak');
const modalGemini = document.getElementById('modalGemini');
const modalSlideshow = document.getElementById('modalSlideshow');
const modalMap = document.getElementById('modalMap');

let currentTrip = null;

function openTrip(trip) {
  currentTrip = trip;
  globe.controls().autoRotate = false;
  modalTitle.textContent = trip.title;
  modalMeta.textContent = `${trip.city}, ${trip.country} — ${trip.dateLabel}`;
  modalNotes.textContent = trip.notes;
  modalGallery.innerHTML = '';
  trip.photos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.caption || trip.title;
    img.onclick = () => openLightbox(index);
    item.appendChild(img);

    if (photo.caption) {
      const caption = document.createElement('div');
      caption.className = 'gallery-caption';
      caption.textContent = photo.caption;
      item.appendChild(caption);
    }

    modalGallery.appendChild(item);
  });
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  globe.controls().autoRotate = true;
  speechSynthesis.cancel();
  modalSpeak.textContent = '🔊';
}

modalClose.onclick = closeModal;
modal.onclick = e => {
  if (e.target === modal) closeModal();
};

modalSpeak.onclick = () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    modalSpeak.textContent = '🔊';
    return;
  }
  const utterance = new SpeechSynthesisUtterance(`${currentTrip.title}. ${currentTrip.notes}`);
  utterance.lang = 'ru-RU';
  utterance.onend = () => { modalSpeak.textContent = '🔊'; };
  modalSpeak.textContent = '⏸';
  speechSynthesis.speak(utterance);
};

modalGemini.onclick = async () => {
  const question = `Расскажи подробнее о поездке: ${currentTrip.title} (${currentTrip.city}, ${currentTrip.country}). ${currentTrip.notes}`;
  try {
    await navigator.clipboard.writeText(question);
    const original = modalGemini.textContent;
    modalGemini.textContent = 'Скопировано! Вставьте, если запрос не подставился сам';
    setTimeout(() => { modalGemini.textContent = original; }, 4000);
  } catch (e) {
    // clipboard недоступен (например, при просмотре файла локально) — просто откроем Gemini
  }
  // Пробуем передать текст прямо в адресе — если Gemini не подхватит параметр,
  // вопрос всё равно уже скопирован в буфер обмена (см. выше).
  window.open(`https://gemini.google.com/app?q=${encodeURIComponent(question)}`, '_blank');
};

modalSlideshow.onclick = () => {
  if (!currentTrip || !currentTrip.photos.length) return;
  openLightbox(0);
  toggleSlideshow();
};

modalMap.onclick = () => {
  if (!currentTrip) return;
  openAlbumMap(currentTrip);
};

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxSlideshow = document.getElementById('lightboxSlideshow');
const lightboxMusic = document.getElementById('lightboxMusic');
const lightboxGemini = document.getElementById('lightboxGemini');
const lightboxMap = document.getElementById('lightboxMap');

let currentPhotoIndex = 0;
let slideshowTimer = null;

function updateLightboxPhoto() {
  const photo = currentTrip.photos[currentPhotoIndex];
  lightboxImg.src = photo.url;
  lightboxCaption.textContent = photo.caption || '';
  lightboxCaption.classList.toggle('hidden', !photo.caption);
}

const bgAudio = new Audio();
bgAudio.loop = true;

const toolbarMute = document.getElementById('toolbarMute');
toolbarMute.onclick = () => {
  bgAudio.muted = !bgAudio.muted;
  toolbarMute.textContent = bgAudio.muted ? '🔇' : '🔊';
  toolbarMute.title = bgAudio.muted ? 'Звук сайта выключен — нажмите, чтобы включить' : 'Звук сайта: вкл/выкл';
};

function getTripMusicUrl(trip) {
  if (!trip.music) return null;
  if (trip.music === 'random') {
    return musicLibrary[Math.floor(Math.random() * musicLibrary.length)];
  }
  return trip.music;
}

function stopMusic() {
  bgAudio.pause();
  lightboxMusic.innerHTML = '&#127925; Музыка';
  lightboxMusic.classList.remove('active');
}

function toggleMusic() {
  if (!bgAudio.paused) {
    stopMusic();
    return;
  }
  const url = getTripMusicUrl(currentTrip);
  if (!url) return;
  if (!bgAudio.src.endsWith(url)) {
    bgAudio.src = url;
  }
  bgAudio.play();
  lightboxMusic.innerHTML = '&#10074;&#10074; Музыка';
  lightboxMusic.classList.add('active');
}

lightboxMusic.onclick = toggleMusic;

lightboxGemini.onclick = async () => {
  const photo = currentTrip.photos[currentPhotoIndex];
  const photoUrl = new URL(photo.url, location.href).href;
  const captionPart = photo.caption ? ` Подпись к фото: ${photo.caption}.` : '';
  const question = `Посмотри на фото поездки "${currentTrip.title}" (${currentTrip.city}, ${currentTrip.country}): ${photoUrl}.${captionPart} Расскажи, что интересного может быть на этом фото.`;
  try {
    await navigator.clipboard.writeText(question);
    const original = lightboxGemini.textContent;
    lightboxGemini.textContent = 'Скопировано! Вставьте, если запрос не подставился сам';
    setTimeout(() => { lightboxGemini.textContent = original; }, 4000);
  } catch (e) {
    // clipboard недоступен (например, при просмотре файла локально) — просто откроем Gemini
  }
  window.open(`https://gemini.google.com/app?q=${encodeURIComponent(question)}`, '_blank');
};

function toggleLightboxFullscreen() {
  if (!document.fullscreenElement) {
    lightbox.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

lightboxImg.addEventListener('dblclick', toggleLightboxFullscreen);

function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentTrip.photos.length;
  updateLightboxPhoto();
}

function showPrevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentTrip.photos.length) % currentTrip.photos.length;
  updateLightboxPhoto();
}

function stopSlideshow() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    lightboxSlideshow.innerHTML = '&#9654; Слайдшоу';
  }
}

function toggleSlideshow() {
  if (slideshowTimer) {
    stopSlideshow();
  } else {
    slideshowTimer = setInterval(showNextPhoto, 3000);
    lightboxSlideshow.innerHTML = '&#10074;&#10074; Слайдшоу';
    if (!document.fullscreenElement) {
      lightbox.requestFullscreen().catch(() => {});
    }
  }
}

function openLightbox(index) {
  currentPhotoIndex = index;
  updateLightboxPhoto();
  lightbox.classList.remove('hidden');
  lightboxMusic.classList.toggle('hidden', !currentTrip.music);
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
  stopSlideshow();
  stopMusic();
  if (document.fullscreenElement) document.exitFullscreen();
}

lightboxClose.onclick = closeLightbox;
lightbox.onclick = e => {
  if (e.target === lightbox) closeLightbox();
};
lightboxPrev.onclick = () => { showPrevPhoto(); stopSlideshow(); };
lightboxNext.onclick = () => { showNextPhoto(); stopSlideshow(); };
lightboxSlideshow.onclick = toggleSlideshow;

document.addEventListener('keydown', e => {
  if (!mapModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closeAlbumMap();
    return;
  }
  if (!calendarModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closeCalendarModal();
    return;
  }
  if (!albumsModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closeAlbumsModal();
    return;
  }
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') { showNextPhoto(); stopSlideshow(); }
  if (e.key === 'ArrowLeft') { showPrevPhoto(); stopSlideshow(); }
  if (e.key === 'Escape') closeLightbox();
});

let wheelCooldown = false;
lightbox.addEventListener('wheel', e => {
  e.preventDefault();
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 400);
  if (e.deltaY > 0) showNextPhoto(); else showPrevPhoto();
  stopSlideshow();
}, { passive: false });

// Карта альбома: собираем точки из GPS-координат каждого фото
// (если у фото нет своих координат — используем общую точку поездки).
const mapModal = document.getElementById('mapModal');
const mapModalClose = document.getElementById('mapModalClose');
let albumMap = null;
let albumMapMarkers = [];

function getTripPoints(trip) {
  const points = trip.photos
    .filter(photo => typeof photo.lat === 'number' && typeof photo.lng === 'number')
    .map(photo => ({ lat: photo.lat, lng: photo.lng, caption: photo.caption }));
  return points.length ? points : [{ lat: trip.lat, lng: trip.lng, caption: trip.title }];
}

function openAlbumMap(trip) {
  mapModal.classList.remove('hidden');
  if (!albumMap) {
    albumMap = L.map('albumMap');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(albumMap);
  }
  albumMapMarkers.forEach(marker => albumMap.removeLayer(marker));
  const points = getTripPoints(trip);
  albumMapMarkers = points.map(p => L.marker([p.lat, p.lng]).addTo(albumMap).bindPopup(p.caption || trip.title));
  setTimeout(() => {
    albumMap.invalidateSize();
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    albumMap.fitBounds(bounds.pad(0.3));
  }, 50);
}

function closeAlbumMap() {
  mapModal.classList.add('hidden');
}

mapModalClose.onclick = closeAlbumMap;
mapModal.onclick = e => {
  if (e.target === mapModal) closeAlbumMap();
};

lightboxMap.onclick = () => {
  if (!currentTrip) return;
  openAlbumMap(currentTrip);
};

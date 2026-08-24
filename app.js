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

function buildCalendar() {
  const dayToTrip = {};
  trips.forEach((trip, tripIndex) => {
    dateRange(trip.startDate, trip.endDate).forEach(dateStr => {
      if (!(dateStr in dayToTrip)) dayToTrip[dateStr] = tripIndex;
    });
  });

  const months = new Set();
  Object.keys(dayToTrip).forEach(dateStr => months.add(dateStr.slice(0, 7)));
  const sortedMonths = Array.from(months).sort();

  const container = document.getElementById('calendar');
  container.innerHTML = '';

  sortedMonths.forEach(monthKey => {
    const [year, month] = monthKey.split('-').map(Number);
    const block = document.createElement('div');
    block.className = 'calendar-month';

    const header = document.createElement('div');
    header.className = 'calendar-month-header';
    header.textContent = `${monthNames[month - 1]} ${year}`;
    block.appendChild(header);

    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'calendar-grid calendar-weekdays';
    weekdayLetters.forEach(w => {
      const cell = document.createElement('div');
      cell.textContent = w;
      weekdaysRow.appendChild(cell);
    });
    block.appendChild(weekdaysRow);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    const firstOfMonth = new Date(year, month - 1, 1);
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first
    for (let i = 0; i < leadingBlanks; i++) {
      grid.appendChild(document.createElement('div'));
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = day;
      if (dateStr in dayToTrip) {
        cell.classList.add('travel-day');
        const trip = trips[dayToTrip[dateStr]];
        cell.title = `${trip.city}, ${trip.country}`;
        cell.onclick = () => focusTrip(dayToTrip[dateStr]);
      }
      grid.appendChild(cell);
    }

    block.appendChild(grid);
    container.appendChild(block);
  });
}

function buildAlbums() {
  const container = document.getElementById('albums');
  container.innerHTML = '';

  trips.forEach((trip, tripIndex) => {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.onclick = () => focusTrip(tripIndex);

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

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxSlideshow = document.getElementById('lightboxSlideshow');
const lightboxMap = document.getElementById('lightboxMap');

let currentPhotoIndex = 0;
let slideshowTimer = null;

function updateLightboxPhoto() {
  const photo = currentTrip.photos[currentPhotoIndex];
  lightboxImg.src = photo.url;
  lightboxCaption.textContent = photo.caption || '';
  lightboxCaption.classList.toggle('hidden', !photo.caption);
}

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
  }
}

function openLightbox(index) {
  currentPhotoIndex = index;
  updateLightboxPhoto();
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
  stopSlideshow();
}

lightboxClose.onclick = closeLightbox;
lightbox.onclick = e => {
  if (e.target === lightbox) closeLightbox();
};
lightboxPrev.onclick = () => { showPrevPhoto(); stopSlideshow(); };
lightboxNext.onclick = () => { showNextPhoto(); stopSlideshow(); };
lightboxSlideshow.onclick = toggleSlideshow;

document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') { showNextPhoto(); stopSlideshow(); }
  if (e.key === 'ArrowLeft') { showPrevPhoto(); stopSlideshow(); }
  if (e.key === 'Escape') closeLightbox();
});

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

buildCalendar();
buildAlbums();

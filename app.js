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
  trip.photos.forEach(photo => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.caption || trip.title;
    img.onclick = () => openLightbox(photo.url, photo.caption);
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
    modalGemini.textContent = 'Скопировано! Вставьте в чат Gemini';
    setTimeout(() => { modalGemini.textContent = original; }, 3000);
  } catch (e) {
    // clipboard недоступен (например, при просмотре файла локально) — просто откроем Gemini
  }
  window.open('https://gemini.google.com/app', '_blank');
};

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxMap = document.getElementById('lightboxMap');

lightboxMap.onclick = () => {
  if (!currentTrip) return;
  window.open(`https://www.google.com/maps?q=${currentTrip.lat},${currentTrip.lng}`, '_blank');
};

function openLightbox(url, caption) {
  lightboxImg.src = url;
  lightboxCaption.textContent = caption || '';
  lightboxCaption.classList.toggle('hidden', !caption);
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
}

lightboxClose.onclick = closeLightbox;
lightbox.onclick = e => {
  if (e.target === lightbox) closeLightbox();
};

buildCalendar();
buildAlbums();

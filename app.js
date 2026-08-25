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

// Lets the mouse wheel scroll a modal's body no matter where over the
// browser window the cursor is — including the dark backdrop area
// outside the modal card itself — while the header (title/description/
// buttons) stays static. `overlay` is the full-viewport `.modal` element
// (not just the card), since that's the only ancestor that actually
// receives wheel events fired over the backdrop. `skipSelector` lets a
// sub-area (e.g. the calendar's own month/year wheel navigation) keep
// its own wheel behaviour instead of being hijacked.
function makeWheelScrollable(overlay, body, skipSelector) {
  overlay.addEventListener('wheel', e => {
    if (body.contains(e.target)) return;
    if (skipSelector && e.target.closest(skipSelector)) return;
    e.preventDefault();
    body.scrollTop += e.deltaY;
  }, { passive: false });
}

const dayToTrip = {};
trips.forEach((trip, tripIndex) => {
  dateRange(trip.startDate, trip.endDate).forEach(dateStr => {
    if (!(dateStr in dayToTrip)) dayToTrip[dateStr] = tripIndex;
  });
});
const todayStr = formatDateLocal(new Date());
const tripDates = Object.keys(dayToTrip).sort();

const calendarPrev = document.getElementById('calendarPrev');
const calendarNext = document.getElementById('calendarNext');
const calendarDayBtn = document.getElementById('calendarDayBtn');
const calendarDayList = document.getElementById('calendarDayList');
const calendarMonthBtn = document.getElementById('calendarMonthBtn');
const calendarMonthList = document.getElementById('calendarMonthList');
const calendarYearBtn = document.getElementById('calendarYearBtn');
const calendarYearList = document.getElementById('calendarYearList');
const calendarWeekdaysRow = document.getElementById('calendarWeekdays');
const calendarGrid = document.getElementById('calendarGrid');

// Custom dark dropdowns replace native <select> — Chrome/Edge on Windows
// render a native <select>'s open popup list with an OS-controlled white
// background that page CSS cannot restyle, which looked out of place here.
monthNames.forEach((name, i) => {
  const item = document.createElement('div');
  item.className = 'calendar-dd-item';
  item.dataset.value = String(i + 1).padStart(2, '0');
  item.textContent = name;
  item.onclick = () => {
    const [year, , day] = selectedDate.split('-');
    setSelectedDate(`${year}-${item.dataset.value}-${day}`);
    closeCalendarDropdowns();
  };
  calendarMonthList.appendChild(item);
});

function closeCalendarDropdowns() {
  calendarDayList.classList.add('hidden');
  calendarMonthList.classList.add('hidden');
  calendarYearList.classList.add('hidden');
}

function toggleCalendarDropdown(list) {
  const wasOpen = !list.classList.contains('hidden');
  closeCalendarDropdowns();
  if (!wasOpen) list.classList.remove('hidden');
}

calendarDayBtn.onclick = e => { e.stopPropagation(); setCalendarCollapsed(false); toggleCalendarDropdown(calendarDayList); };
calendarMonthBtn.onclick = e => { e.stopPropagation(); setCalendarCollapsed(false); toggleCalendarDropdown(calendarMonthList); };
calendarYearBtn.onclick = e => { e.stopPropagation(); setCalendarCollapsed(false); toggleCalendarDropdown(calendarYearList); };
document.addEventListener('click', closeCalendarDropdowns);

function rebuildDayList(daysInMonth, activeDay) {
  calendarDayList.innerHTML = '';
  for (let d = 1; d <= daysInMonth; d++) {
    const item = document.createElement('div');
    item.className = 'calendar-dd-item';
    if (d === activeDay) item.classList.add('active');
    item.textContent = String(d);
    item.onclick = () => {
      const [year, month] = selectedDate.split('-');
      setSelectedDate(`${year}-${month}-${String(d).padStart(2, '0')}`);
      closeCalendarDropdowns();
    };
    calendarDayList.appendChild(item);
  }
}

function rebuildYearList(activeYear) {
  calendarYearList.innerHTML = '';
  for (let y = activeYear - 6; y <= activeYear + 6; y++) {
    const item = document.createElement('div');
    item.className = 'calendar-dd-item';
    if (y === activeYear) item.classList.add('active');
    item.textContent = String(y);
    item.onclick = () => {
      const [, month, day] = selectedDate.split('-');
      setSelectedDate(`${y}-${month}-${day}`);
      closeCalendarDropdowns();
    };
    calendarYearList.appendChild(item);
  }
}

function setDayLabel(day) {
  calendarDayBtn.textContent = String(day);
  calendarDayList.querySelectorAll('.calendar-dd-item').forEach(el => {
    el.classList.toggle('active', el.textContent === String(day));
  });
}

function setMonthLabel(month) {
  calendarMonthBtn.textContent = monthNames[month - 1];
  calendarMonthList.querySelectorAll('.calendar-dd-item').forEach(el => {
    el.classList.toggle('active', el.dataset.value === String(month).padStart(2, '0'));
  });
}

function setYearLabel(year) {
  calendarYearBtn.textContent = String(year);
  rebuildYearList(year);
}

let selectedDate = todayStr;

function fillDayGrid(container, year, month) {
  container.innerHTML = '';
  const blankCell = () => {
    const cell = document.createElement('div');
    cell.className = 'calendar-day calendar-day-blank';
    return cell;
  };

  const firstOfMonth = new Date(year, month - 1, 1);
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  for (let i = 0; i < leadingBlanks; i++) {
    container.appendChild(blankCell());
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
        setSelectedDate(dateStr);
        albumsSearchText.value = trip.title;
        buildAlbums();
      };
    }
    if (dateStr === todayStr) cell.classList.add('today');
    if (dateStr === selectedDate && (dateStr in dayToTrip || dateStr === todayStr)) cell.classList.add('focused');
    container.appendChild(cell);
  }

  // Always pad to 6 full rows (same aspect-ratio as real day cells) so the
  // grid height never changes between months — a jumping modal height was
  // disorienting when re-centered vertically.
  const totalCells = leadingBlanks + daysInMonth;
  for (let i = totalCells; i < 42; i++) {
    container.appendChild(blankCell());
  }

  return daysInMonth;
}

function renderCalendarMonth() {
  const [year, month, day] = selectedDate.split('-').map(Number);
  setDayLabel(day);
  setMonthLabel(month);
  setYearLabel(year);

  calendarWeekdaysRow.innerHTML = '';
  weekdayLetters.forEach(w => {
    const cell = document.createElement('div');
    cell.textContent = w;
    calendarWeekdaysRow.appendChild(cell);
  });

  const daysInMonth = fillDayGrid(calendarGrid, year, month);
  rebuildDayList(daysInMonth, day);
}

function setSelectedDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const clampedDay = Math.min(day, daysInMonth);
  selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
  renderCalendarMonth();
}

// Steps between real travel dates only (blue cells), clamped to the
// dataset's earliest/latest trip date — used by the prev/next arrows and
// wheel scroll so navigation never lands on an empty day.
function shiftSelectedDate(delta) {
  if (!tripDates.length) return;
  let target;
  if (delta > 0) {
    const next = tripDates.find(d => d > selectedDate);
    target = next || tripDates[tripDates.length - 1];
  } else {
    const earlier = tripDates.filter(d => d < selectedDate);
    target = earlier.length ? earlier[earlier.length - 1] : tripDates[0];
  }
  setSelectedDate(target);
  albumsSearchText.value = trips[dayToTrip[target]].title;
  buildAlbums();
}

document.getElementById('goTodayBtn').onclick = () => {
  setSelectedDate(todayStr);
  albumsSearchText.value = '';
  buildAlbums();
};
calendarPrev.onclick = () => shiftSelectedDate(-1);
calendarNext.onclick = () => shiftSelectedDate(1);

// Mouse-wheel navigation on the nav row, replacing the need to click the
// arrows; skipped while an open dropdown list is under the cursor so a
// long list can still be scrolled normally.
let calendarWheelBusy = false;
document.getElementById('albumsCalendar').addEventListener('wheel', e => {
  if (e.target.closest('.calendar-dd-list')) return;
  e.preventDefault();
  e.stopPropagation();
  if (calendarWheelBusy) return;
  calendarWheelBusy = true;
  setTimeout(() => { calendarWheelBusy = false; }, 220);
  shiftSelectedDate(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

// Свайп на телефоне: горизонтальный свайп листает даты, так же как
// колесо мыши на десктопе (свайп влево — вперёд, вправо — назад).
let calendarTouchStartX = 0;
let calendarTouchStartY = 0;
document.getElementById('albumsCalendar').addEventListener('touchstart', e => {
  calendarTouchStartX = e.changedTouches[0].clientX;
  calendarTouchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.getElementById('albumsCalendar').addEventListener('touchend', e => {
  if (e.target.closest('.calendar-dd-list')) return;
  const dx = e.changedTouches[0].clientX - calendarTouchStartX;
  const dy = e.changedTouches[0].clientY - calendarTouchStartY;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  shiftSelectedDate(dx < 0 ? 1 : -1);
}, { passive: true });

const albumsModal = document.getElementById('albumsModal');
const albumsModalClose = document.getElementById('albumsModalClose');
const albumsModalBody = albumsModal.querySelector('.modal-body');
const albumsCalendarEl = document.getElementById('albumsCalendar');
const calendarBodyEl = document.getElementById('calendarBody');
const albumsCalendarToggle = document.getElementById('albumsCalendarToggle');
const albumsSearchText = document.getElementById('albumsSearchText');
const albumsSearchClear = document.getElementById('albumsSearchClear');
let calendarCollapsed = false;

function setCalendarCollapsed(collapsed) {
  calendarCollapsed = collapsed;
  calendarBodyEl.classList.toggle('collapsed', collapsed);
  albumsCalendarToggle.textContent = collapsed ? '📅' : '🔼';
}

makeWheelScrollable(albumsModal, albumsModalBody, '#albumsCalendar');

function buildAlbums() {
  const container = document.getElementById('albums');
  container.innerHTML = '';

  const textQuery = albumsSearchText.value.trim().toLowerCase();

  const filtered = trips
    .map((trip, tripIndex) => ({ trip, tripIndex }))
    .filter(({ trip }) => {
      if (textQuery) {
        const haystack = `${trip.title} ${trip.city} ${trip.country}`.toLowerCase();
        const words = textQuery.split(/\s+/).filter(Boolean);
        if (!words.every(w => haystack.includes(w))) return false;
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
  setSelectedDate(todayStr);
  setCalendarCollapsed(false);
  buildAlbums();
  albumsModal.classList.remove('hidden');
}

function closeAlbumsModal() {
  albumsModal.classList.add('hidden');
}

document.getElementById('openAlbumsBtn').onclick = openAlbumsModal;
albumsModalClose.onclick = closeAlbumsModal;
albumsModal.onclick = e => { if (e.target === albumsModal) closeAlbumsModal(); };
albumsCalendarToggle.onclick = () => setCalendarCollapsed(!calendarCollapsed);
albumsSearchText.oninput = buildAlbums;
albumsSearchClear.onclick = () => {
  albumsSearchText.value = '';
  buildAlbums();
};

function focusTrip(tripIndex) {
  const trip = trips[tripIndex];
  globe.pointOfView({ lat: trip.lat, lng: trip.lng, altitude: 1.5 }, 1000);
  openTrip(trip);
}

const modal = document.getElementById('modal');
const modalBody = modal.querySelector('.modal-body');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalNotes = document.getElementById('modalNotes');
const modalGallery = document.getElementById('modalGallery');
const modalClose = document.getElementById('modalClose');
const modalSpeak = document.getElementById('modalSpeak');
const modalGeminiText = document.getElementById('modalGeminiText');
const modalGeminiPhoto = document.getElementById('modalGeminiPhoto');
const modalSlideshow = document.getElementById('modalSlideshow');
const modalMap = document.getElementById('modalMap');

makeWheelScrollable(modal, modalBody);

let currentTrip = null;

function openTrip(trip) {
  currentTrip = trip;
  globe.controls().autoRotate = false;
  modalTitle.textContent = trip.title;
  modalMeta.textContent = trip.dateLabel;
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

// Gemini не читает адрес страницы и не подхватывает текст из параметра ?q=,
// а буфер обмена с двумя представлениями (картинка + текст) при вставке
// (Ctrl+V) отдаёт получателю только ОДНО из них на выбор приложения — не оба
// сразу. Поэтому вопрос текстом и вопрос с фото — это две разные кнопки:
// одна копирует только текст, другая — только фото.
async function copyGeminiText(button, text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // clipboard недоступен (например, при просмотре файла локально)
  }
  const original = button.textContent;
  button.textContent = 'Скопировано! Вставьте текст в Gemini (Ctrl+V)';
  setTimeout(() => { button.textContent = original; }, 4000);
  // Gemini не подхватывает текст из параметра ?q= (проверено — работает не
  // всегда и не для всех поездок), поэтому просто открываем чат для вставки.
  window.open('https://gemini.google.com/app', '_blank');
}

async function copyGeminiPhoto(button, promptText, imgUrl) {
  let imageCopied = false;
  try {
    const resp = await fetch(imgUrl);
    const blob = await resp.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
    imageCopied = true;
  } catch (e) {
    // копирование картинки не поддерживается браузером
  }
  const original = button.textContent;
  button.textContent = imageCopied
    ? `Фото скопировано! Вставьте (Ctrl+V) и допишите: «${promptText}»`
    : 'Не удалось скопировать фото';
  setTimeout(() => { button.textContent = original; }, 6000);
  window.open('https://gemini.google.com/app', '_blank');
}

modalGeminiText.onclick = async () => {
  const question = `Расскажи и прочитай про это место: ${currentTrip.title} (${currentTrip.city}, ${currentTrip.country}). ${currentTrip.notes}`;
  await copyGeminiText(modalGeminiText, question);
};

modalGeminiPhoto.onclick = async () => {
  const prompt = `Расскажи и прочитай по скриншоту окна: поездка "${currentTrip.title}" (${currentTrip.city}, ${currentTrip.country}).`;
  await copyGeminiPhoto(modalGeminiPhoto, prompt, currentTrip.cover);
};

modalSlideshow.onclick = () => {
  if (!currentTrip || !currentTrip.photos.length) return;
  openLightbox(0);
  toggleSlideshow();
};

modalMap.onclick = () => {
  if (!currentTrip) return;
  stopSlideshow();
  openAlbumMapWindow(currentTrip);
};

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxSlideshow = document.getElementById('lightboxSlideshow');
const lightboxGeminiText = document.getElementById('lightboxGeminiText');
const lightboxGeminiPhoto = document.getElementById('lightboxGeminiPhoto');
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

let siteSoundOn = true;

const toolbarMute = document.getElementById('toolbarMute');
toolbarMute.onclick = () => {
  siteSoundOn = !siteSoundOn;
  toolbarMute.textContent = siteSoundOn ? '🔊' : '🔇';
  toolbarMute.title = siteSoundOn ? 'Звук сайта: вкл/выкл' : 'Звук сайта выключен — нажмите, чтобы включить';
  if (!siteSoundOn) {
    bgAudio.pause();
  } else if (bgAudio.src) {
    bgAudio.play();
  }
};

function getTripMusicUrl(trip) {
  if (trip.music && trip.music !== 'random') return trip.music;
  return musicLibrary[Math.floor(Math.random() * musicLibrary.length)];
}

function stopMusic() {
  bgAudio.pause();
}

function playMusicForTrip(trip) {
  const url = getTripMusicUrl(trip);
  if (!url) return;
  if (!bgAudio.src.endsWith(url)) {
    bgAudio.src = url;
  }
  if (!siteSoundOn) {
    siteSoundOn = true;
    toolbarMute.textContent = '🔊';
    toolbarMute.title = 'Звук сайта: вкл/выкл';
  }
  bgAudio.play();
}

lightboxGeminiText.onclick = async () => {
  const photo = currentTrip.photos[currentPhotoIndex];
  const captionPart = photo.caption ? ` Подпись к фото: ${photo.caption}.` : '';
  const question = `Расскажи и прочитай про это место: поездка "${currentTrip.title}" (${currentTrip.city}, ${currentTrip.country}).${captionPart}`;
  await copyGeminiText(lightboxGeminiText, question);
};

lightboxGeminiPhoto.onclick = async () => {
  // Gemini не может сам открыть ссылку на фото сайта (не индексируется извне) —
  // поэтому копируем само фото в буфер обмена (image/png).
  const photo = currentTrip.photos[currentPhotoIndex];
  const captionPart = photo.caption ? ` Подпись к фото: ${photo.caption}.` : '';
  const prompt = `Расскажи и прочитай по скриншоту окна: поездка "${currentTrip.title}" (${currentTrip.city}, ${currentTrip.country}).${captionPart}`;
  await copyGeminiPhoto(lightboxGeminiPhoto, prompt, photo.url);
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
    lightboxSlideshow.innerHTML = '&#127909; Слайдшоу';
    stopMusic();
  }
}

function toggleSlideshow() {
  if (slideshowTimer) {
    stopSlideshow();
  } else {
    slideshowTimer = setInterval(showNextPhoto, 3000);
    lightboxSlideshow.innerHTML = '&#9209; Остановить';
    if (!document.fullscreenElement) {
      lightbox.requestFullscreen().catch(() => {});
    }
    playMusicForTrip(currentTrip);
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

// Свайп на телефоне: горизонтальный свайп листает фото, если он заметно
// более горизонтальный, чем вертикальный (иначе это просто скролл/тап).
let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  if (dx < 0) showNextPhoto(); else showPrevPhoto();
  stopSlideshow();
}, { passive: true });

// Карта альбома открывается в отдельном окне (map.html), которое само
// строит точки из GPS-координат фото и подсвечивает выбранное фото,
// если оно указано (переход из просмотра конкретного фото в лайтбоксе).
function openAlbumMapWindow(trip, photoIndex) {
  const tripIndex = trips.indexOf(trip);
  let url = `map.html?trip=${tripIndex}`;
  if (typeof photoIndex === 'number') url += `&photo=${photoIndex}`;
  // Именованное окно: повторные клики обновляют уже открытую карту вместо
  // открытия новой вкладки каждый раз.
  window.open(url, 'travelGlobeMap', 'width=960,height=720');
}

lightboxMap.onclick = () => {
  if (!currentTrip) return;
  stopSlideshow();
  openAlbumMapWindow(currentTrip, currentPhotoIndex);
};

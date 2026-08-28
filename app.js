const globe = Globe()(document.getElementById('globeViz'))
  // Локальная текстура 4096×2048 (Solar System Scope, CC BY 4.0, textures/README.md) —
  // вчетверо детальнее дефолтной earth-blue-marble.jpg от three-globe (2048×1024).
  .globeImageUrl('textures/earth-daymap-4k.jpg')
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
    el.onclick = () => { modalEntryFromAlbums = false; openTrip(trip); };
    return el;
  });

// Стартовая точка обзора — без неё глобус открывается лицом к lat0/lng0
// (Гвинейский залив у Африки), а не к региону, из которого путешествия.
globe.pointOfView({ lat: 52, lng: 19, altitude: 2.5 }, 0);

// globe.gl по умолчанию ограничивает pixel ratio до 2 (Math.min(2,
// devicePixelRatio)) и не включает анизотропную фильтрацию текстуры —
// на телефонах с devicePixelRatio 3 и на пологих углах обзора у горизонта
// глобуса текстура из-за этого выглядит более размытой, чем могла бы.
globe.renderer().setPixelRatio(window.devicePixelRatio);
// Текстура грузится асинхронно (TextureLoader), поэтому .map появляется
// не сразу — ждём её перед тем как включить анизотропную фильтрацию.
const sharpenGlobeTextureInterval = setInterval(() => {
  const globeTexture = globe.globeMaterial().map;
  if (globeTexture) {
    globeTexture.anisotropy = globe.renderer().capabilities.getMaxAnisotropy();
    globeTexture.needsUpdate = true;
    clearInterval(sharpenGlobeTextureInterval);
  }
}, 100);

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.4;

// globe.gl не переразмеривает свой WebGL-канвас сам при изменении размеров
// окна (например, при раскрытии телефона-раскладушки — ширина/высота
// экрана меняются, а канвас остаётся зафиксирован в старом разрешении).
// Подстраиваем канвас под контейнер вручную.
const globeVizEl = document.getElementById('globeViz');
function resizeGlobe() {
  globe.width(globeVizEl.clientWidth);
  globe.height(globeVizEl.clientHeight);
}
window.addEventListener('resize', resizeGlobe);
window.addEventListener('orientationchange', resizeGlobe);
new ResizeObserver(resizeGlobe).observe(globeVizEl);

// Автовращение крутит глобус с постоянной угловой скоростью, поэтому при
// сильном приближении (камера почти у поверхности) та же скорость на экране
// выглядит в разы быстрее и глобус невозможно "поймать" взглядом. Останав-
// ливаем вращение, как только окружность горизонта глобуса выходит за
// пределы поля зрения камеры (весь экран занят ближней поверхностью).
let modalOpenBlockingRotate = false;
let zoomAllowsRotate = true;

// Настройки посетителя (публичная шестерёнка) — хранятся только в
// localStorage конкретного браузера, ничего личного/приватного здесь нет.
const SETTINGS_KEY = 'travelGlobeSettings';
function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
const settings = loadSettings();
let userAutoRotateOff = settings.autoRotate === false;

function applyAutoRotateState() {
  globe.controls().autoRotate = zoomAllowsRotate && !modalOpenBlockingRotate && !inFlatMapMode && !userAutoRotateOff;
}

function checkGlobeZoomRotate() {
  if (inFlatMapMode) return;
  const camera = globe.camera();
  const dist = camera.position.length();
  const globeRadius = globe.getGlobeRadius();
  const halfFovRad = (camera.fov / 2) * Math.PI / 180;
  const horizonThresholdDist = globeRadius / Math.sin(halfFovRad);
  const horizonVisible = dist >= horizonThresholdDist;
  if (horizonVisible !== zoomAllowsRotate) {
    zoomAllowsRotate = horizonVisible;
    applyAutoRotateState();
  }
  // Провал на карту — почти у самой поверхности (небольшой отступ сверх
  // минимально возможной дистанции камеры), а не завязан на горизонт —
  // раньше порог был в разы дальше от поверхности, и зум на глобусе
  // "упирался" в провал на карту задолго до реального приближения.
  const diveThresholdDist = globe.controls().minDistance + globeRadius * 0.03;
  if (dist <= diveThresholdDist) descendToMap();
}
setInterval(checkGlobeZoomRotate, 250);

// --- Переход глобус -> плоская карта ("сквозь облака") ---

const cloudOverlay = document.getElementById('cloudOverlay');
const flatMapEl = document.getElementById('flatMap');
const flatMapCanvas = document.getElementById('flatMapCanvas');
const toolbarMapToggle = document.getElementById('toolbarMapToggle');
const mapToolsEl = document.getElementById('mapTools');
const mapSearchBarEl = document.getElementById('mapSearchBar');
const mapSearchInput = document.getElementById('mapSearchInput');
const mapSearchBtn = document.getElementById('mapSearchBtn');
const rulerToggleBtn = document.getElementById('rulerToggle');
const rulerClearBtn = document.getElementById('rulerClear');

let inFlatMapMode = false;
let flatMap = null;

// Откуда нырнули на карту (открытая модалка поездки или фото в лайтбоксе) —
// нужно, чтобы кнопка "Назад" знала, куда вернуться, а не всегда на глобус.
let mapEntryContext = null;

// Открыт ли текущий модал поездки из списка альбомов — если да, "Назад"
// должен вернуть на этот список, а не сразу закрывать на глобус/десктоп.
let modalEntryFromAlbums = false;

// Был ли на карте использован поиск места — если да, "Назад" ведёт в список
// альбомов (без фильтров), а не туда, откуда нырнули на карту изначально.
let mapSearchUsed = false;

function ensureFlatMap() {
  if (flatMap) return flatMap;
  // #flatMap остаётся смонтированным с реальными размерами (скрыт только
  // через opacity/pointer-events, не display:none), поэтому Leaflet сразу
  // получает верный размер контейнера и не грузит тайлы "вслепую".
  flatMap = L.map(flatMapCanvas, { attributionControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(flatMap);
  // Названия городов/улиц на тайлах — это картинка, текст из неё не
  // скопировать. Клик по пустому месту карты (когда линейка выключена)
  // определяет, что там находится, через Nominatim, и показывает всплывашку
  // с настоящим, копируемым текстом.
  flatMap.on('click', e => { if (!rulerActive) onMapPlainClick(e); });
  return flatMap;
}

// Классическая "капля" с кольцом внутри — Gregory попросил заменить эмодзи
// 📍, который на экране выглядит как леденец на палочке.
const GPS_PIN_ICON = '<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';

const CALENDAR_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM4 10v10h16V10H4z"/><rect x="6" y="12" width="3" height="3"/><rect x="10.5" y="12" width="3" height="3"/><rect x="15" y="12" width="3" height="3"/><rect x="6" y="16.5" width="3" height="3"/><rect x="10.5" y="16.5" width="3" height="3"/><rect x="15" y="16.5" width="3" height="3"/></svg>';
const CHEVRON_UP_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg>';

// Стандартное окно подсказки на карте (клик по пустому месту или результат
// поиска) — одинаковое содержимое в обоих случаях, чтобы не плодить разные
// стили попапов.
function buildStandardMapPopup(text, lat, lng) {
  const coordText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const box = document.createElement('div');
  const nameEl = document.createElement('div');
  nameEl.textContent = text;
  nameEl.style.marginBottom = '8px';
  nameEl.style.maxWidth = '220px';
  box.appendChild(nameEl);
  const buttonRow = document.createElement('div');
  buttonRow.className = 'map-popup-button-row';
  const btn = document.createElement('button');
  btn.className = 'map-button map-popup-button';
  btn.textContent = '📋';
  btn.title = 'Копировать';
  btn.onclick = () => navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✅';
    setTimeout(() => { btn.textContent = '📋'; }, 1500);
  });
  buttonRow.appendChild(btn);
  const gpsBtn = document.createElement('button');
  gpsBtn.className = 'map-button map-popup-button';
  gpsBtn.innerHTML = GPS_PIN_ICON;
  gpsBtn.title = 'Копировать GPS';
  gpsBtn.onclick = () => navigator.clipboard.writeText(coordText).then(() => {
    gpsBtn.textContent = '✅';
    setTimeout(() => { gpsBtn.innerHTML = GPS_PIN_ICON; }, 1500);
  });
  buttonRow.appendChild(gpsBtn);
  const geminiBtn = document.createElement('button');
  geminiBtn.className = 'map-button map-popup-button';
  geminiBtn.textContent = '🤖';
  geminiBtn.title = 'Gemini';
  geminiBtn.onclick = openGemini;
  buttonRow.appendChild(geminiBtn);
  box.appendChild(buttonRow);
  return box;
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data.display_name || null;
}

async function forwardGeocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1&accept-language=ru`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data[0] || null;
}

async function runMapSearch() {
  const query = mapSearchInput.value.trim();
  if (!query || !flatMap) return;
  const original = mapSearchBtn.textContent;
  mapSearchBtn.disabled = true;
  mapSearchBtn.textContent = '…';
  try {
    const result = await forwardGeocode(query);
    if (!result) {
      alert('Место не найдено');
      return;
    }
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    mapSearchUsed = true;
    flatMap.flyTo([lat, lng], 15);
    L.popup({ maxWidth: 400 }).setLatLng([lat, lng]).setContent(buildStandardMapPopup(result.display_name, lat, lng)).openOn(flatMap);
  } catch (err) {
    alert('Не удалось выполнить поиск');
  } finally {
    mapSearchBtn.disabled = false;
    mapSearchBtn.textContent = original;
  }
}

mapSearchBtn.addEventListener('click', runMapSearch);
mapSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') runMapSearch(); });

function onMapPlainClick(e) {
  const { lat, lng } = e.latlng;
  const coordText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const popup = L.popup({ maxWidth: 400 }).setLatLng(e.latlng).setContent('Ищу название места…').openOn(e.target);
  reverseGeocode(lat, lng).then(name => {
    popup.setContent(buildStandardMapPopup(name || coordText, lat, lng));
  }).catch(() => popup.setContent(coordText));
}

// Точки альбома на карте: по одной на каждое фото с GPS-координатами
// (или центр поездки, если у фото координат нет) — та же логика, что
// раньше была в отдельном map.html.
function getTripPoints(trip) {
  const points = trip.photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ photo }) => typeof photo.lat === 'number' && typeof photo.lng === 'number')
    .map(({ photo, index }) => ({ lat: photo.lat, lng: photo.lng, caption: photo.caption, index }));
  return points.length ? points : [{ lat: trip.lat, lng: trip.lng, caption: trip.title, index: -1 }];
}

let tripMarkersLayer = null;

function showTripMarkers(map, trip, highlightIndex) {
  if (tripMarkersLayer) tripMarkersLayer.remove();
  tripMarkersLayer = L.layerGroup();
  const points = getTripPoints(trip);
  points.forEach(p => {
    const isHighlighted = highlightIndex != null && p.index === highlightIndex;
    const marker = isHighlighted
      ? L.marker([p.lat, p.lng], {
          icon: L.divIcon({ className: '', html: '<div class="highlight-pin"></div>', iconSize: [20, 20] }),
          zIndexOffset: 1000
        })
      : L.marker([p.lat, p.lng]);
    // Тот же попап, что и при клике по пустому месту карты/поиске (Gregory:
    // "окно всегда одно") — единый вид для всех трёх сценариев.
    marker.bindPopup(buildStandardMapPopup(p.caption || trip.title, p.lat, p.lng), { maxWidth: 400 });
    marker.addTo(tripMarkersLayer);
  });
  tripMarkersLayer.addTo(map);
  return points;
}

// --- Линейка: измерение расстояния на карте кликами по точкам ---

let rulerActive = false;
let rulerPoints = [];
let rulerLine = null;
let rulerMarkers = null;

function formatDistance(meters) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(2)} км` : `${Math.round(meters)} м`;
}

function clearRuler() {
  rulerPoints = [];
  if (rulerLine) { rulerLine.remove(); rulerLine = null; }
  if (rulerMarkers) { rulerMarkers.remove(); rulerMarkers = null; }
  rulerClearBtn.classList.add('hidden');
}

function redrawRuler(map) {
  if (rulerLine) { rulerLine.remove(); rulerLine = null; }
  if (rulerMarkers) { rulerMarkers.remove(); rulerMarkers = null; }
  if (!rulerPoints.length) {
    rulerClearBtn.classList.add('hidden');
    return;
  }
  rulerMarkers = L.layerGroup(rulerPoints.map(p =>
    L.circleMarker(p, { radius: 5, color: '#ffce54', fillColor: '#ffce54', fillOpacity: 1 })
  ));
  rulerMarkers.addTo(map);
  if (rulerPoints.length > 1) {
    let total = 0;
    for (let i = 1; i < rulerPoints.length; i++) total += map.distance(rulerPoints[i - 1], rulerPoints[i]);
    rulerLine = L.polyline(rulerPoints, { color: '#ffce54', weight: 3, dashArray: '6 6' }).addTo(map);
    rulerLine.bindTooltip(formatDistance(total), { permanent: true, direction: 'right', className: 'ruler-tooltip' }).openTooltip();
  }
  rulerClearBtn.classList.remove('hidden');
}

function onRulerClick(e) {
  rulerPoints.push(e.latlng);
  redrawRuler(e.target);
}

function setRulerActive(active) {
  rulerActive = active;
  const map = ensureFlatMap();
  map.off('click', onRulerClick);
  if (active) {
    map.on('click', onRulerClick);
    map.getContainer().style.cursor = 'crosshair';
  } else {
    map.getContainer().style.cursor = '';
  }
  rulerToggleBtn.classList.toggle('active', active);
}

rulerToggleBtn.onclick = () => setRulerActive(!rulerActive);
rulerClearBtn.onclick = () => clearRuler();

function nearestTrip(lat, lng) {
  const R = 6371;
  const toRad = deg => deg * Math.PI / 180;
  let best = trips[0];
  let bestDist = Infinity;
  trips.forEach(trip => {
    const dLat = toRad(trip.lat - lat);
    const dLng = toRad(trip.lng - lng);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(trip.lat)) * Math.sin(dLng / 2) ** 2;
    const d = 2 * R * Math.asin(Math.sqrt(a));
    if (d < bestDist) {
      bestDist = d;
      best = trip;
    }
  });
  return best;
}

// Кросс-фейд между глобусом и картой: оба слоя всё время смонтированы,
// просто плавно меняем прозрачность (короткий переход, без сплошной белой
// заслонки) — это же используется и для входа, и для симметричного выхода.
function crossfade(fromEl, toEl, onSwap) {
  cloudOverlay.classList.remove('hidden');
  requestAnimationFrame(() => cloudOverlay.classList.add('visible'));
  onSwap();
  requestAnimationFrame(() => {
    fromEl.classList.add('layer-off');
    toEl.classList.remove('layer-off');
  });
  setTimeout(() => {
    cloudOverlay.classList.remove('visible');
    setTimeout(() => cloudOverlay.classList.add('hidden'), 300);
  }, 280);
}

function updateMapToggleLabel() {
  toolbarMapToggle.textContent = inFlatMapMode ? '🌐 Глобус' : '🗺️ Карта';
  toolbarMapToggle.title = inFlatMapMode ? 'Вернуться к глобусу' : 'Открыть карту';
}

// Единая точка входа на карту: если уже на карте — просто перелетаем на
// новое место (без повторного кросс-фейда), если ещё на глобусе — сначала
// проваливаемся сквозь облака. Заодно расставляет метки по фото альбома
// (highlightIndex — подсветить конкретное фото, если пришли из лайтбокса).
function goToMapAt(trip, highlightIndex) {
  const points = getTripPoints(trip);
  const target = (highlightIndex != null && points.find(p => p.index === highlightIndex)) || points[0];
  // Без конкретного выделенного фото (режим альбома целиком, не отдельного
  // снимка) карта должна вмещать все точки альбома, а не только первую.
  const bounds = highlightIndex == null && points.length > 1
    ? L.latLngBounds(points.map(p => [p.lat, p.lng]))
    : null;
  mapToolsEl.classList.remove('hidden');
  mapSearchBarEl.classList.remove('hidden');
  if (inFlatMapMode) {
    const map = ensureFlatMap();
    showTripMarkers(map, trip, highlightIndex);
    if (bounds) map.flyToBounds(bounds, { padding: [40, 40] });
    else map.flyTo([target.lat, target.lng], 17);
    return;
  }
  if (modalOpenBlockingRotate) return;
  // Открыть трипа из альбомов не закрывает albumsModal (чтобы "Назад" мог
  // вернуть его) — но при уходе на карту он всё равно должен визуально
  // скрыться, иначе перекроет карту тем же z-index, что у любой модалки.
  albumsModal.classList.add('hidden');
  inFlatMapMode = true;
  applyAutoRotateState();
  crossfade(globeVizEl, flatMapEl, () => {
    const map = ensureFlatMap();
    showTripMarkers(map, trip, highlightIndex);
    if (bounds) map.fitBounds(bounds, { padding: [40, 40], animate: false });
    else map.setView([target.lat, target.lng], 17, { animate: false });
    map.invalidateSize();
  });
  updateMapToggleLabel();
  syncUrlBookmark();
}

function descendToMap() {
  if (inFlatMapMode || modalOpenBlockingRotate) return;
  if (!albumsModal.classList.contains('hidden')) return;
  const pov = globe.pointOfView();
  // Прыгаем сразу в район ближайшего альбома, а не туда, куда случайно
  // смотрела камера — подползать к нему смысла нет.
  const target = nearestTrip(pov.lat, pov.lng);
  // Вход без конкретного альбома/фото — "Назад" с такой карты ведёт на глобус.
  mapEntryContext = null;
  goToMapAt(target);
}

// Выход с карты — только по кнопке, никогда по жесту зума.
function returnToGlobe() {
  if (!inFlatMapMode) return;
  const center = flatMap.getCenter();
  crossfade(flatMapEl, globeVizEl, () => {
    resizeGlobe();
    // Отдаляемся безопасно выше порога исчезновения горизонта, чтобы не
    // провалиться обратно на карту сразу же.
    globe.pointOfView({ lat: center.lat, lng: center.lng, altitude: 3 }, 0);
  });
  inFlatMapMode = false;
  zoomAllowsRotate = true;
  mapEntryContext = null;
  mapSearchUsed = false;
  mapToolsEl.classList.add('hidden');
  mapSearchBarEl.classList.add('hidden');
  setRulerActive(false);
  clearRuler();
  applyAutoRotateState();
  updateMapToggleLabel();
  syncUrlBookmark();
}

toolbarMapToggle.onclick = () => {
  if (inFlatMapMode) {
    returnToGlobe();
  } else {
    descendToMap();
  }
};

// --- Кнопка "Назад": возврат туда, откуда нырнули (альбом/фото/глобус) ---

const navBackBtn = document.getElementById('navBack');
const navRefreshBtn = document.getElementById('navRefresh');
const backJokeEl = document.getElementById('backJoke');

const backJokes = [
  '🌍 Дальше только открытый космос. Тут разворачиваемся.',
  '🚀 Ракеты пока не подвезли — возвращайтесь на глобус.',
  '🧭 Приехали. Дальше пешком не выйдет.',
  '🪐 За глобусом — только соседние планеты, а туда мы ещё не летали.'
];
let jokeTimer = null;
function showBackJoke() {
  clearTimeout(jokeTimer);
  backJokeEl.textContent = backJokes[Math.floor(Math.random() * backJokes.length)];
  backJokeEl.classList.remove('hidden');
  requestAnimationFrame(() => backJokeEl.classList.add('visible'));
  jokeTimer = setTimeout(() => {
    backJokeEl.classList.remove('visible');
    setTimeout(() => backJokeEl.classList.add('hidden'), 300);
  }, 2500);
}

// "Назад" всегда поднимает ровно на один уровень вверх — как команда cd ..:
// какой бы экран ни был открыт поверх всего, он просто закрывается, без
// дополнительных условий и исключений.
function navBack() {
  if (!lightbox.classList.contains('hidden')) {
    closeLightbox();
    return;
  }
  if (!settingsModal.classList.contains('hidden')) {
    settingsModal.classList.add('hidden');
    return;
  }
  if (!albumsModal.classList.contains('hidden')) {
    closeAlbumsModal();
    return;
  }
  if (inFlatMapMode) {
    const ctx = mapEntryContext;
    const cameFromSearch = mapSearchUsed;
    mapEntryContext = null;
    returnToGlobe();
    if (cameFromSearch) {
      albumsSearchText.value = '';
      openAlbumsModal();
    } else if (ctx && ctx.type === 'modal') {
      openTrip(trips[ctx.tripIndex]);
    } else if (ctx && ctx.type === 'lightbox') {
      openTrip(trips[ctx.tripIndex]);
      openLightbox(ctx.photoIndex);
    }
    return;
  }
  if (!modal.classList.contains('hidden')) {
    const returnToAlbums = modalEntryFromAlbums;
    closeModal();
    if (returnToAlbums) albumsModal.classList.remove('hidden');
    return;
  }
  showBackJoke();
}

navBackBtn.onclick = navBack;
navRefreshBtn.onclick = () => location.reload();

// --- Закладка состояния в URL — чтобы "Обновить" не сбрасывало на глобус ---

function syncUrlBookmark() {
  const params = new URLSearchParams();
  if (inFlatMapMode) {
    params.set('view', 'map');
    if (mapEntryContext) {
      params.set('trip', String(mapEntryContext.tripIndex));
      if (mapEntryContext.type === 'lightbox') params.set('photo', String(mapEntryContext.photoIndex));
    }
  } else if (!lightbox.classList.contains('hidden') && currentTrip) {
    params.set('trip', String(trips.indexOf(currentTrip)));
    params.set('photo', String(currentPhotoIndex));
  } else if (!modal.classList.contains('hidden') && currentTrip) {
    params.set('trip', String(trips.indexOf(currentTrip)));
  }
  const qs = params.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  const tripIndex = params.has('trip') ? Number(params.get('trip')) : null;
  const photoIndex = params.has('photo') ? Number(params.get('photo')) : null;
  if (tripIndex == null || Number.isNaN(tripIndex) || !trips[tripIndex]) return;
  const trip = trips[tripIndex];
  if (params.get('view') === 'map') {
    mapEntryContext = photoIndex != null && !Number.isNaN(photoIndex)
      ? { type: 'lightbox', tripIndex, photoIndex }
      : { type: 'modal', tripIndex };
    goToMapAt(trip, mapEntryContext.type === 'lightbox' ? photoIndex : undefined);
    return;
  }
  modalEntryFromAlbums = false;
  openTrip(trip);
  if (photoIndex != null && !Number.isNaN(photoIndex)) openLightbox(photoIndex);
}
// Вызывается в самом конце файла (см. низ) — после того, как объявлены все
// функции/константы, на которые опирается открытие модалки/лайтбокса/карты.

// --- Настройки (шестерёнка) ---

const settingsModal = document.getElementById('settingsModal');
const settingsModalClose = document.getElementById('settingsModalClose');
const toolbarSettings = document.getElementById('toolbarSettings');
const settingAutoRotate = document.getElementById('settingAutoRotate');

settingAutoRotate.checked = !userAutoRotateOff;
// Сохранённая настройка вращения раньше применялась только при следующем
// событии (зум/модалка/карта) — на самой загрузке страницы игнорировалась.
applyAutoRotateState();

toolbarSettings.onclick = () => {
  settingsModal.classList.remove('hidden');
  spinAboutLogo();
};
settingsModalClose.onclick = () => settingsModal.classList.add('hidden');
settingsModal.onclick = e => {
  if (e.target === settingsModal) settingsModal.classList.add('hidden');
};
settingAutoRotate.onchange = () => {
  userAutoRotateOff = !settingAutoRotate.checked;
  settings.autoRotate = settingAutoRotate.checked;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applyAutoRotateState();
};

// --- Установка сайта на экран (PWA) ---
// Chromium (desktop/Android) сам предлагает событие beforeinstallprompt —
// прячем и показываем "родной" диалог установки по клику. iOS Safari не
// поддерживает эту API вообще, поэтому там просто показываем инструкцию
// (там установка возможна только вручную через кнопку "Поделиться").
// Chrome требует зарегистрированный service worker как одно из условий
// показа beforeinstallprompt — без него кнопка никогда не появлялась.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

const installAppBtn = document.getElementById('installAppBtn');
let deferredInstallPrompt = null;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (!isStandalone) {
  if (isIOS) {
    installAppBtn.classList.remove('hidden');
  } else {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredInstallPrompt = e;
      installAppBtn.classList.remove('hidden');
    });
  }
}

installAppBtn.onclick = async () => {
  if (isIOS) {
    alert('Чтобы установить сайт на экран "Домой":\n\n1. Нажмите кнопку "Поделиться" внизу экрана Safari (квадрат со стрелкой вверх)\n2. Выберите "На экран «Домой»"\n3. Нажмите "Добавить"');
    return;
  }
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installAppBtn.classList.add('hidden');
};

// --- Скрытые настройки разработчика ---
// Двойной клик по логотипу "About" запрашивает пароль (проверяется по
// SHA-256 хэшу, сам пароль нигде в коде не хранится в открытом виде).
const DEV_PASSWORD_HASH = 'cf4bf3f159829c280f346e9b1827938a237ff7ed5e22d6091f450e55df5ee8de';

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const aboutLogoEl = document.getElementById('aboutLogo');
const devSettingsEl = document.getElementById('devSettings');
const editModeToggleEl = document.getElementById('editModeToggle');
const editModeStatusEl = document.getElementById('editModeBanner');

// Режим редактирования живёт только в памяти вкладки (не в localStorage) —
// клик по "Обновить" (location.reload(), см. navRefreshBtn.onclick) сам
// сбрасывает его без отдельного кода выхода.
let editModeActive = false;
const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

aboutLogoEl.ondblclick = async () => {
  const pass = prompt('Пароль разработчика:');
  if (pass == null) return;
  const hash = await sha256Hex(pass);
  if (hash === DEV_PASSWORD_HASH) {
    devSettingsEl.classList.remove('hidden');
    if (isDesktop) editModeToggleEl.classList.remove('hidden');
  } else {
    alert('Неверный пароль');
  }
};

editModeToggleEl.onclick = () => {
  editModeActive = !editModeActive;
  editModeStatusEl.classList.toggle('hidden', !editModeActive);
  editModeToggleEl.classList.toggle('active', editModeActive);
};

// Вращение глобуса внутри буквы G: полоса с материками едет по горизонтали
// под круглой маской (SMIL animateTransform #aboutGlobeSpinAnim) — один полный
// оборот с затуханием к концу (keySplines), буква G статична.
const aboutGlobeSpinAnim = document.getElementById('aboutGlobeSpinAnim');

function spinAboutLogo() {
  aboutGlobeSpinAnim.beginElement();
}

aboutLogoEl.addEventListener('mouseenter', spinAboutLogo);
aboutLogoEl.addEventListener('focus', spinAboutLogo);

// Прогреваем кэш тайлов вокруг каждого альбома заранее (небольшой набор,
// не весь земной шар), чтобы при провале карта открывалась уже в резком
// разрешении, а не догружалась на глазах.
function warmTripTileCache() {
  const zoom = 17;
  const radius = 1;
  const subdomains = ['a', 'b', 'c'];
  trips.forEach(trip => {
    const n = 2 ** zoom;
    const cx = Math.floor((trip.lng + 180) / 360 * n);
    const latRad = trip.lat * Math.PI / 180;
    const cy = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const x = cx + dx, y = cy + dy;
        const s = subdomains[(x + y + subdomains.length) % subdomains.length];
        new Image().src = `https://${s}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
      }
    }
  });
}
setTimeout(warmTripTileCache, 2000);

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
//
// Day/month/year lists only offer values that actually have a trip (plus
// whatever's currently selected, so "today" stays visible even outside any
// trip) — matches the day grid, where non-travel cells already aren't
// clickable, so there was no point listing dates the grid itself dead-ends on.
const tripYears = [...new Set(tripDates.map(d => Number(d.slice(0, 4))))];

function tripMonthsInYear(year) {
  return new Set(
    tripDates.filter(d => d.startsWith(`${year}-`)).map(d => Number(d.slice(5, 7)))
  );
}

function tripDaysInYearMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  return new Set(tripDates.filter(d => d.startsWith(prefix)).map(d => Number(d.slice(8, 10))));
}

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

function rebuildDayList(year, month, daysInMonth, activeDay) {
  calendarDayList.innerHTML = '';
  const days = tripDaysInYearMonth(year, month);
  days.add(activeDay);
  [...days].filter(d => d >= 1 && d <= daysInMonth).sort((a, b) => a - b).forEach(d => {
    const item = document.createElement('div');
    item.className = 'calendar-dd-item';
    if (d === activeDay) item.classList.add('active');
    item.textContent = String(d);
    item.onclick = () => {
      const [y, m] = selectedDate.split('-');
      setSelectedDate(`${y}-${m}-${String(d).padStart(2, '0')}`);
      closeCalendarDropdowns();
    };
    calendarDayList.appendChild(item);
  });
}

function rebuildMonthList(year, activeMonth) {
  calendarMonthList.innerHTML = '';
  const months = tripMonthsInYear(year);
  months.add(activeMonth);
  [...months].sort((a, b) => a - b).forEach(m => {
    const item = document.createElement('div');
    item.className = 'calendar-dd-item';
    item.dataset.value = String(m).padStart(2, '0');
    if (m === activeMonth) item.classList.add('active');
    item.textContent = monthNames[m - 1];
    item.onclick = () => {
      const [y, , d] = selectedDate.split('-');
      setSelectedDate(`${y}-${String(m).padStart(2, '0')}-${d}`);
      closeCalendarDropdowns();
    };
    calendarMonthList.appendChild(item);
  });
}

function rebuildYearList(activeYear) {
  calendarYearList.innerHTML = '';
  const years = new Set(tripYears);
  years.add(activeYear);
  [...years].sort((a, b) => a - b).forEach(y => {
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
  });
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
  calendarDayBtn.textContent = String(day);
  calendarMonthBtn.textContent = monthNames[month - 1];
  calendarYearBtn.textContent = String(year);

  calendarWeekdaysRow.innerHTML = '';
  weekdayLetters.forEach(w => {
    const cell = document.createElement('div');
    cell.textContent = w;
    calendarWeekdaysRow.appendChild(cell);
  });

  const daysInMonth = fillDayGrid(calendarGrid, year, month);
  rebuildDayList(year, month, daysInMonth, day);
  rebuildMonthList(year, month);
  rebuildYearList(year);
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
  albumsCalendarToggle.innerHTML = collapsed ? CALENDAR_ICON : CHEVRON_UP_ICON;
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
  setCalendarCollapsed(true);
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
  modalEntryFromAlbums = true;
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
  modalOpenBlockingRotate = true;
  applyAutoRotateState();
  modalTitle.textContent = trip.title;
  modalMeta.textContent = trip.dateLabel;
  modalNotes.textContent = trip.notes;
  modalGallery.innerHTML = '';
  trip.photos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = photo.url;
    img.loading = 'lazy';
    img.decoding = 'async';
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
  syncUrlBookmark();
}

function closeModal() {
  modal.classList.add('hidden');
  modalOpenBlockingRotate = false;
  applyAutoRotateState();
  speechSynthesis.cancel();
  modalSpeak.textContent = '🔊';
  syncUrlBookmark();
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

// Gemini не подхватывает ни адрес страницы, ни текст из параметра ?q=, а
// скопированный в буфер текст вставлять там всё равно некуда — голосовой
// интерфейс Gemini просит сказать вопрос вслух, а не напечатать его.
// Поэтому просто открываем чат, без подготовки текста заранее.
function openGemini() {
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

modalGeminiText.onclick = openGemini;

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
  const tripIndex = trips.indexOf(currentTrip);
  closeModal();
  mapEntryContext = { type: 'modal', tripIndex };
  goToMapAt(currentTrip);
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
  siteSoundOn = true;
  bgAudio.play().catch(() => {
    // Браузер заблокировал автовоспроизведение (например, iOS при
    // переключателе "Бесшумно" глушит звук у <audio>, в отличие от <video>).
  });
}

lightboxGeminiText.onclick = openGemini;

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
  syncUrlBookmark();
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
  stopSlideshow();
  if (document.fullscreenElement) document.exitFullscreen();
  syncUrlBookmark();
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

lightboxMap.onclick = () => {
  if (!currentTrip) return;
  stopSlideshow();
  const tripIndex = trips.indexOf(currentTrip);
  const photoIndex = currentPhotoIndex;
  closeLightbox();
  closeModal();
  mapEntryContext = { type: 'lightbox', tripIndex, photoIndex };
  goToMapAt(currentTrip, currentPhotoIndex);
};

// Восстанавливаем состояние (альбом/фото/карта) из URL при загрузке —
// перезагрузка страницы больше не сбрасывает на пустой глобус.
restoreFromUrl();

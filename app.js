const globe = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
  .htmlElementsData(trips)
  .htmlLat('lat')
  .htmlLng('lng')
  .htmlElement(trip => {
    const el = document.createElement('div');
    el.className = 'photo-pin';
    el.style.backgroundImage = `url(${trip.cover})`;
    el.title = `${trip.city}, ${trip.country}`;
    el.onclick = () => openTrip(trip);
    return el;
  });

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.4;

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalNotes = document.getElementById('modalNotes');
const modalGallery = document.getElementById('modalGallery');
const modalClose = document.getElementById('modalClose');

function openTrip(trip) {
  globe.controls().autoRotate = false;
  modalTitle.textContent = trip.title;
  modalMeta.textContent = `${trip.city}, ${trip.country} — ${trip.date}`;
  modalNotes.textContent = trip.notes;
  modalGallery.innerHTML = '';
  trip.photos.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = trip.title;
    modalGallery.appendChild(img);
  });
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  globe.controls().autoRotate = true;
}

modalClose.onclick = closeModal;
modal.onclick = e => {
  if (e.target === modal) closeModal();
};

// utilizzo lo script dinamico config.js dato da questo endpoint "/api/maps-config.js" per caricare la chiave API di Google Maps in modo sicuro
loadScript('/api/maps-config.js')
 .then(() => {
    loadGoogleMapsScript(window.GOOGLE_MAPS_API_KEY);  // Carica lo script di Google Maps
});

function loadGoogleMapsScript(apiKey) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}



// Funzione di utilità per caricare script esterni
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}






// Funzione che verrà chiamata quando carica la mappa
function initMap() {
  const centerCoords = { lat: 46.0704, lng: 11.1196 };

  // Crea una nuova mappa centrata su Trento
  const map = new google.maps.Map(document.getElementById("map"), {
    center: centerCoords,
    zoom: 13,
  });

  // Aggiunge un segnaposto di esempio
  new google.maps.Marker({
    position: centerCoords,
    map: map,
    title: "Centro di Trento",
  });
}


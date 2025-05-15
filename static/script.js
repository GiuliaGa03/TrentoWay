// Funzione che verrà chiamata dal Google Maps API quando carica la mappa
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

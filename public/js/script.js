const socket = io();

// const map = document.getElementById("map");

if (navigator.geolocation) {
  console.log("Browser supports geoLoc");
  const position = navigator.geolocation.watchPosition(
    (pos) => {
      console.log(pos);
      const { latitude, longitude } = pos.coords;
      socket.emit("send-location", { lat: latitude, lon: longitude });

      console.log("pos", position);
    },
    (error) => {
      console.log("error has ");
    },
    {
      enableHighAccuracy: true, //high accuracy
      timeout: 5000, //check interval
      maximumAge: 0, //no caching
    }
  );
} else {
  console.log("browser wont supports");
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
  const { id, lat, lon } = data;
  map.setView([lat, lon]);
  if (markers[id]) {
    markers[id].setLatLng([lat, lon]);
  } else {
    markers[id] = L.marker([lat, lon]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

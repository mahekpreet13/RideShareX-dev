
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import React, { useEffect, useState, useRef } from "react";





/* 🔄 SAFE ROTATION */
const getRotation = (start, end) => {
  if (!start || !end) return 0;

  const dy = end[0] - start[0];
  const dx = end[1] - start[1];
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

/* 📍 USER ICON */
const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* 📍 AUTO CENTER MAP */
function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 15, { duration: 1.5 });
    }
  }, [location, map]);

  return null;
}

function DriverMap() {
  const { username } = useParams();
  const mapRef = useRef();
const animationRef = useRef(null);

  const [driverLocation, setDriverLocation] = useState(null);
  const [animatedDriver, setAnimatedDriver] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [eta, setEta] = useState(null);
  const [arrived, setArrived] = useState(false);

  /* 📍 GET USER LOCATION */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  /* 🚗 SMOOTH DRIVER ANIMATION */
 const animateDriver = (start, end) => {
  if (animationRef.current) {
    clearInterval(animationRef.current);
  }

  const steps = 30;
  let i = 0;

  const latStep = (end[0] - start[0]) / steps;
  const lngStep = (end[1] - start[1]) / steps;

  animationRef.current = setInterval(() => {
    i++;

    const nextPos = [
      start[0] + latStep * i,
      start[1] + lngStep * i,
    ];

    setAnimatedDriver(nextPos);

    if (i >= steps) {
      clearInterval(animationRef.current);
    }
  }, 100);
};

  /* 🔌 WEBSOCKET */
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe(`/topic/driver-location/${username}`, (msg) => {
          const data = JSON.parse(msg.body);

          if (data.latitude && data.longitude) {
            const newPos = [data.latitude, data.longitude];

            setDriverLocation(newPos);

            setAnimatedDriver((prev) => {
              if (!prev) return newPos;
              animateDriver(prev, newPos);
              return prev;
            });
          }
        });
      },
    });
    

    client.activate();
    return () => client.deactivate();
  }, [username]);

  /* 🛣️ GOOGLE ROUTE + ETA */
 useEffect(() => {
  if (!driverLocation || !userLocation) return;

  const fetchRoute = async () => {
    try {
     const current = animatedDriver || driverLocation;

const res = await fetch(
  `http://localhost:8080/maps/route?` +
  `driverLat=${current[0]}&driverLng=${current[1]}` +
  `&userLat=${userLocation[0]}&userLng=${userLocation[1]}`
);

      const data = await res.json();

      // ✅ ORS FORMAT
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng] // ⚠️ flip
        );

        setRouteCoords(coords);

        const durationSec =
          data.features[0].properties.summary.duration;

        setEta(Math.round(durationSec / 60) + " min");
      }
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  fetchRoute();
}, [driverLocation, userLocation]);
  /* 🚨 ARRIVAL ALERT */
  useEffect(() => {
    if (!driverLocation || !userLocation || arrived) return;

    const getDistance = (a, b) => {
      const R = 6371;
      const dLat = (b[0] - a[0]) * Math.PI / 180;
      const dLon = (b[1] - a[1]) * Math.PI / 180;

      const lat1 = a[0] * Math.PI / 180;
      const lat2 = b[0] * Math.PI / 180;

      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(dLon / 2) ** 2;

      return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    };

   const distance = getDistance(
  animatedDriver || driverLocation,
  userLocation
);

    if (distance < 0.2) {
      alert("🚗 Driver has arrived!");
      setArrived(true);
    }
  }, [animatedDriver, driverLocation, userLocation, arrived]);

  /* 🔄 ROTATION VALUE */
  const rotation =
    animatedDriver && driverLocation
      ? getRotation(animatedDriver, driverLocation)
      : 0;

  useEffect(() => {
  if (mapRef.current && routeCoords.length > 0) {
    mapRef.current.fitBounds(routeCoords, {
      padding: [50, 50],
    });
  }
}, [routeCoords]);

const pickupIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});


  return (
    <div className="container" style={{ maxWidth: "900px" }}>
      <h2>Live Driver Tracking</h2>

      {eta && <p>🚗 ETA: {eta}</p>}

      <div style={{ height: "450px" }}>
        
        <MapContainer
          center={driverLocation || userLocation || [17.385, 78.4867]}
  whenCreated={(map) => (mapRef.current = map)}
          zoom={13}
          style={{ height: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap location={animatedDriver || driverLocation} />

          {/* 🚗 DRIVER */}
          {driverLocation && (
            <Marker
              position={animatedDriver || driverLocation}
              icon={L.divIcon({
                className: "",
                html: `<img 
                  src="https://cdn-icons-png.flaticon.com/512/743/743922.png"
                  style="width:35px; transform: rotate(${rotation}deg);" 
                />`,
              })}
            >
              <Popup>{username} (Driver)</Popup>
            </Marker>
          )}

          {/* 👤 USER */}
          
          {userLocation && (
  <Marker position={userLocation} icon={pickupIcon}>
    <Popup>Pickup Location</Popup>
  </Marker>
)}

          {/* 🛣️ ROUTE */}
          {routeCoords.length > 0 && (
           <Polyline positions={routeCoords} smoothFactor={5} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default DriverMap;
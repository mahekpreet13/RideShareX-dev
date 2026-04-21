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
  }, [driverLocation, userLocation, animatedDriver]);

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
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                </span>
                Live Tracking
              </h2>
              <p className="text-muted-foreground mt-1 ml-10">Driver: <span className="font-semibold text-foreground">{username}</span></p>
            </div>

            {eta && (
              <div className="bg-primary/5 border border-primary/20 px-6 py-3 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider">Estimated Time</p>
                  <p className="text-xl font-bold text-foreground">{eta}</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative h-[60vh] min-h-[400px] w-full bg-muted">
            <MapContainer
              center={driverLocation || userLocation || [30.638, 76.634]}
              whenCreated={(map) => (mapRef.current = map)}
              zoom={13}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              <RecenterMap location={animatedDriver || driverLocation} />

              {/* 🚗 DRIVER */}
              {driverLocation && (
                <Marker
                  position={animatedDriver || driverLocation}
                  icon={L.divIcon({
                    className: "bg-transparent border-none shadow-none",
                    html: `<div class="bg-white p-2 rounded-full shadow-lg border-2 border-primary w-12 h-12 flex items-center justify-center transition-all duration-300 transform"><img 
                      src="https://cdn-icons-png.flaticon.com/512/743/743922.png"
                      style="width:24px; height:24px; transform: rotate(${rotation}deg); transition: transform 0.3s ease-out;" 
                    /></div>`,
                  })}
                >
                  <Popup className="rounded-lg shadow-md font-sans">
                    <div className="font-semibold text-primary">{username}</div>
                    <div className="text-xs text-muted-foreground mt-1">Driver</div>
                  </Popup>
                </Marker>
              )}

              {/* 👤 USER */}
              {userLocation && (
                <Marker position={userLocation} icon={pickupIcon}>
                  <Popup className="rounded-lg shadow-md font-sans">
                    <div className="font-semibold text-foreground">Pickup Location</div>
                    <div className="text-xs text-muted-foreground mt-1">You are here</div>
                  </Popup>
                </Marker>
              )}

              {/* 🛣️ ROUTE */}
              {routeCoords.length > 0 && (
                <Polyline 
                  positions={routeCoords} 
                  pathOptions={{ color: 'var(--primary)', weight: 5, opacity: 0.8 }}
                  smoothFactor={1} 
                />
              )}
            </MapContainer>
            
            {/* Overlay if waiting for locations */}
            {(!driverLocation && !userLocation) && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[400] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-foreground font-medium bg-white px-6 py-2 rounded-full shadow-sm">Locating driver...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverMap;
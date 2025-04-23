import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMap,
  CircleMarker
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

const BACKEND_URL = "http://localhost:5003";

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      console.log("📍 RecenterMap triggered. New center:", lat, lng);
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

const DriverMap = ({ orderId }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const [error, setError] = useState(null);

  const defaultCenter = [6.9271, 79.8612]; // Colombo

  useEffect(() => {
    const socket = io(BACKEND_URL);
    setSocketInstance(socket);

    socket.on("connect", () => {
      console.log("✅ Socket connected! ID:", socket.id);
      socket.emit("registerDriver", { userId: socket.id });
    });

    socket.on("driverLocation", (data) => {
      if (data.userId === socket.id) {
        console.log("📡 Updating driver's location:", data);
        setDriverLocation({
          lat: data.lat,
          lng: data.lng,
          userId: data.userId,
          lastUpdated: new Date(data.timestamp),
        });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      setError("Socket connection error");
    });

    // Geolocation tracking
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 Position updated:", latitude, longitude);

          socket.emit("locationUpdate", {
            userId: socket.id,
            lat: latitude,
            lng: longitude,
            orderId: orderId,
          });

          setDriverLocation({
            lat: latitude,
            lng: longitude,
            userId: socket.id,
            lastUpdated: new Date(),
          });
        },
        (err) => {
          console.error("❌ Geolocation tracking failed:", err.message);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError("Permission denied for Geolocation");
              break;
            case err.POSITION_UNAVAILABLE:
              setError("Position unavailable");
              break;
            case err.TIMEOUT:
              setError("Geolocation timeout");
              break;
            default:
              setError("Geolocation tracking failed");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.disconnect();
      };
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="mt-8">
      <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg border">
        <MapContainer
          center={
            driverLocation
              ? [driverLocation.lat, driverLocation.lng]
              : defaultCenter
          }
          zoom={15}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {driverLocation && (
            <>
              <RecenterMap lat={driverLocation.lat} lng={driverLocation.lng} />
              <CircleMarker
                center={[driverLocation.lat, driverLocation.lng]}
                radius={12}
                pathOptions={{
                  fillColor: "#ff0000",
                  color: "#aa0000",
                  weight: 3,
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <strong>Driver:</strong> {driverLocation.userId}
                  <br />
                  <strong>Updated:</strong>{" "}
                  {driverLocation.lastUpdated.toLocaleTimeString()}
                </Popup>
              </CircleMarker>
            </>
          )}
        </MapContainer>
      </div>
      {error && (
        <div className="text-red-500 font-medium mt-4">⚠️ {error}</div>
      )}
    </div>
  );
};

export default DriverMap;

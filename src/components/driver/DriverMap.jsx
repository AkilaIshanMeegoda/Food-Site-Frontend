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
    console.log("📍 RecenterMap triggered. New center:", lat, lng);
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const DriverMap = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [error, setError] = useState(null);
  const defaultCenter = [6.9271, 79.8612]; // Colombo

  useEffect(() => {
    console.log("Connecting to backend socket:", BACKEND_URL);
    const socket = io(BACKEND_URL);

    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id);
    });

    socket.on("driverLocation", (data) => {
      console.log("Received driverLocation:", data);

      // Validate data structure
      if (
        !data ||
        typeof data.lat !== "number" ||
        typeof data.lng !== "number"
      ) {
        console.error("Invalid driverLocation payload:", data);
        return;
      }

      const updatedLocation = {
        lat: data.lat,
        lng: data.lng,
        userId: data.userId || "Unknown",
        lastUpdated: new Date()
      };

      console.log(`📍 Location update -> Lat: ${updatedLocation.lat}, Lng: ${updatedLocation.lng}, User: ${updatedLocation.userId}`);
      setDriverLocation(updatedLocation);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Request geolocation permission and fetch the user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Driver's current position:", latitude, longitude);
          // Emit the location to the backend
          socket.emit("locationUpdate", {
            userId: socket.id, // Send unique userId from socket
            lat: latitude,
            lng: longitude
          });
          setDriverLocation({
            lat: latitude,
            lng: longitude,
            userId: socket.id,
            lastUpdated: new Date()
          });
        },
        (err) => {
          setError("Geolocation permission denied or failed");
          console.error("Geolocation error:", err.message);
        }
      );

      // Watch for location changes (real-time tracking)
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Driver's current position updated:", latitude, longitude);
          // Emit the updated location to the backend
          socket.emit("locationUpdate", {
            userId: socket.id, // Send unique userId from socket
            lat: latitude,
            lng: longitude
          });
          setDriverLocation({
            lat: latitude,
            lng: longitude,
            userId: socket.id,
            lastUpdated: new Date()
          });
        },
        (err) => {
          setError("Geolocation permission denied or failed");
          console.error("Geolocation watch error:", err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 30000
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
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

          <CircleMarker
            center={defaultCenter}
            radius={10}
            pathOptions={{
              fillColor: "blue",
              color: "darkblue",
              weight: 2,
              fillOpacity: 0.8
            }}
          >
            <Popup>Static Default Marker (Colombo)</Popup>
          </CircleMarker>

          {driverLocation && (
            <>
              <RecenterMap
                lat={driverLocation.lat}
                lng={driverLocation.lng}
              />
              <CircleMarker
                center={[driverLocation.lat, driverLocation.lng]}
                radius={12}
                pathOptions={{
                  fillColor: "#ff0000",
                  color: "#aa0000",
                  weight: 3,
                  fillOpacity: 0.9
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
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default DriverMap;

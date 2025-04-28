import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMap,
  CircleMarker,
  Marker,
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
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SOCKET_URL = "http://localhost:5003";

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      console.log("📍 RecenterMap triggered. New center:", lat, lng);
      map.setView([lat, lng], 10); //zoom
    }
  }, [lat, lng, map]);
  return null;
};

const DriverMap = ({ userId, orderId, deliveries, activeDelivery }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const [error, setError] = useState(null);
  const [deliveryLocations, setDeliveryLocations] = useState([]);

  const defaultCenter = [6.9271, 79.8612]; // Colombo

  // Get addresses to display based on the active delivery status
  useEffect(() => {
    if (!deliveries || !Array.isArray(deliveries)) return;

    let locations = [];

    if (!activeDelivery) {
      // Show all pending pickups if no active delivery
      locations = deliveries
        .filter((delivery) => delivery.status === "pending")
        .map((delivery) => ({
          type: "pickup",
          address: delivery.pickupAddress,
          orderId: delivery.orderId,
          lat: delivery.pickupLat,
          lng: delivery.pickupLng,
        }));
    } else {
      // Handle based on the active delivery status
      switch (activeDelivery.status) {
        case "accepted":
          // Show only the accepted delivery's pickup location
          locations = [
            {
              type: "pickup",
              address: activeDelivery.pickupAddress,
              orderId: activeDelivery.orderId,
              lat: activeDelivery.pickupLat,
              lng: activeDelivery.pickupLng,
            },
          ];
          break;
        case "picked_up":
        case "on_the_way":
          // Show only the drop-off location
          locations = [
            {
              type: "dropoff",
              address: activeDelivery.dropoffAddress,
              orderId: activeDelivery.orderId,
              lat: activeDelivery.dropoffLat,
              lng: activeDelivery.dropoffLng,
            },
          ];
          break;
        default:
          // For other statuses or if delivered, show all pending pickups
          locations = deliveries
            .filter((delivery) => delivery.status === "pending")
            .map((delivery) => ({
              type: "pickup",
              address: delivery.pickupAddress,
              orderId: delivery.orderId,
              lat: delivery.pickupLat,
              lng: delivery.pickupLng,
            }));
      }
    }

    setDeliveryLocations(locations);
  }, [deliveries, activeDelivery]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    setSocketInstance(socket);

    socket.on("connect", () => {
      console.log("✅ Socket connected! ID:", socket.id);
      socket.emit("registerDriver", { userId });
    });

    socket.on("driverLocation", (data) => {
      if (data.userId === userId) {
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
            userId: userId,
            lat: latitude,
            lng: longitude,
            orderId: orderId,
          });

          setDriverLocation({
            lat: latitude,
            lng: longitude,
            userId: userId,
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
  }, [userId, orderId]);

  const getMarkerColor = (type) => {
    switch (type) {
      case "pickup":
        return {
          fillColor: "#3388ff",
          color: "#0066cc",
          weight: 3,
          fillOpacity: 0.8,
        };
      case "dropoff":
        return {
          fillColor: "#33cc33",
          color: "#009900",
          weight: 3,
          fillOpacity: 0.8,
        };
      default:
        return {
          fillColor: "#ff3333",
          color: "#cc0000",
          weight: 3,
          fillOpacity: 0.8,
        };
    }
  };

  // Calculate bounds to fit all markers
  const getBounds = () => {
    const points = [];

    if (driverLocation) {
      points.push([driverLocation.lat, driverLocation.lng]);
    }

    deliveryLocations.forEach((location) => {
      points.push([location.lat, location.lng]);
    });

    return points.length > 0 ? L.latLngBounds(points) : null;
  };

  const bounds = getBounds();

  return (
    <div className="mt-8">
      <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg border">
        <MapContainer
          center={
            driverLocation
              ? [driverLocation.lat, driverLocation.lng]
              : defaultCenter
          }
          zoom={10}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {bounds && (
            <RecenterMap
              lat={bounds.getCenter().lat}
              lng={bounds.getCenter().lng}
            />
          )}

          {driverLocation && (
            <CircleMarker
              center={[driverLocation.lat, driverLocation.lng]}
              radius={10}
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
          )}

          {deliveryLocations.map((location, index) => (
            <CircleMarker
              key={`${location.orderId}-${index}`}
              center={[location.lat, location.lng]}
              radius={8}
              pathOptions={getMarkerColor(location.type)}
            >
              <Popup>
                <strong>
                  {location.type === "pickup" ? "Pickup" : "Drop-off"}
                </strong>
                <br />
                <strong>Address:</strong> {location.address}
                <br />
                <strong>Order ID:</strong> {location.orderId}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      {error && <div className="mt-4 font-medium text-red-500">⚠️ {error}</div>}
      <div className="mt-4 p-3 bg-white rounded shadow">
        <h4 className="font-medium text-gray-700 mb-2">Map Legend:</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
            <span>Driver</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
            <span>Pickup</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
            <span>Drop-off</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverMap;

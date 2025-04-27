import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin } from "lucide-react";

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

// Create a delivery icon
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41]
});

const BACKEND_URL = "http://localhost:5003";

// Component to recenter map when driver location changes
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  
  return null;
};

const CustomerMap = ({ orderId }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default center (will be replaced by driver's location when available)
  const defaultCenter = [6.9271, 79.8612]; // Colombo

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on("connect", () => {
      console.log("✅ Socket connected for tracking");
    });

    console.log("test")
    // Listen for driver location updates
    socket.on("driverLocation", (data) => {
        console.log("checking data", data);
      // Check if this update is for our specific order
      if (data.orderId === orderId) {
        console.log("📍 Driver location update:", data);
        setDriverLocation({
          lat: data.lat,
          lng: data.lng,
          lastUpdated: new Date(data.timestamp)
        });
        setLoading(false);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      setError("Could not connect to tracking service");
      setLoading(false);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Driver's Location</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50">
          <Loader2 className="w-8 h-8 mr-3 text-blue-500 animate-spin" />
          <span className="text-gray-600">Connecting to tracking service...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-red-100 rounded-lg bg-red-50">
          <p className="font-medium text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">Please try refreshing the page.</p>
        </div>
      ) : !driverLocation ? (
        <div className="p-6 text-center border border-yellow-100 rounded-lg bg-yellow-50">
          <p className="font-medium text-amber-600">Waiting for driver location updates</p>
          <p className="mt-2 text-sm text-amber-500">
            Driver location will appear when they start the delivery.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-full h-64 overflow-hidden border border-gray-200 rounded-lg shadow-md md:h-80">
            <MapContainer
              center={[driverLocation.lat, driverLocation.lng]}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              
              <RecenterMap lat={driverLocation.lat} lng={driverLocation.lng} />
              
              <Marker
                position={[driverLocation.lat, driverLocation.lng]}
                icon={deliveryIcon}
              >
                <Popup>
                  <div className="font-medium">Delivery Partner</div>
                  <div className="text-xs text-gray-500">
                    Last updated: {driverLocation.lastUpdated.toLocaleTimeString()}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          
          <div className="p-3 border border-blue-100 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Last location update:</span> {driverLocation.lastUpdated.toLocaleTimeString()}
            </p>
            <p className="mt-1 text-xs text-blue-600">
              The map updates automatically when new location data is received.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMap;
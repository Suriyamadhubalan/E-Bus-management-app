import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import busImg from "../assets/bus.png";

// Custom Icons
const busIcon = new L.Icon({
  iconUrl: busImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const passengerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png", // Passenger Icon URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Haversine Formula to Calculate Distance (in km)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

// Function to Estimate ETA (in minutes)
const estimateETA = (distance) => {
  const speed = 75; // Assumed average speed in km/h
  return Math.round((distance / speed) * 60); // ETA in minutes
};

export default function PassengerTrackingPage() {
  const { busId } = useParams();
  const [busLocation, setBusLocation] = useState(null);
  const [passengerLocation, setPassengerLocation] = useState(null);
  const [eta, setETA] = useState(null);

  useEffect(() => {
    // Get Passenger's Current Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPassengerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );

      // Track Passenger's Movement
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setPassengerLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error watching location:", error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    const busRef = doc(db, "busses", busId);
    const unsubscribe = onSnapshot(busRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.liveLocation) {
          setBusLocation(data.liveLocation);
        }
      }
    });

    return () => unsubscribe();
  }, [busId]);

  // Calculate ETA when both locations are available
  useEffect(() => {
    if (busLocation && passengerLocation) {
      const distance = haversineDistance(
        busLocation.latitude,
        busLocation.longitude,
        passengerLocation.latitude,
        passengerLocation.longitude
      );

      setETA(estimateETA(distance));
    }
  }, [busLocation, passengerLocation]);

  // console.log(eta)

  return (
    <div className="h-screen w-full">
      {busLocation && passengerLocation ? (
        <MapContainer
          center={[passengerLocation.latitude, passengerLocation.longitude]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Passenger Location Marker with ETA */}
          <Marker
            position={[passengerLocation.latitude, passengerLocation.longitude]}
            icon={passengerIcon}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
            ETA: {eta !== null && eta !== undefined ? `${eta} min` : "Calculating..."}
            </Tooltip>
          </Marker>

          {/* Bus Location Marker */}
          <Marker
            position={[busLocation.latitude, busLocation.longitude]}
            icon={busIcon}
          />
        </MapContainer>
      ) : (
        <p className="text-center text-lg font-bold mt-10">
          Fetching Locations...
        </p>
      )}
    </div>
  );
}

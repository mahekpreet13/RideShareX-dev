import React, { useEffect, useState } from "react";
import RideService from "../Services/RideService";

function DriverRequests() {
  const [requests, setRequests] = useState([]);

useEffect(() => {
  const fetchData = () => {
    RideService.getDriverRequests()
      .then(setRequests)
      .catch(console.error);
  };

  fetchData();

  const interval = setInterval(fetchData, 3000); // refresh every 3 sec

  return () => clearInterval(interval);
}, []);
  const updateStatus = async (id, status) => {
    try {
      await RideService.updateRequestStatus(id, status);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };
  useEffect(() => {
  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const token = localStorage.getItem("token");

          await fetch("http://localhost:8080/drivers/me/location", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          });

          console.log("Driver location sent");
        } catch (err) {
          console.error("Location send error", err);
        }
      }
    );
  };

  sendLocation(); // first call
  const interval = setInterval(sendLocation, 3000); // every 3 sec

  return () => clearInterval(interval);
}, []);

  return (
    <div className="container">
      <h2>Driver Panel</h2>

      {requests.map((req) => (
        <div key={req.id} className="ride-card">
          <div>
            {req.requestedRide?.origin} → {req.requestedRide?.destination}
          </div>

          <div>Status: {req.status}</div>
{/* Step 1: Accept / Reject */}
{req.status === "MATCHED" && (
  <>
    <button onClick={() => updateStatus(req.id, "ACCEPTED")}>
      Accept
    </button>
    <button onClick={() => updateStatus(req.id, "REJECTED")}>
      Reject
    </button>
  </>
)}

{req.status === "ACCEPTED" && (
  <p>Ride already accepted</p>
)}

{/* Step 2: Driver on the way */}
{req.status === "ACCEPTED" && (
  <button onClick={() => updateStatus(req.id, "DRIVER_ARRIVING")}>
    I'm On The Way
  </button>
)}

{/* Step 3: Start ride */}
{req.status === "DRIVER_ARRIVING" && (
  <button onClick={() => updateStatus(req.id, "IN_PROGRESS")}>
    Start Ride
  </button>
)}

{/* Step 4: Complete ride */}
{req.status === "IN_PROGRESS" && (
  <button onClick={() => updateStatus(req.id, "COMPLETED")}>
    Complete Ride
  </button>
)}
        </div>
      ))}
    </div>
  );
}

export default DriverRequests;
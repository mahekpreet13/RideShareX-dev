import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RideService from "../Services/RideService";
import { useNavigate as useNav } from "react-router-dom";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const nav = useNav();

  // 🔥 Load requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    RideService.getMyRideRequests()
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, [navigate]);

  const handleCancel = async (requestId) => {
    try {
      await RideService.cancelRideRequest(requestId);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      alert("Request cancelled");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel request");
    }
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <div className="container">
        <h2>My Ride Requests</h2>

        {requests.length === 0 ? (
          <p>No ride requests yet</p>
        ) : (
          requests.map((request) => {
            const driver = request.driver;

            return (
              <div key={request.id} className="ride-card">
                <div style={{ fontWeight: "600" }}>
                  {request.requestedRide?.origin} →{" "}
                  {request.requestedRide?.destination}
                </div>

                <div>Status: {request.status}</div>

                {/* DRIVER INFO */}
                {driver && (
                  <div>
                    <strong>Driver:</strong> {driver.username}
                  </div>
                )}

                {/* 🚀 TRACK BUTTON */}
                {driver && request.status !== "COMPLETED" && (
                  <button
                    onClick={() =>
                      nav(`/track/${driver.username}`)
                    }
                  >
                    Track Driver 🚗
                  </button>
                )}

                <button onClick={() => handleCancel(request.id)}>
                  Cancel Request
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyRequests;
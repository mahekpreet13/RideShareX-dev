import React, { useState, useEffect } from "react";
import RideService from "../Services/RideService";
import { useNavigate } from "react-router-dom";

function Home() {
  const [rides, setRides] = useState([]);
  const [rideRequestInfo, setRideRequestInfo] = useState({});
  const [paidRequests, setPaidRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const ridesData = await RideService.getAvailableRides();

        if (Array.isArray(ridesData)) {
          setRides(ridesData);
        } else {
          setRides([]);
        }

        const token = localStorage.getItem("token");

        if (token) {
          const requestsData = await RideService.getMyRideRequests();

          if (Array.isArray(requestsData)) {
            const infoMap = {};

            requestsData.forEach((request) => {
              const rideId = request.requestedRide?.id;

              if (rideId) {
                infoMap[rideId] = {
                  requestId: request.id,
                  status: request.status || "PENDING",
                  driverUsername: request.driver?.username || null,
                };
                console.log("Request:", request);
              }
            });

            setRideRequestInfo(infoMap);
          }
        }
      } catch (err) {
        console.error(err);
        setRides([]);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);

 const requestRide = (rideId) => {
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8080/rides/${rideId}/ride-requests?pickupLat=${lat}&pickupLng=${lng}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          alert("Failed: " + text);
          return;
        }

        const data = await res.json();

        setRideRequestInfo((prev) => ({
          ...prev,
          [rideId]: {
            requestId: data.id,
            status: "PENDING",
            driverUsername: null,
          },
        }));

        alert("Ride requested successfully 🚗");
      } catch (err) {
        console.error(err);
        alert("Error requesting ride");
      }
    },
    (err) => {
      console.error(err);
      alert("Please allow location access");
    }
  );
};

  const handlePayment = async (rideId) => {
    try {
      const requestInfo = rideRequestInfo[rideId];

      if (!requestInfo?.requestId) {
        alert("Ride request missing");
        return;
      }

      await RideService.makePayment(requestInfo.requestId);

      alert("Payment Successful ✅");

      setPaidRequests((prev) => [...prev, rideId]);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
       case "MATCHED":
      return "yellow";
      case "ACCEPTED":
        return "green";
      case "REJECTED":
        return "red";
      case "DRIVER_ARRIVING":
        return "blue";
      case "IN_PROGRESS":
        return "purple";
      case "COMPLETED":
        return "gray";
      case "PENDING":
        return "orange";
      default:
        return "#555";
    }
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <div className="container">
        <h2>Available Rides</h2>

        {rides.length === 0 ? (
          <p>No rides available</p>
        ) : (
          rides.map((ride) => {
            const requestInfo = rideRequestInfo[ride.id];
            const status = requestInfo?.status;
            const driverUsername = requestInfo?.driverUsername;

            return (
              <div key={ride.id} className="ride-card">
                <div style={{ fontWeight: "600" }}>
                  {ride.origin} → {ride.destination}
                </div>

                <div style={{ fontSize: "13px", color: "#555" }}>
                  Capacity: {ride.capacity}
                </div>

                <div style={{ fontSize: "13px", color: "#555" }}>
                  Fare: ₹{ride.estimatedFare}
                </div>

                {status ? (
                  <>
                    <p style={{ color: getStatusColor(status), fontWeight: "600" }}>
                      Status: {status}
                    </p>
                     {status === "MATCHED" && 
                    <p>Driver has been assigned and is on the way 🚗</p>
                  }

                    {status === "DRIVER_ARRIVING" && <p>Driver is on the way 🚗</p>}
                    {status === "IN_PROGRESS" && <p>Ride in progress 🛣️</p>}

                    {status === "COMPLETED" && (
                      <>
                        {!paidRequests.includes(ride.id) ? (
                          <button onClick={() => handlePayment(ride.id)}>
                            Pay ₹{ride.estimatedFare}
                          </button>
                        ) : (
                          <p style={{ color: "green", fontWeight: "600" }}>
                            Paid ✅ ₹{ride.estimatedFare}
                          </p>
                        )}
                      </>
                    )}

                   {driverUsername && (
                        <button onClick={() => navigate(`/driver-map/${driverUsername}`)}>
                          Track Driver
                        </button>
                      )}
                  </>
                ) : (
                  <button onClick={() => requestRide(ride.id)}>
                    Request Ride
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Home;
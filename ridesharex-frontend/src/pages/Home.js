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

  const getStatusConfig = (status) => {
    switch (status) {
      case "MATCHED":
        return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" };
      case "ACCEPTED":
        return { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" };
      case "REJECTED":
        return { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" };
      case "DRIVER_ARRIVING":
        return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" };
      case "IN_PROGRESS":
        return { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" };
      case "COMPLETED":
        return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
      case "PENDING":
        return { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Available Rides</h1>
            <p className="text-muted-foreground mt-1">Find and book your next journey</p>
          </div>
        </div>

        {rides.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">No rides available right now</h3>
            <p className="text-muted-foreground mt-1">Check back later or create a new request</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride) => {
              const requestInfo = rideRequestInfo[ride.id];
              const status = requestInfo?.status;
              const driverUsername = requestInfo?.driverUsername;
              const statusConfig = status ? getStatusConfig(status) : null;

              return (
                <div key={ride.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-all hover:shadow-md flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          ₹{ride.estimatedFare}
                        </span>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {ride.capacity} seats
                        </span>
                      </div>
                      
                      {status && (
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          {status}
                        </span>
                      )}
                    </div>

                    <div className="relative pl-6 space-y-4 mb-6">
                      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border"></div>
                      
                      <div className="relative">
                        <div className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-card"></div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Origin</p>
                        <p className="font-semibold text-foreground">{ride.origin}</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full bg-destructive ring-4 ring-card"></div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Destination</p>
                        <p className="font-semibold text-foreground">{ride.destination}</p>
                      </div>
                    </div>

                    {status && (
                      <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                        {status === "MATCHED" && <p className="text-foreground flex items-center gap-2"><span>🚘</span> Driver assigned, heading to you</p>}
                        {status === "DRIVER_ARRIVING" && <p className="text-foreground flex items-center gap-2"><span>📍</span> Driver is arriving</p>}
                        {status === "IN_PROGRESS" && <p className="text-foreground flex items-center gap-2"><span>🛣️</span> Ride in progress</p>}
                        {status === "COMPLETED" && <p className="text-foreground flex items-center gap-2"><span>✅</span> Ride completed</p>}
                        {status === "PENDING" && <p className="text-foreground flex items-center gap-2"><span>⏳</span> Waiting for driver...</p>}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-muted/30 border-t border-border mt-auto">
                    {status ? (
                      <div className="flex gap-2">
                        {status === "COMPLETED" && (
                          <>
                            {!paidRequests.includes(ride.id) ? (
                              <button 
                                onClick={() => handlePayment(ride.id)}
                                className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors hover:bg-primary/90"
                              >
                                Pay ₹{ride.estimatedFare}
                              </button>
                            ) : (
                              <div className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium text-center border border-green-200">
                                Paid ✅
                              </div>
                            )}
                          </>
                        )}
                        
                        {driverUsername && status !== "COMPLETED" && (
                          <button 
                            onClick={() => navigate(`/driver-map/${driverUsername}`)}
                            className="flex-1 bg-white border border-border text-foreground py-2 px-4 rounded-lg font-medium transition-colors hover:bg-secondary flex justify-center items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Track Driver
                          </button>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => requestRide(ride.id)}
                        className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium transition-all hover:bg-primary/90 hover:shadow-md flex justify-center items-center gap-2"
                      >
                        Book This Ride
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
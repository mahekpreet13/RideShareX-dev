import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RideService from "../Services/RideService";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Ride Requests</h1>
          <p className="text-muted-foreground mt-1">Track and manage your booked rides</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">No requests yet</h3>
            <p className="text-muted-foreground mt-1">When you book a ride, it will appear here.</p>
            <button 
              onClick={() => navigate("/rides")}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Rides
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const driver = request.driver;
              const statusConfig = getStatusConfig(request.status);

              return (
                <div key={request.id} className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-md">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-foreground font-medium text-lg">
                      <span>{request.requestedRide?.origin}</span>
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span>{request.requestedRide?.destination}</span>
                    </div>

                    {driver && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg w-max">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {driver.username.charAt(0).toUpperCase()}
                        </div>
                        <span>Driver: <span className="font-semibold text-foreground">{driver.username}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-3 min-w-[140px]">
                    {driver && request.status !== "COMPLETED" && (
                      <button
                        onClick={() => navigate(`/driver-map/${driver.username}`)}
                        className="flex-1 w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors hover:bg-primary/90 flex justify-center items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        Track
                      </button>
                    )}
                    
                    {request.status !== "COMPLETED" && (
                      <button 
                        onClick={() => handleCancel(request.id)}
                        className="flex-1 w-full bg-white border border-destructive/30 text-destructive hover:bg-destructive hover:text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Cancel
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

export default MyRequests;
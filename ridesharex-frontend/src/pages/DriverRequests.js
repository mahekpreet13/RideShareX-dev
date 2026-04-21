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
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Driver Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your incoming ride requests</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">No requests at the moment</h3>
            <p className="text-muted-foreground mt-1">We'll notify you when a passenger needs a ride.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const statusConfig = getStatusConfig(req.status);

              return (
                <div key={req.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-all hover:shadow-md">
                  <div className="p-6 border-b border-border/50">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        {req.status}
                      </span>
                      {req.user && (
                        <div className="text-sm font-medium text-foreground flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          Passenger: {req.user.username}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-foreground font-medium text-xl">
                      <span>{req.requestedRide?.origin}</span>
                      <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span>{req.requestedRide?.destination}</span>
                    </div>
                  </div>

                  <div className="bg-muted/20 p-4 sm:px-6 flex flex-wrap gap-3">
                    {req.status === "MATCHED" && (
                      <>
                        <button 
                          onClick={() => updateStatus(req.id, "ACCEPTED")}
                          className="flex-1 bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium transition-colors hover:bg-primary/90 flex justify-center items-center gap-2 min-w-[120px]"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Accept
                        </button>
                        <button 
                          onClick={() => updateStatus(req.id, "REJECTED")}
                          className="flex-1 bg-white border border-destructive/30 text-destructive hover:bg-destructive hover:text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 min-w-[120px]"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          Reject
                        </button>
                      </>
                    )}

                    {req.status === "ACCEPTED" && (
                      <button 
                        onClick={() => updateStatus(req.id, "DRIVER_ARRIVING")}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors hover:bg-blue-700 flex justify-center items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        I'm On The Way
                      </button>
                    )}

                    {req.status === "DRIVER_ARRIVING" && (
                      <button 
                        onClick={() => updateStatus(req.id, "IN_PROGRESS")}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-colors hover:bg-purple-700 flex justify-center items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Start Ride
                      </button>
                    )}

                    {req.status === "IN_PROGRESS" && (
                      <button 
                        onClick={() => updateStatus(req.id, "COMPLETED")}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors hover:bg-green-700 flex justify-center items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Complete Ride
                      </button>
                    )}
                    
                    {req.status === "COMPLETED" && (
                      <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-lg font-medium text-center flex justify-center items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Ride Completed Successfully
                      </div>
                    )}
                    
                    {req.status === "REJECTED" && (
                      <div className="w-full bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded-lg font-medium text-center">
                        Request was rejected
                      </div>
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

export default DriverRequests;
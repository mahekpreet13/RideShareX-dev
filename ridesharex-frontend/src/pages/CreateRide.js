import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RideService from "../Services/RideService";

function CreateRide() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fareLoading, setFareLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleEstimateFare = async () => {
    if (!origin || !destination || !distanceKm || !durationMin) {
      setMessage("Please fill in route details first");
      return;
    }
    
    setMessage("");
    setFareLoading(true);

    try {
      const result = await RideService.estimateFare({
        origin,
        destination,
        distanceKm: Number(distanceKm),
        estimatedDurationMin: Number(durationMin),
      });

      setEstimatedFare(result.estimatedFare);
    } catch (error) {
      console.error(error);
      setMessage("Failed to estimate fare");
      setEstimatedFare(null);
    } finally {
      setFareLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    if (estimatedFare === null) {
      setMessage("Please estimate fare before creating the ride");
      setLoading(false);
      return;
    }

    try {
      const ride = {
        origin,
        destination,
        departureTime,
        capacity: Number(capacity),
        isActive: true,
        distanceKm: Number(distanceKm),
        durationMin: Number(durationMin),
      };

      await RideService.createRide(ride);
      setMessage("Ride created successfully");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-secondary/30 py-10 px-4">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="bg-primary/5 border-b border-border p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Offer a Ride</h2>
          <p className="text-muted-foreground mt-2">Share your journey and split the costs.</p>
        </div>

        <div className="p-6 md:p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm border ${
              message.includes("successfully") 
                ? "bg-green-100 border-green-200 text-green-700" 
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Origin</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Where from?"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Destination</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Departure Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Available Seats</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. 3"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Total Distance (km)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. 15.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estimated Duration (mins)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. 45"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 border border-border flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
              <div>
                <h3 className="font-semibold text-foreground">Fare Estimation</h3>
                <p className="text-sm text-muted-foreground">Calculate the suggested contribution</p>
                {estimatedFare !== null && (
                  <div className="mt-2 text-2xl font-bold text-primary">
                    ₹{estimatedFare}
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleEstimateFare}
                disabled={fareLoading}
                className="w-full md:w-auto px-6 py-2.5 bg-white border border-border text-foreground font-medium rounded-lg shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all"
              >
                {fareLoading ? "Calculating..." : estimatedFare !== null ? "Recalculate Fare" : "Get Estimate"}
              </button>
            </div>

            <div className="pt-4 border-t border-border">
              <button 
                type="submit" 
                disabled={loading || estimatedFare === null}
                className="w-full py-4 px-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
              >
                {loading ? "Publishing Ride..." : "Publish Ride"}
              </button>
              {estimatedFare === null && (
                <p className="text-center text-xs text-muted-foreground mt-3">
                  * You must estimate the fare before publishing
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRide;
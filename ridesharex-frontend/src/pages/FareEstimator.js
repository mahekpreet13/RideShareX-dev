import React, { useState } from "react";
import RideService from "../Services/RideService";

function FareEstimator() {
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        origin: "A",
        destination: "B",
        distanceKm: Number(distance),
        estimatedDurationMin: Number(duration),
      };

      const result = await RideService.estimateFare(data);
      setFare(result.estimatedFare);
    } catch (err) {
      console.error(err);
      alert("Failed to calculate fare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Estimate Fare</h2>
            <p className="text-muted-foreground mt-2">Get a quick calculation before you book</p>
          </div>

          <form onSubmit={handleEstimate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="e.g. 12.5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="e.g. 30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !distance || !duration}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all mt-4"
            >
              {loading ? "Calculating..." : "Calculate Fare"}
            </button>
          </form>

          {fare !== null && (
            <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-xl text-center animate-in fade-in zoom-in duration-300">
              <p className="text-sm text-green-800 font-medium mb-1">Estimated Cost</p>
              <h3 className="text-4xl font-bold text-green-600">
                ₹{fare}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FareEstimator;
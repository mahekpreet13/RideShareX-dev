import React, { useState } from "react";
import RideService from "../Services/RideService";

function FareEstimator() {
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [fare, setFare] = useState(null);

  const handleEstimate = async () => {
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
    }
  };

  return (
    <div className="container">
      <h2>Estimate Fare</h2>

      <input
        type="number"
        placeholder="Distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button onClick={handleEstimate}>
        Calculate Fare
      </button>

      {fare !== null && (
        <h3 style={{ color: "green" }}>
          Estimated Fare: ₹{fare}
        </h3>
      )}
    </div>
  );
}

export default FareEstimator;
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
      }, 500);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <div className="container">
        <h2>Create Ride</h2>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />

          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Distance (km)"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={handleEstimateFare}
            disabled={fareLoading}
          >
            {fareLoading ? "Estimating..." : "Estimate Fare"}
          </button>

          {estimatedFare !== null && (
            <p
              style={{
                marginTop: "12px",
                fontWeight: "600",
                color: "green",
                textAlign: "center",
              }}
            >
              Estimated Fare: ₹{estimatedFare}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRide;
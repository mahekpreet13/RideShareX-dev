const BASE_URL = "http://localhost:8080";

class RideService {

  // =========================
  // 🚗 RIDES
  // =========================

  async getAvailableRides() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/rides`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch rides");

    return res.json();
  }

  async createRide(ride) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/rides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ride),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to create ride");
    }

    return res.json();
  }

  // =========================
  // 🙋 USER REQUESTS
  // =========================

  async requestRide(rideId, lat, lng) {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/rides/${rideId}/ride-requests?pickupLat=${lat}&pickupLng=${lng}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to request ride");

    return res.json();
  }

  async getMyRideRequests() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/rides/my-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch requests");

    return res.json();
  }

  async cancelRideRequest(requestId) {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/rides/ride-requests/${requestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to cancel request");

    return true;
  }

  // =========================
  // 🚕 DRIVER SIDE
  // =========================

  async getDriverRequests() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/rides/driver/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch driver requests");

    return res.json();
  }

  async updateRequestStatus(id, status) {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/rides/ride-requests/${id}/status?status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to update status");
  }

  // =========================
  // 📍 DRIVER LOCATION
  // =========================

  async getDriverLocation(username) {
    const res = await fetch(`${BASE_URL}/drivers/${username}/location`);

    if (!res.ok) throw new Error("Failed to fetch driver location");

    return res.json();
  }

  // =========================
  // 💰 PAYMENT
  // =========================

  async estimateFare(data) {
    const res = await fetch(`${BASE_URL}/fare/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to estimate fare");

    return res.json();
  }

  async makePayment(rideRequestId) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/payments/mock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rideRequestId,
        paymentMethod: "UPI",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return res.json();
  }
}

export default new RideService();
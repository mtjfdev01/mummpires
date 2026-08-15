const PRODUCTION_API = "https://mummpiresbackend-production.up.railway.app";

const API =
  process.env.NODE_ENV === "development" ? "" : PRODUCTION_API;

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export function getAvailability() {
  return fetch(`${API}/api/reservations/availability`).then(parse);
}

export function createReservation(payload) {
  return fetch(`${API}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parse);
}

export function adminLogin(username, password) {
  return fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(parse);
}

export function listReservations(token) {
  return fetch(`${API}/api/reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(parse);
}

export function createManualReservation(token, payload) {
  return fetch(`${API}/api/reservations/manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then(parse);
}

export function updateReservationStatus(token, id, status) {
  return fetch(`${API}/api/reservations/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }).then(parse);
}

import { useCallback, useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaPlus, FaSignOutAlt } from "react-icons/fa";
import {
  adminLogin,
  createManualReservation,
  listReservations,
  updateReservationStatus,
} from "../api";
import RsvpForm from "../components/RsvpForm/RsvpForm";
import { sessionLabel, venueLabel } from "../rsvpOptions";
import styles from "./AdminPage.module.css";

const TOKEN_KEY = "mummpires-admin-token";

function AdminPage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY) || ""
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const load = useCallback(async (authToken = token) => {
    const data = await listReservations(authToken);
    setRows(Array.isArray(data) ? data : []);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    load(token).catch(() => {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken("");
    });
  }, [token, load]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setRows([]);
  };

  const changeStatus = async (id, status) => {
    const updated = await updateReservationStatus(token, id, status);
    setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
  };

  if (!token) {
    return (
      <section className={styles.page}>
        <form className={styles.login} onSubmit={handleLogin}>
          <img src="/assets/logo.png" alt="MuMMpires" className={styles.logo} />
          <h1>Admin Access</h1>
          <p>Authorized personnel only.</p>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPassword((open) => !open)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="submit" disabled={loading}>
            <FaLock />
            {loading ? "Signing in..." : "Enter"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div>
            <img src="/assets/logo.png" alt="" className={styles.smallLogo} />
            <h1>Reservation Requests</h1>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => setShowAdd(true)}>
              <FaPlus /> Add reservation
            </button>
            <button type="button" className={styles.ghost} onClick={logout}>
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        </header>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Session</th>
                <th>Venue</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No reservation requests yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.fullName}</strong>
                      <span>{row.email}</span>
                      <span>{row.mobile}</span>
                    </td>
                    <td>{sessionLabel(row.sessionFormat)}</td>
                    <td>{venueLabel(row.venue)}</td>
                    <td>
                      {row.firstChoiceDate}
                      <span>{row.secondChoiceDate}</span>
                    </td>
                    <td>
                      <select
                        value={row.status}
                        onChange={(event) =>
                          changeStatus(row.id, event.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td>{row.source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd ? (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <header>
              <h2>Add reservation</h2>
              <button type="button" onClick={() => setShowAdd(false)}>
                Close
              </button>
            </header>
            <RsvpForm
              variant="embedded"
              submitLabel="Save reservation"
              onSubmitted={async (payload) => {
                const created = await createManualReservation(token, payload);
                await load();
                setShowAdd(false);
                return created;
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminPage;

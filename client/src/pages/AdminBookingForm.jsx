import { useEffect, useMemo, useState } from "react";
import { getAvailability } from "../api";
import {
  DINNER_SLOTS,
  LUNCH_SLOTS,
  ALL_SLOTS,
  VENUE_OPTIONS,
  sessionFromSlot,
} from "../rsvpOptions";
import styles from "./AdminBookingForm.module.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatPretty(key) {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AdminBookingForm({ onSubmitted, onCancel }) {
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [venue, setVenue] = useState("private-dining");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [assistantContact, setAssistantContact] = useState("");
  const [dietary, setDietary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState({ slots: {} });

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const takenSlots = availability.slots || {};

  useEffect(() => {
    getAvailability()
      .then((data) =>
        setAvailability({
          lunch: data.lunch || [],
          dinner: data.dinner || [],
          slots: data.slots || {},
        })
      )
      .catch(() => {});
  }, []);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list = [];
    for (let i = 0; i < startPad; i += 1) list.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      list.push(new Date(year, month, day));
    }
    return list;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isFullyBooked = (key) => {
    const taken = takenSlots[key] || [];
    return ALL_SLOTS.every((slot) => taken.includes(slot.value));
  };

  const pickDate = (key) => {
    setDate(key);
    setSlotTime("");
    setError("");
  };

  const pickSlot = (value) => {
    const taken = (takenSlots[date] || []).includes(value);
    if (taken) {
      setError(
        "This slot is not available. Please choose another time or date."
      );
      return;
    }
    setSlotTime(value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!date || !slotTime) {
      setError("Please pick a date and an available time slot.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmitted({
        sessionFormat: sessionFromSlot(slotTime),
        venue,
        firstChoiceDate: date,
        secondChoiceDate: "",
        slotTime,
        dietary: dietary.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        assistantContact: assistantContact.trim(),
      });
    } catch (err) {
      setError(err.message || "Unable to save reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderSlots = (title, slots) => {
    const taken = takenSlots[date] || [];
    return (
      <div className={styles.slotCol}>
        <h4>{title}</h4>
        {slots.map((slot) => {
          const unavailable = taken.includes(slot.value);
          return (
            <button
              key={slot.value}
              type="button"
              disabled={unavailable}
              className={`${styles.slotBtn} ${
                slotTime === slot.value ? styles.slotOn : ""
              }`}
              onClick={() => pickSlot(slot.value)}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.intro}>
        <h3>Pick a date and time</h3>
        <p>Duration: 30 minutes</p>
        <p>Your time zone: United States; Eastern time</p>
      </div>

      <div className={styles.scheduler}>
        <div className={styles.calendar}>
          <div className={styles.calHeader}>
            <button
              type="button"
              className={styles.calNav}
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                )
              }
              aria-label="Previous month"
            >
              ‹
            </button>
            <p>{monthLabel}</p>
            <button
              type="button"
              className={styles.calNav}
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                )
              }
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className={styles.calGrid}>
            {WEEKDAYS.map((day) => (
              <span key={day} className={styles.calDow}>
                {day}
              </span>
            ))}
            {cells.map((cell, index) => {
              if (!cell) return <span key={`e-${index}`} />;
              const key = toKey(cell);
              const past = cell < today;
              const full = isFullyBooked(key);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={past || full}
                  className={`${styles.calDay} ${
                    date === key ? styles.calOn : ""
                  } ${full ? styles.calTaken : ""}`}
                  onClick={() => pickDate(key)}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.times}>
          {date ? (
            <>
              <p className={styles.timesHead}>
                Available starting times for {formatPretty(date)}
              </p>
              <div className={styles.slotGrid}>
                {renderSlots("Lunch", LUNCH_SLOTS)}
                {renderSlots("Dinner", DINNER_SLOTS)}
              </div>
            </>
          ) : (
            <p className={styles.timesHead}>
              Select a date to see available lunch and dinner slots.
            </p>
          )}
        </div>
      </div>

      <fieldset className={styles.block}>
        <legend>Venue</legend>
        <div className={styles.options}>
          {VENUE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`${styles.option} ${
                venue === option.value ? styles.optionOn : ""
              }`}
            >
              <input
                type="radio"
                name="venue"
                value={option.value}
                checked={venue === option.value}
                onChange={() => setVenue(option.value)}
              />
              <span>{option.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.block}>
        <legend>Contact details (optional)</legend>
        <p className={styles.hint}>
          If you enter an email, a confirmation will be sent. Otherwise the
          booking is saved without an email.
        </p>
        <div className={styles.fields}>
          <label>
            Full name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Mobile
            <input
              type="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
            />
          </label>
          <label>
            Assistant contact
            <input
              value={assistantContact}
              onChange={(event) => setAssistantContact(event.target.value)}
            />
          </label>
          <label className={styles.full}>
            Dietary notes
            <input
              value={dietary}
              onChange={(event) => setDietary(event.target.value)}
            />
          </label>
        </div>
      </fieldset>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save reservation"}
        </button>
      </div>
    </form>
  );
}

export default AdminBookingForm;

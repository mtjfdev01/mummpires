import { useEffect, useMemo, useState } from "react";
import { FaLock } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineShield } from "react-icons/md";
import { createReservation, getAvailability } from "../../api";
import {
  ALL_SLOTS,
  DINNER_SLOTS,
  LUNCH_SLOTS,
  SESSION_OPTIONS,
  VENUE_OPTIONS,
  emptyRsvp,
  isSlotVenue,
  sessionSlotTime,
} from "../../rsvpOptions";
import styles from "./RsvpForm.module.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Calendar({ selectedDate, isDisabled, onSelect }) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

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

  const label = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <button
          type="button"
          className={styles.calNav}
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
          aria-label="Previous month"
        >
          ‹
        </button>
        <p>{label}</p>
        <button
          type="button"
          className={styles.calNav}
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
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
        {cells.map((date, index) => {
          if (!date) return <span key={`e-${index}`} />;
          const key = toKey(date);
          const full = isDisabled(key);
          const disabled = date < today || full;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              className={`${styles.calDay} ${
                key === selectedDate ? styles.calFirst : ""
              } ${full ? styles.calTaken : ""}`}
              onClick={() => onSelect(key)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RsvpForm({
  variant = "page",
  onSubmitted,
  submitLabel = "Confirm Private Invitation & Reservation",
}) {
  const [form, setForm] = useState(emptyRsvp);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState({
    rumi: { lunch: [], dinner: [] },
    slots: {},
  });

  const takenSlots = availability.slots || {};
  const rumiLunch = availability.rumi?.lunch || [];
  const rumiDinner = availability.rumi?.dinner || [];
  const slotBooking = isSlotVenue(form.venue);

  const applyAvailability = (data) => {
    setAvailability({
      rumi: {
        lunch: data.rumi?.lunch || data.lunch || [],
        dinner: data.rumi?.dinner || data.dinner || [],
      },
      slots: data.starbucks?.slots || data.slots || {},
    });
  };

  useEffect(() => {
    getAvailability().then(applyAvailability).catch(() => {});
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const isFullyBooked = (key) => {
    if (slotBooking) {
      const taken = takenSlots[key] || [];
      return ALL_SLOTS.every((slot) => taken.includes(slot.value));
    }
    const taken = rumiLunch.includes(key) && rumiDinner.includes(key);
    return taken;
  };

  const rumiSessionTaken = (value) =>
    (value === "dinner" ? rumiDinner : rumiLunch).includes(form.firstChoiceDate);

  const setVenue = (value) => {
    setForm((prev) => ({
      ...prev,
      venue: value,
      firstChoiceDate: "",
      secondChoiceDate: "",
      slotTime: "",
      sessionFormat: "lunch",
    }));
    setError("");
  };

  const pickDate = (key) => {
    if (isFullyBooked(key)) {
      setError(
        slotBooking
          ? "This date is fully booked. Please choose another date."
          : "Both lunch and dinner are booked on this date. Please choose another date."
      );
      return;
    }
    setForm((prev) => ({
      ...prev,
      firstChoiceDate: key,
      secondChoiceDate: "",
      slotTime: "",
    }));
    setError("");
  };

  const pickRumiSession = (value) => {
    if (rumiSessionTaken(value)) {
      setError(
        "This session is not available. Please choose another date or the other session."
      );
      return;
    }
    setForm((prev) => ({
      ...prev,
      sessionFormat: value,
      slotTime: sessionSlotTime(value),
    }));
    setError("");
  };

  const pickSlot = (value) => {
    const taken = (takenSlots[form.firstChoiceDate] || []).includes(value);
    if (taken) {
      setError(
        "This slot is not available. Please choose another time or date."
      );
      return;
    }
    setForm((prev) => ({
      ...prev,
      slotTime: value,
      sessionFormat: DINNER_SLOTS.some((slot) => slot.value === value)
        ? "dinner"
        : "lunch",
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.venue) {
      setError("Please choose a location.");
      return;
    }
    if (!form.firstChoiceDate) {
      setError("Please pick an available date.");
      return;
    }
    if (!form.slotTime) {
      setError(
        slotBooking
          ? "Please pick a date and an available time slot."
          : "Please choose lunch or dinner."
      );
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        slotTime: form.slotTime,
      };
      const created = await (onSubmitted
        ? onSubmitted(payload)
        : createReservation(payload));
      setSuccess(true);
      setForm(emptyRsvp);
      const next = await getAvailability().catch(() => null);
      if (next) applyAvailability(next);
      return created;
    } catch (err) {
      setError(err.message || "Unable to submit reservation.");
      const next = await getAvailability().catch(() => null);
      if (next) applyAvailability(next);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const confirmation = (
      <p className={styles.successDone} role="status">
        Your request has been received. Our concierge will contact you within 2
        hours.
      </p>
    );

    if (variant === "embedded") {
      return confirmation;
    }

    return (
      <section className={styles.section} id="rsvp" aria-labelledby="rsvp-heading">
        <div className={styles.frame}>
          <h2 id="rsvp-heading" className={styles.title}>
            Reservation Received
          </h2>
          {confirmation}
        </div>
      </section>
    );
  }

  const inner = (
    <form className={styles.form} onSubmit={handleSubmit}>
      <article className={styles.card}>
        <header className={styles.cardHead}>
          <span className={styles.num}>1</span>
          <h3>Specific Venue</h3>
        </header>
        <div className={styles.options}>
          {VENUE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`${styles.option} ${
                form.venue === option.value ? styles.optionOn : ""
              }`}
            >
              <input
                type="radio"
                name="venue"
                value={option.value}
                checked={form.venue === option.value}
                onChange={() => setVenue(option.value)}
              />
              <span className={styles.venueChoice}>
                <HiOutlineLocationMarker />
                <span>
                  <strong>{option.title}</strong>
                  <em>{option.detail}</em>
                </span>
              </span>
            </label>
          ))}
        </div>
      </article>

      <article className={`${styles.card} ${styles.full}`}>
        <header className={styles.cardHead}>
          <span className={styles.num}>2</span>
          <h3>Date & Time</h3>
        </header>
        <div className={styles.dateLayout}>
          <Calendar
            selectedDate={form.firstChoiceDate}
            isDisabled={isFullyBooked}
            onSelect={pickDate}
          />
          <div className={styles.times}>
            {slotBooking ? (
              form.firstChoiceDate ? (
                <>
                  <p className={styles.timesHead}>
                    Available starting times for{" "}
                    {formatPretty(form.firstChoiceDate)}
                  </p>
                  <div className={styles.slotGrid}>
                    <div className={styles.slotCol}>
                      <h4>Lunch</h4>
                      {LUNCH_SLOTS.map((slot) => {
                        const taken = (
                          takenSlots[form.firstChoiceDate] || []
                        ).includes(slot.value);
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            disabled={taken}
                            className={`${styles.slotBtn} ${
                              form.slotTime === slot.value ? styles.slotOn : ""
                            }`}
                            onClick={() => pickSlot(slot.value)}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className={styles.slotCol}>
                      <h4>Dinner</h4>
                      {DINNER_SLOTS.map((slot) => {
                        const taken = (
                          takenSlots[form.firstChoiceDate] || []
                        ).includes(slot.value);
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            disabled={taken}
                            className={`${styles.slotBtn} ${
                              form.slotTime === slot.value ? styles.slotOn : ""
                            }`}
                            onClick={() => pickSlot(slot.value)}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <p className={styles.timesHead}>
                  Select a date to see available Starbucks time slots.
                </p>
              )
            ) : form.firstChoiceDate ? (
              <>
                <p className={styles.timesHead}>
                  Choose lunch or dinner for{" "}
                  {formatPretty(form.firstChoiceDate)}
                </p>
                <div className={styles.sessionSlots}>
                  {SESSION_OPTIONS.map((option) => {
                    const taken = rumiSessionTaken(option.value);
                    const selected =
                      form.slotTime === sessionSlotTime(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={taken}
                        className={`${styles.sessionSlot} ${
                          selected ? styles.slotOn : ""
                        }`}
                        onClick={() => pickRumiSession(option.value)}
                      >
                        <strong>{option.title}</strong>
                        <em>{option.detail}</em>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className={styles.timesHead}>
                Select a date to see lunch and dinner availability.
              </p>
            )}
          </div>
        </div>
      </article>

      <article className={styles.card}>
        <header className={styles.cardHead}>
          <span className={styles.num}>3</span>
          <h3>Contact Details</h3>
        </header>
        <div className={styles.fields}>
          <label>
            Full Name <span>*</span>
            <input
              required
              value={form.fullName}
              onChange={(event) => setField("fullName", event.target.value)}
            />
          </label>
          <label>
            Email <span>*</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
            />
          </label>
          <label>
            Direct Mobile Number <span>*</span>
            <input
              required
              type="tel"
              value={form.mobile}
              onChange={(event) => setField("mobile", event.target.value)}
            />
          </label>
          <label>
            Preferred Assistant Contact (Optional)
            <input
              placeholder="Name / Mobile / Email"
              value={form.assistantContact}
              onChange={(event) =>
                setField("assistantContact", event.target.value)
              }
            />
          </label>
        </div>
      </article>

      {error ? <p className={`${styles.error} ${styles.full}`}>{error}</p> : null}

      <button type="submit" className={`${styles.submit} ${styles.full}`} disabled={submitting}>
        <FaLock />
        <span>
          {submitting ? "Submitting..." : submitLabel}
        </span>
      </button>
      <p className={`${styles.secure} ${styles.full}`}>
        <MdOutlineShield />
        Your information is confidential and will never be shared.
      </p>
    </form>
  );

  if (variant === "embedded") {
    return inner;
  }

  return (
    <section className={styles.section} id="rsvp" aria-labelledby="rsvp-heading">
      <div className={styles.frame}>
        <h2 id="rsvp-heading" className={styles.title}>
          Select Your Engagement Preference
        </h2>
        {inner}
      </div>
    </section>
  );
}

export default RsvpForm;

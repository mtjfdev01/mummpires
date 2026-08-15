import { useEffect, useMemo, useState } from "react";
import { FaLock } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineShield } from "react-icons/md";
import { createReservation, getAvailability } from "../../api";
import { SESSION_OPTIONS, VENUE_OPTIONS, emptyRsvp } from "../../rsvpOptions";
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

function Calendar({
  firstChoiceDate,
  secondChoiceDate,
  unavailableDates = [],
  onSelect,
}) {
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
          const taken = unavailableDates.includes(key);
          const disabled = date < today || taken;
          const isFirst = key === firstChoiceDate;
          const isSecond = key === secondChoiceDate;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              title={
                taken
                  ? "This slot is not available. Please choose another date."
                  : undefined
              }
              className={`${styles.calDay} ${isFirst ? styles.calFirst : ""} ${
                isSecond ? styles.calSecond : ""
              } ${taken ? styles.calTaken : ""}`}
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
  const [activeDate, setActiveDate] = useState("first");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState({ lunch: [], dinner: [] });

  const unavailableDates = availability[form.sessionFormat] || [];
  const otherSession =
    form.sessionFormat === "lunch"
      ? "Exclusive Dinner Session"
      : "Private Executive Lunch";

  useEffect(() => {
    getAvailability()
      .then((data) =>
        setAvailability({
          lunch: data.lunch || [],
          dinner: data.dinner || [],
        })
      )
      .catch(() => {});
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const setSession = (value) => {
    const taken = availability[value] || [];
    setForm((prev) => ({
      ...prev,
      sessionFormat: value,
      firstChoiceDate: taken.includes(prev.firstChoiceDate)
        ? ""
        : prev.firstChoiceDate,
      secondChoiceDate: taken.includes(prev.secondChoiceDate)
        ? ""
        : prev.secondChoiceDate,
    }));
    setError("");
  };

  const pickDate = (key) => {
    if (unavailableDates.includes(key)) {
      setError(
        `This slot is not available. Please choose another date or try the ${otherSession}.`
      );
      return;
    }
    if (activeDate === "first" || !form.firstChoiceDate) {
      setField("firstChoiceDate", key);
      setActiveDate("second");
      return;
    }
    if (key === form.firstChoiceDate) return;
    setField("secondChoiceDate", key);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const created = await (onSubmitted
        ? onSubmitted(form)
        : createReservation(form));
      setSuccess(true);
      setForm(emptyRsvp);
      setActiveDate("first");
      const next = await getAvailability().catch(() => null);
      if (next) {
        setAvailability({
          lunch: next.lunch || [],
          dinner: next.dinner || [],
        });
      }
      return created;
    } catch (err) {
      setError(err.message || "Unable to submit reservation.");
      const next = await getAvailability().catch(() => null);
      if (next) {
        setAvailability({
          lunch: next.lunch || [],
          dinner: next.dinner || [],
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inner = (
    <form className={styles.form} onSubmit={handleSubmit}>
      <article className={styles.card}>
        <header className={styles.cardHead}>
          <span className={styles.num}>1</span>
          <h3>Session Format</h3>
        </header>
        <div className={styles.options}>
          {SESSION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`${styles.option} ${
                form.sessionFormat === option.value ? styles.optionOn : ""
              }`}
            >
              <input
                type="radio"
                name="sessionFormat"
                value={option.value}
                checked={form.sessionFormat === option.value}
                onChange={() => setSession(option.value)}
              />
              <span>
                <strong>{option.title}</strong>
                <em>{option.detail}</em>
              </span>
            </label>
          ))}
        </div>
      </article>

      <article className={styles.card}>
        <header className={styles.cardHead}>
          <span className={styles.num}>2</span>
          <h3>Specific Venue</h3>
        </header>
        <p className={styles.venueMeta}>
          <HiOutlineLocationMarker />
          <span>
            Rumi&apos;s Kitchen — Avalon
            <br />
            7105 Avalon Blvd, Alpharetta, GA 30009
          </span>
        </p>
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
                onChange={() => setField("venue", option.value)}
              />
              <span>
                <strong>{option.title}</strong>
              </span>
            </label>
          ))}
        </div>
      </article>

      <article className={`${styles.card} ${styles.full}`}>
        <header className={styles.cardHead}>
          <span className={styles.num}>3</span>
          <h3>Date Availability</h3>
        </header>
        <div className={styles.dateLayout}>
          <div>
            <div className={styles.dateRow}>
              <button
                type="button"
                className={`${styles.dateField} ${
                  activeDate === "first" ? styles.dateFieldOn : ""
                }`}
                onClick={() => setActiveDate("first")}
              >
                <span>1st Choice</span>
                <strong>
                  {formatPretty(form.firstChoiceDate) || "Select date"}
                </strong>
                <HiOutlineCalendar />
              </button>
              <button
                type="button"
                className={`${styles.dateField} ${
                  activeDate === "second" ? styles.dateFieldOn : ""
                }`}
                onClick={() => setActiveDate("second")}
              >
                <span>2nd Choice</span>
                <strong>
                  {formatPretty(form.secondChoiceDate) || "Select date"}
                </strong>
                <HiOutlineCalendar />
              </button>
            </div>
            <p className={styles.note}>
              All times are subject to availability. Unavailable dates are
              dimmed on the calendar.
            </p>
          </div>
          <Calendar
            firstChoiceDate={form.firstChoiceDate}
            secondChoiceDate={form.secondChoiceDate}
            unavailableDates={unavailableDates}
            onSelect={pickDate}
          />
        </div>
      </article>

      <article className={styles.card}>
        <header className={styles.cardHead}>
          <span className={styles.num}>4</span>
          <h3>Catering / Dietary</h3>
        </header>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Dietary Preferences & Special Accommodations"
          value={form.dietary}
          onChange={(event) => setField("dietary", event.target.value)}
        />
      </article>

      <article className={styles.card}>
        <header className={styles.cardHead}>
          <span className={styles.num}>5</span>
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
      {success ? (
        <p className={`${styles.success} ${styles.full}`}>
          Your request has been received. Our concierge will contact you within
          2 hours.
        </p>
      ) : null}

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

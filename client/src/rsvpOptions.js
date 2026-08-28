export const SESSION_OPTIONS = [
  {
    value: "lunch",
    title: "Private Executive Lunch",
    detail: "12:30 PM - 2:00 PM",
  },
  {
    value: "dinner",
    title: "Private Executive Dinner",
    detail: "7:00 PM - 9:00 PM",
  },
];

export const VENUE_OPTIONS = [
  {
    value: "private-dining",
    title: "Rumi's Kitchen — Avalon",
    detail: "7105 Avalon Blvd, Alpharetta, GA 30009",
    booking: "session",
  },
  {
    value: "starbucks",
    title: "Starbucks",
    detail: "Alpharetta, Georgia",
    booking: "slots",
  },
];

export const LUNCH_SLOTS = [
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
];

export const DINNER_SLOTS = [
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
];

export const ALL_SLOTS = [...LUNCH_SLOTS, ...DINNER_SLOTS];

export const emptyRsvp = {
  sessionFormat: "lunch",
  venue: "private-dining",
  firstChoiceDate: "",
  secondChoiceDate: "",
  slotTime: "",
  dietary: "",
  fullName: "",
  email: "",
  mobile: "",
  assistantContact: "",
};

export function isSlotVenue(value) {
  return value === "starbucks";
}

export function sessionLabel(value) {
  return SESSION_OPTIONS.find((item) => item.value === value)?.title || value;
}

export function sessionDetail(value) {
  return SESSION_OPTIONS.find((item) => item.value === value)?.detail || "";
}

export function venueLabel(value) {
  return VENUE_OPTIONS.find((item) => item.value === value)?.title || value;
}

export function slotLabel(value) {
  return ALL_SLOTS.find((item) => item.value === value)?.label || value || "";
}

export function sessionFromSlot(value) {
  if (DINNER_SLOTS.some((item) => item.value === value)) return "dinner";
  return "lunch";
}

export function bookingTimeLabel(venue, sessionFormat, slotTime) {
  if (isSlotVenue(venue) && slotTime) return slotLabel(slotTime);
  return sessionDetail(sessionFormat) || "Full session";
}

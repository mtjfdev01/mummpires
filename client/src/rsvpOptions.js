export const SESSION_OPTIONS = [
  {
    value: "lunch",
    title: "Private Executive Lunch",
    detail: "12:30 PM - 2:00 PM",
  },
  {
    value: "dinner",
    title: "Exclusive Dinner Session",
    detail: "7:00 PM - 9:00 PM",
  },
];

export const VENUE_OPTIONS = [
  {
    value: "private-dining",
    title: "Private Dining Room at Rumi's Kitchen",
  },
  {
    value: "briefing-suite",
    title: "Executive Briefing Suite / On-Site",
  },
];

export const emptyRsvp = {
  sessionFormat: "lunch",
  venue: "private-dining",
  firstChoiceDate: "",
  secondChoiceDate: "",
  dietary: "",
  fullName: "",
  email: "",
  mobile: "",
  assistantContact: "",
};

export function sessionLabel(value) {
  return SESSION_OPTIONS.find((item) => item.value === value)?.title || value;
}

export function venueLabel(value) {
  return VENUE_OPTIONS.find((item) => item.value === value)?.title || value;
}

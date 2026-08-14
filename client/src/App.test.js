import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MuMMpires hero headline", () => {
  render(<App />);
  expect(screen.getByText(/the future is/i)).toBeInTheDocument();
  expect(screen.getByText(/bio-autonomous/i)).toBeInTheDocument();
});

test("renders remaining landing sections", () => {
  render(<App />);
  expect(screen.getByText(/a legacy in the making/i)).toBeInTheDocument();
  expect(screen.getByText(/leadership & vision/i)).toBeInTheDocument();
  expect(
    screen.getByText(/automation & concierge experience/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/confidential & private/i)).toBeInTheDocument();
});

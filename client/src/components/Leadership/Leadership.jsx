import { useEffect, useRef, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import styles from "./Leadership.module.css";

const BODY_LINE = "Let us make the next global big thing together.";
const NOTE_LINE =
  "Not number one — the only one in the global real estate market.";

function Divider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.dividerLine} />
      <span className={styles.diamond} />
      <span className={styles.dividerLine} />
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function TypeLine({
  text,
  className,
  active,
  delay = 0,
  speed = 36,
  showCaret,
  onDone,
}) {
  const reduced = usePrefersReducedMotion();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduced) {
      setCount(text.length);
      doneRef.current?.();
      return undefined;
    }

    setCount(0);
    let index = 0;
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setCount(index);
        if (index >= text.length) {
          window.clearInterval(intervalId);
          doneRef.current?.();
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [active, delay, reduced, speed, text]);

  const visible = reduced ? text : active ? text.slice(0, count) : "";

  return (
    <p className={className} aria-label={text}>
      <span className={styles.typeGhost} aria-hidden="true">
        {text}
      </span>
      <span className={styles.typeLive} aria-hidden="true">
        {visible}
        {showCaret && !reduced ? <span className={styles.caret} /> : null}
      </span>
    </p>
  );
}

function Leadership() {
  const connectRef = useRef(null);
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const node = connectRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("body");
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-labelledby="leadership-heading">
      <div className={styles.frame}>
        <div className={styles.copy}>
          <h2 id="leadership-heading" className={styles.heading}>
            Leadership &amp; Vision
          </h2>
          <Divider />
          <p className={styles.body}>
            With 22+ years of multinational business management, AI product
            architecture, and enterprise execution, our leadership brings a
            unique blend of vision, innovation, and operational excellence to
            build the future.
          </p>

          <div className={styles.signBlock}>
            <svg
              className={styles.signature}
              viewBox="0 0 380 86"
              fill="none"
              role="img"
              aria-label="Signature of Muhammad Malik"
            >
              <text
                x="8"
                y="54"
                fill="#D4AF37"
                className={styles.signatureName}
              >
                Muhammad Malik
              </text>
              <path
                d="M22 66c58 10 122 8 210-6 28-5 62-14 108-8"
                stroke="#D4AF37"
                strokeWidth="1.25"
                strokeLinecap="round"
                opacity="0.9"
              />
            </svg>
            <p className={styles.role}>Founder &amp; Executive Chairman</p>
            <p className={styles.org}>MuMMpires Real Estate Project</p>
          </div>
        </div>

        <div className={styles.portraitWrap}>
          <div className={styles.portrait}>
            <img
              src="/assets/person_image.png"
              alt="Founder and Executive Chairman of MuMMpires"
              className={styles.portraitImg}
            />
          </div>
        </div>

        <aside className={styles.connect} ref={connectRef}>
          <TypeLine
            text={BODY_LINE}
            className={styles.connectBody}
            active={phase !== "idle"}
            delay={180}
            speed={34}
            showCaret={phase === "body"}
            onDone={() => setPhase("note")}
          />
          <a
            className={styles.connectBtn}
            href="https://www.linkedin.com/in/muhammad-usman137?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Request Connection</span>
            <FaLinkedinIn aria-hidden="true" />
          </a>
          <TypeLine
            text={NOTE_LINE}
            className={styles.connectNote}
            active={phase === "note"}
            delay={420}
            speed={28}
            showCaret={phase === "note"}
          />
        </aside>
      </div>
    </section>
  );
}

export default Leadership;

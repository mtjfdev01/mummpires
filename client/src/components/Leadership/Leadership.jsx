import { FaLinkedinIn, FaLock } from "react-icons/fa";
import styles from "./Leadership.module.css";

function Divider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.dividerLine} />
      <span className={styles.diamond} />
      <span className={styles.dividerLine} />
    </div>
  );
}

function Leadership() {
  return (
    <section className={styles.section} aria-labelledby="leadership-heading">
      <div className={styles.frame}>
        <div className={styles.copy}>
          <h2 id="leadership-heading" className={styles.heading}>
            Leadership &amp; Vision
          </h2>
          <Divider />
          <p className={styles.body}>
            With 20+ years of multinational business management, AI product
            architecture, and enterprise execution, our leadership brings a
            unique blend of vision, innovation, and operational excellence to
            build the future.
          </p>

          <div className={styles.signBlock}>
            <svg
              className={styles.signature}
              viewBox="0 0 260 72"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 46c16-26 30-10 38 4 8 14 16-30 38-26 14 3 12 32 30 28 16-4 16-28 36-20 14 6 10 24 24 22 22-4 26-32 50-16 12 8 20 16 32 8"
                stroke="#D4AF37"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M64 58c48 8 96 6 158-8"
                stroke="#D4AF37"
                strokeWidth="1.15"
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
              src="/assets/person_image.jpg"
              alt="Founder and Executive Chairman of MuMMpires"
              className={styles.portraitImg}
            />
          </div>
        </div>

        <aside className={styles.connect}>
          <h3 className={styles.connectHeading}>Connect on LinkedIn</h3>
          <p className={styles.connectBody}>
            To respect confidentiality, please provide your details to connect
            with our leadership on LinkedIn.
          </p>
          <button type="button" className={styles.connectBtn}>
            <span>Request Connection</span>
            <FaLinkedinIn aria-hidden="true" />
          </button>
          <p className={styles.connectNote}>
            <FaLock aria-hidden="true" />
            <span>
              A gated form will appear to verify your information before
              redirecting to LinkedIn.
            </span>
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Leadership;

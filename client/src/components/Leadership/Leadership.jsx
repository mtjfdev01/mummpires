import { FaLinkedinIn } from "react-icons/fa";
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
            With 22+ years of multinational business management, AI product
            architecture, and enterprise execution, our leadership brings a
            unique blend of vision, innovation, and operational excellence to
            build the future.
          </p>

          <div className={styles.signBlock}>
            <svg
              className={styles.signature}
              viewBox="0 0 300 86"
              fill="none"
              role="img"
              aria-label="Signature of Malik Usman"
            >
              <text
                x="8"
                y="54"
                fill="#D4AF37"
                className={styles.signatureName}
              >
                Malik Usman
              </text>
              <path
                d="M22 66c42 10 88 8 152-6 22-5 48-14 78-8"
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

        <aside className={styles.connect}>
          <h3 className={styles.connectHeading}>Connect on LinkedIn</h3>
          <p className={styles.connectBody}>
            Let us make the next global big thing together.
          </p>
          <a
            className={styles.connectBtn}
            href="https://www.linkedin.com/in/muhammad-usman137?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Request Connection</span>
            <FaLinkedinIn aria-hidden="true" />
          </a>
          <p className={styles.connectNote}>
            <span>
              Not number one — the only one in the global real estate market.
            </span>
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Leadership;

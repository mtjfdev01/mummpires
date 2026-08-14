import { FaLock } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import styles from "./SiteFooter.module.css";

function SiteFooter() {
  return (
    <footer className={styles.section}>
      <div className={styles.frame}>
        <div className={styles.brand}>
          <img src="/assets/logo.png" alt="MuMMpires" className={styles.logo} />
          <p className={styles.tagline}>
            Building a bio-autonomous future. Partnering for a lasting legacy.
          </p>
        </div>

        <div className={styles.meta}>
          <HiOutlineLocationMarker className={styles.icon} aria-hidden="true" />
          <div>
            <p className={styles.metaTitle}>Rumi&apos;s Kitchen — Avalon</p>
            <p className={styles.metaSub}>
              7105 Avalon Blvd, Alpharetta, GA 30009
            </p>
          </div>
        </div>

        <div className={styles.meta}>
          <FaLock className={styles.icon} aria-hidden="true" />
          <div>
            <p className={styles.metaTitle}>Confidential &amp; Private</p>
            <p className={styles.metaSub}>By Invitation Only</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

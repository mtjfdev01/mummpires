import styles from "./Legacy.module.css";

function Legacy() {
  return (
    <section className={styles.legacy} aria-labelledby="legacy-heading">
      <div className={styles.frame}>
        <div className={`${styles.visual} ${styles.visualLeft}`}>
          <img
            src="/assets/legacy-visual.png"
            alt="Night view of MuMMpires bio-architecture along the waterfront"
            className={styles.visualImg}
          />
        </div>

        <span className={styles.rule} aria-hidden="true" />

        <div className={styles.copy}>
          <h2 id="legacy-heading" className={styles.heading}>
            A Legacy in the Making
          </h2>
          <div className={styles.body}>
            <p>
              Thank you for unboxing our inaugural invitation. The MuMMpires
              project represents a paradigm shift in American real
              estate—fusing sustainable bio-architecture with cutting-edge
              autonomous technology.
            </p>
            <p>
              As a key landowner in the region, your partnership is vital to
              realizing this vision. We invite you to an intimate, private
              conversation to discuss joint venture structuring, master plan
              insights, and mutual growth.
            </p>
          </div>
        </div>

        <div className={`${styles.visual} ${styles.visualRight}`}>
          <video
            className={styles.visualVideo}
            src="/assets/legacy_video.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-label="MuMMpires bio-architecture film"
          />
        </div>
      </div>
    </section>
  );
}

export default Legacy;

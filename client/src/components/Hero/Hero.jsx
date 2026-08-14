import { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import { IoMdArrowForward } from "react-icons/io";
import { IoSettingsOutline, IoVolumeMedium } from "react-icons/io5";
import { MdFullscreen, MdSkipNext } from "react-icons/md";
import styles from "./Hero.module.css";

function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const playVideo = () => setIsPlaying(true);

  return (
    <section className={styles.hero}>
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />

      <img
        src="/assets/logo.png"
        alt=""
        className={styles.watermark}
        aria-hidden="true"
      />

      <img
        src="/assets/border.png"
        alt=""
        className={styles.border}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <header className={styles.brand}>
          <img
            src="/assets/logo.png"
            alt="MuMMpires"
            className={styles.logo}
          />
        </header>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.copyTop}>
              <h1 className={styles.headline}>
                <span className={styles.kicker}>The Future Is</span>
                <span className={styles.goldTitle}>Bio-Autonomous</span>
              </h1>

              <p className={styles.subhead}>
                An Exclusive Inaugural Session for Selected Visionaries
              </p>

              <div className={styles.divider} aria-hidden="true">
                <span className={styles.dividerLine} />
                <span className={styles.diamond} />
                <span className={styles.dividerLine} />
              </div>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <HiOutlineCalendar className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaTitle}>Private 1-on-1</p>
                    <p className={styles.metaSub}>Meet &amp; Greet</p>
                  </div>
                </div>

                <span className={styles.metaRule} aria-hidden="true" />

                <div className={styles.metaItem}>
                  <HiOutlineLocationMarker className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaTitle}>Rumi&apos;s Kitchen</p>
                    <p className={styles.metaSub}>Avalon, Alpharetta, GA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() =>
                  document
                    .getElementById("rsvp")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <span>Confirm Your Invitation</span>
                <span className={styles.primaryIcon} aria-hidden="true">
                  <IoMdArrowForward />
                </span>
              </button>

              <button
                type="button"
                className={styles.ghostBtn}
                onClick={playVideo}
              >
                <span>Watch Intro Video</span>
                <span className={styles.ghostIcon} aria-hidden="true">
                  <FaPlay />
                </span>
              </button>
            </div>
          </div>

          <div className={styles.playerWrap}>
            <div
              className={styles.player}
              role="group"
              aria-label="Introduction video player"
            >
              <img
                src="/assets/hero-video-thumb.png"
                alt="Futuristic glass biome domes at sunset"
                className={styles.poster}
              />

              {!isPlaying && (
                <button
                  type="button"
                  className={styles.playOverlay}
                  onClick={playVideo}
                  aria-label="Play introduction video"
                >
                  <FaPlay />
                </button>
              )}

              <div className={styles.controls}>
                <div className={styles.controlsLeft}>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    aria-label="Next"
                  >
                    <MdSkipNext />
                  </button>
                  <span className={styles.timestamp}>0:00 / 1:00</span>
                </div>

                <div className={styles.progress} aria-hidden="true">
                  <span className={styles.progressFill} />
                </div>

                <div className={styles.controlsRight}>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    aria-label="Volume"
                  >
                    <IoVolumeMedium />
                  </button>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    aria-label="Settings"
                  >
                    <IoSettingsOutline />
                  </button>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    aria-label="Fullscreen"
                  >
                    <MdFullscreen />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import { IoMdArrowForward } from "react-icons/io";
import { IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import { MdFullscreen, MdSkipNext } from "react-icons/md";
import styles from "./Hero.module.css";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function Hero() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const syncTime = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime || 0);
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const playVideo = () => {
    videoRef.current?.play();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const seekTo = (time) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(time)) return;
    const end = Number.isFinite(video.duration) ? video.duration : time;
    video.currentTime = Math.min(Math.max(time, 0), end);
    syncTime();
  };

  const skipAhead = () => {
    const video = videoRef.current;
    if (!video) return;
    const end = Number.isFinite(video.duration) ? video.duration : 0;
    const next = (video.currentTime || 0) + 10;
    video.currentTime = end && next >= end ? 0 : next;
    syncTime();
  };

  const toggleFullscreen = () => {
    const node = playerRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    node.requestFullscreen?.();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
          <p className={styles.brandLead}>The Principal of AI Driven</p>
          <p className={styles.brandSub}>
            America&apos;s First Ever Bio-Autonomous{" "}
            <span className={styles.brandBreak}>Real Estate Project</span>
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.copyTop}>
              <h1 className={styles.headline}>
                <span className={styles.kicker}>The Future Is</span>
                <span className={styles.goldTitle}>Bio-Autonomous</span>
              </h1>

              <p className={styles.subhead}>
                An Exclusive Inaugural Session{" "}
                <span className={styles.subBreak}>for Selected Visionaries</span>
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
                    <p className={styles.metaSub}>Pitch &amp; Platters</p>
                  </div>
                </div>

                <span className={styles.metaRule} aria-hidden="true" />

                <div className={styles.metaItem}>
                  <div className={styles.metaStack}>
                    <div className={styles.metaPlace}>
                      <HiOutlineLocationMarker className={styles.metaIcon} />
                      <div>
                        <p className={styles.metaTitle}>Rumi&apos;s Kitchen</p>
                        <p className={styles.metaSub}>Avalon, Alpharetta, GA</p>
                      </div>
                    </div>
                    <div className={styles.metaPlace}>
                      <HiOutlineLocationMarker className={styles.metaIcon} />
                      <div>
                        <p className={styles.metaTitle}>Starbucks</p>
                        <p className={styles.metaSub}>Avalon Blvd, Alpharetta, Georgia</p>
                      </div>
                    </div>
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

              {/* <button
                type="button"
                className={styles.ghostBtn}
                onClick={playVideo}
              >
                <span>Watch Intro Video</span>
                <span className={styles.ghostIcon} aria-hidden="true">
                  <FaPlay />
                </span>
              </button> */}
            </div>
          </div>

          <div className={styles.playerWrap}>
            <div
              ref={playerRef}
              className={styles.player}
              role="group"
              aria-label="Introduction video player"
            >
              <video
                ref={videoRef}
                className={styles.poster}
                src="/assets/hero_video.mp4"
                autoPlay
                muted={muted}
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={syncTime}
                onLoadedMetadata={syncTime}
                onDurationChange={syncTime}
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
                    onClick={skipAhead}
                    aria-label="Skip forward 10 seconds"
                  >
                    <MdSkipNext />
                  </button>
                  <span className={styles.timestamp}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className={styles.progress}>
                  <span
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                  <input
                    type="range"
                    className={styles.progressInput}
                    min="0"
                    max={duration || 0}
                    step="0.05"
                    value={currentTime}
                    onChange={(event) => seekTo(Number(event.target.value))}
                    aria-label="Video progress"
                  />
                </div>

                <div className={styles.controlsRight}>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? <IoVolumeMute /> : <IoVolumeMedium />}
                  </button>
                  <button
                    type="button"
                    className={styles.ctrlBtn}
                    onClick={toggleFullscreen}
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

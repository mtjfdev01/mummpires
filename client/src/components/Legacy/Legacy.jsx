import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import styles from "./Legacy.module.css";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function Legacy() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
      userPaused.current = false;
      video.play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) {
      video.play().catch(() => {});
    }
  };

  const seekTo = (time) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(time)) return;
    const end = Number.isFinite(video.duration) ? video.duration : time;
    video.currentTime = Math.min(Math.max(time, 0), end);
    syncTime();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      ref={sectionRef}
      className={styles.legacy}
      aria-labelledby="legacy-heading"
    >
      <div className={styles.frame}>
        <div className={styles.emblem}>
          <img
            src="/assets/img_one.jpg"
            alt="MuMMpires crest"
            className={styles.emblemImg}
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
            ref={videoRef}
            className={styles.visualVideo}
            src="/assets/legacy_video.mp4"
            muted={muted}
            loop
            playsInline
            preload="metadata"
            aria-label="MuMMpires bio-architecture film"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={syncTime}
            onLoadedMetadata={syncTime}
            onDurationChange={syncTime}
          />
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <span className={styles.timestamp}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
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
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <IoVolumeMute /> : <IoVolumeMedium />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Legacy;

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import { formatClock } from "../../utils/format.js";
import "./VideoPlayer.css";

// HTML5 video with the Figma-style overlay controls (big play button, progress bar).
// Falls back to a friendly message if none of the sources can be loaded.
export default function VideoPlayer({ video }) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // reset when another video is opened
  useEffect(() => {
    setPlaying(false);
    setTime(0);
    setDuration(0);
    setFailed(false);
    videoRef.current?.load();
  }, [video.id, attempt]);

  useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = useCallback(() => {
    const el = videoRef.current;
    if (!el || failed) return;
    if (el.paused) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [failed]);

  const seek = (value) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = Number(value);
    setTime(Number(value));
  };

  const changeVolume = (value) => {
    const el = videoRef.current;
    const v = Number(value);
    setVolume(v);
    setMuted(v === 0);
    if (el) {
      el.volume = v;
      el.muted = v === 0;
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (el) el.muted = next;
    if (!next && volume === 0) changeVolume(0.5);
  };

  const toggleFullscreen = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrap.requestFullscreen?.().catch(() => {});
  };

  const onKeyDown = (e) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === "k" || e.key === "K") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") {
      seek(Math.min(duration, time + 5));
    } else if (e.key === "ArrowLeft") {
      seek(Math.max(0, time - 5));
    } else if (e.key === "f" || e.key === "F") {
      toggleFullscreen();
    }
  };

  const pct = duration ? (time / duration) * 100 : 0;
  const sources = video.sources || {};

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={`player ${playing ? "is-playing" : ""} ${fullscreen ? "is-fullscreen" : ""}`} ref={wrapRef} onKeyDown={onKeyDown}>
      <video
        ref={videoRef}
        className="player__video"
        poster={video.thumbnail}
        preload="metadata"
        playsInline
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setFailed(false);
        }}
        onError={() => setFailed(true)}
        aria-label={video.title}
      >
        {sources.webm && <source src={sources.webm} type="video/webm" />}
        {sources.mp4 && <source src={sources.mp4} type="video/mp4" onError={() => setFailed(true)} />}
        {!sources.mp4 && sources.webm && <source src={sources.webm} type="video/webm" onError={() => setFailed(true)} />}
      </video>

      {failed && (
        <div className="player__error" role="alert">
          <Icon name="play-circle" size={40} />
          <p>This video can&rsquo;t be played right now.</p>
          <p className="player__error-sub">
            The video file was not found or this browser can&rsquo;t play its format. Make sure the app is opened through
            <code> npm run dev</code> (not by double-clicking index.html).
          </p>
          <button type="button" className="player__retry" onClick={() => setAttempt((a) => a + 1)}>
            Try again
          </button>
        </div>
      )}

      {!failed && !playing && (
        <button type="button" className="player__big" aria-label={`Play ${video.title}`} onClick={toggle}>
          <Icon name="play" size={36} filled />
        </button>
      )}

      <div className="player__controls">
        <button type="button" className="player__btn" aria-label={playing ? "Pause" : "Play"} onClick={toggle} disabled={failed}>
          <Icon name={playing ? "pause" : "play"} size={18} filled />
        </button>
        <input
          className="player__range player__progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(time, duration || 0)}
          onChange={(e) => seek(e.target.value)}
          aria-label="Seek"
          aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
          style={{ "--pct": `${pct}%` }}
          disabled={failed || !duration}
        />
        <span className="player__time" aria-hidden="true">
          {formatClock(time)} / {formatClock(duration)}
        </span>
        <button type="button" className="player__btn" aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute} disabled={failed}>
          <Icon name={muted || volume === 0 ? "volume-x" : "volume"} size={18} />
        </button>
        <input
          className="player__range player__volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={(e) => changeVolume(e.target.value)}
          aria-label="Volume"
          style={{ "--pct": `${(muted ? 0 : volume) * 100}%` }}
          disabled={failed}
        />
        <button type="button" className="player__btn" aria-label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
          <Icon name="maximize" size={18} />
        </button>
      </div>
    </div>
  );
}

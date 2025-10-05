import React, { useState, useRef, useEffect } from "react";
import "../styles/components/AudioControls.css";

const AudioControls = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onVolumeChange,
  onSpeedChange,
}) => {
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  const handlePlayPause = () => {
    if (!audioUrl) {
      alert("No audio available for this exercise");
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPaused(true);
    } else {
      audioRef.current?.play();
      setIsPaused(false);
    }
    onPlayPause();
  };

  const getPlayButtonIcon = () => {
    return isPlaying ? "⏸" : "▶";
  };

  const getPlayButtonText = () => {
    return isPlaying ? "Pause Sentence" : "Play Sentence";
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
    
    // Update slider fill
    const percent = newVolume * 100;
    e.target.style.background = `linear-gradient(to right, #5fa69c 0%, #5fa69c ${percent}%, #d1d5db ${percent}%, #d1d5db 100%)`;
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackRate(newSpeed);
    onSpeedChange?.(newSpeed);
    
    // Update slider fill
    const percent = ((newSpeed - 0.5) / (2 - 0.5)) * 100;
    e.target.style.background = `linear-gradient(to right, #5fa69c 0%, #5fa69c ${percent}%, #d1d5db ${percent}%, #d1d5db 100%)`;
  };

  return (
    <div className="audio-controls-container">
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => {
            setIsPaused(false);
            onPlayPause();
          }}
          onError={() => {
            console.error("Audio failed to load");
            alert(
              "Failed to load audio. Please check your internet connection."
            );
          }}
        />
      )}

      {/* Volume Control */}
      <div className="control-row">
        <div className="control-icon">🔊</div>
        <div className="control-label">Volume:</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="control-slider"
          style={{
            background: `linear-gradient(to right, #5fa69c 0%, #5fa69c ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`
          }}
        />
        <div className="control-value">{Math.round(volume * 100)}%</div>
      </div>

      {/* Speed Control */}
      <div className="control-row">
        <div className="control-icon">⚡</div>
        <div className="control-label">Speed:</div>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={playbackRate}
          onChange={handleSpeedChange}
          className="control-slider"
          style={{
            background: `linear-gradient(to right, #5fa69c 0%, #5fa69c ${((playbackRate - 0.5) / (2 - 0.5)) * 100}%, #d1d5db ${((playbackRate - 0.5) / (2 - 0.5)) * 100}%, #d1d5db 100%)`
          }}
        />
        <div className="control-value">{playbackRate.toFixed(1)}x</div>
      </div>

      {/* Listen to the sentence */}
      <div className="listen-section">
        <div className="listen-icon">🔊</div>
        <div className="listen-text">Listen to the sentence:</div>
      </div>

      {/* Play Button */}
      <button
        onClick={handlePlayPause}
        disabled={!audioUrl}
        className={`play-button ${!audioUrl ? "disabled" : ""}`}
      >
        <span className="play-icon">{getPlayButtonIcon()}</span>
        <span className="play-text">{getPlayButtonText()}</span>
      </button>
    </div>
  );
};

export default AudioControls;
import React, { useState } from "react";
import "../../styles/phases/ListeningPhase.css";

const ListeningPhase = ({ lesson, onComplete }) => {
  const [isWatching, setIsWatching] = useState(false);

  const dailyTips = [
    "Watch the video at least twice - once for general understanding, then again for details!",
    "Take breaks between exercises to let your brain process what you've learned.",
    "Don't be afraid to replay difficult sentences multiple times - repetition builds skill!",
    "Focus on understanding the meaning first, then worry about perfect spelling.",
    "Practice with different accents and speaking speeds to improve your adaptability.",
    "Keep a vocabulary journal of new words you encounter during practice.",
    "Try to predict what comes next in a sentence - this improves your language intuition.",
  ];

  const today = new Date().getDate();
  const tipIndex = today % dailyTips.length;
  const dailyTip = dailyTips[tipIndex];

  const handleStartWatching = () => {
    setIsWatching(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="listening-phase-simple">
      <h2 className="listening-title-simple">🎶 Listening Phase</h2>
      <p className="listening-description-simple">
        Watch the video below to improve your listening skills
      </p>

      {/* Tip of the Day */}
      <div className="tip-simple">
        <span className="tip-icon-simple">🌟</span>
        <div className="tip-content-simple">
          <strong>Tip of the Day:</strong> {dailyTip}
        </div>
      </div>

      {/* YouTube Video */}
      <div className="video-simple">
        <iframe
          src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}`}
          title="SNA Academy Listening Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="instructions-simple">
        After watching the video, click "Next" to proceed to the dictation phase
      </p>

      <button onClick={handleComplete} className="next-button-simple">
        Next - Dictation Phase
      </button>
    </div>
  );
};

export default ListeningPhase;

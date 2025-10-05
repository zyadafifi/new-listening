import React from "react";
import { useNavigate } from "react-router-dom";
import dataService from "../services/dataService";
import "../styles/components/LessonCard.css";

const LessonCard = ({ lesson, isUnlocked, isCompleted, progress }) => {
  const navigate = useNavigate();

  const handleStartLesson = () => {
    if (isUnlocked) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const getCardStatus = () => {
    if (isCompleted) return "completed";
    if (isUnlocked) return "unlocked";
    return "locked";
  };

  const getButtonText = () => {
    if (isCompleted) return "Review";
    if (isUnlocked) return "Start";
    return "Locked";
  };

  return (
    <div
      className={`lesson-card-modern ${getCardStatus()} ${
        !isUnlocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={handleStartLesson}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
      aria-label={`${lesson.title} - ${
        isUnlocked ? "Click to start" : "Locked lesson"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStartLesson();
        }
      }}
    >
      {/* Card Content */}
      <div className="lesson-card-content-modern">
        <h3 className="lesson-card-title-modern">{lesson.title}</h3>
        <p className="lesson-card-description-modern">{lesson.description}</p>

        {/* Progress Section */}
        {isUnlocked && (
          <div className="lesson-progress-modern">
            <div className="progress-header">
              <span className="progress-label">Progress</span>
              <span className="progress-percentage">{progress}%</span>
            </div>
            <div
              className="progress-bar-modern"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Lesson progress: ${progress}% complete`}
            >
              <div
                className="progress-fill-modern"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="lesson-card-stats-modern">
          <div className="stat-item-modern">
            <span className="stat-icon">⏱️</span>
            <span className="stat-text">{lesson.duration}</span>
          </div>
          <div className="stat-item-modern">
            <span className="stat-icon">📝</span>
            <span className="stat-text">
              {lesson.exercises.length} exercises
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="lesson-card-action-modern">
        <button
          className={`lesson-card-button-modern ${
            !isUnlocked ? "disabled" : ""
          }`}
          disabled={!isUnlocked}
        >
          <span className="button-icon">
            {isCompleted ? "🔄" : isUnlocked ? "▶️" : "🔒"}
          </span>
          <span className="button-text">{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default LessonCard;

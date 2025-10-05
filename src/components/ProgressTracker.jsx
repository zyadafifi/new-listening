import React from "react";
import "../styles/components/ProgressTracker.css";

const ProgressTracker = ({ current, total, stats }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="stats">
      <div className="stat-item">
        <div className="stat-number">{stats.correct}</div>
        <div className="stat-label">Correct</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Total</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{stats.accuracy}%</div>
        <div className="stat-label">Accuracy</div>
      </div>
    </div>
  );
};

export default ProgressTracker;

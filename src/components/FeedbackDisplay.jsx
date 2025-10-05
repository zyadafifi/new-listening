import React from "react";
import "../styles/components/FeedbackDisplay.css";

const FeedbackDisplay = ({ feedback, onNext, onRetry, isLastExercise }) => {
  const { type, isCorrect, analysis, correctAnswer } = feedback;

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return "from-green-400 to-green-600";
    if (accuracy >= 70) return "from-blue-400 to-blue-600";
    if (accuracy >= 50) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const getFeedbackMessage = (accuracy) => {
    if (accuracy >= 90) return "Great job! Almost perfect!";
    if (accuracy >= 70) return "Good effort! Keep practicing!";
    if (accuracy >= 50) return "Not bad, but needs improvement.";
    return "Needs more practice. Listen carefully and try again!";
  };

  const getImprovementTips = (analysis) => {
    const tips = [];

    if (analysis.missing > 0) {
      tips.push("Listen carefully for missing words");
    }
    if (analysis.extra > 0) {
      tips.push("Avoid adding extra words that weren't in the audio");
    }
    if (analysis.mistakes > 0) {
      tips.push("Pay attention to word endings and small differences");
    }
    if (tips.length === 0) {
      tips.push("You're doing great! Just a few minor adjustments needed");
    }

    return tips;
  };

  if (type === "writing" && analysis) {
    return (
      <div
        className={`feedback ${
          analysis.isPerfect ? "perfect" : "comparison"
        } show`}
      >
        {analysis.isPerfect ? (
          // Perfect Answer
          <div className="perfect-answer">
            <div className="feedback-header">
              <span className="feedback-icon">🎉</span>
              <span className="feedback-title">
                Perfect! Every word is correct!
              </span>
            </div>
            <div className="perfect-match">
              {analysis.userAnswer || "Perfect match!"}
            </div>
            <div className="action-buttons">
              <button onClick={onRetry} className="control-button retry">
                <span className="icon-reset">🔄</span>
                Try Again
              </button>
              <button onClick={onNext} className="control-button next">
                <span className="icon-arrow">→</span>
                {isLastExercise ? "Complete Lesson" : "Next Exercise"}
              </button>
            </div>
          </div>
        ) : (
          // Detailed Analysis
          <div className="comparison-container">
            {/* Accuracy Header */}
            <div className="accuracy-header">
              <div className="accuracy-circle">
                <div className="accuracy-number">{analysis.accuracy}%</div>
                <div className="accuracy-label">Accuracy</div>
              </div>
              <div className="accuracy-details">
                <p>
                  You got {analysis.correctWords} out of {analysis.totalWords}{" "}
                  words correct!
                </p>
                <p>{getFeedbackMessage(analysis.accuracy)}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-number" style={{ color: "#63a29b" }}>
                  {analysis.correctWords}
                </div>
                <div className="stat-label">Correct</div>
              </div>
              <div className="stat-box">
                <div className="stat-number" style={{ color: "#ef4444" }}>
                  {analysis.mistakes}
                </div>
                <div className="stat-label">Mistakes</div>
              </div>
              <div className="stat-box">
                <div className="stat-number" style={{ color: "#f59e0b" }}>
                  {analysis.missing}
                </div>
                <div className="stat-label">Missing</div>
              </div>
              <div className="stat-box">
                <div className="stat-number" style={{ color: "#f59e0b" }}>
                  {analysis.extra}
                </div>
                <div className="stat-label">Extra</div>
              </div>
            </div>

            {/* Answer Comparison */}
            <div className="answer-comparison">
              <div className="answer-section">
                <h4>Your Answer</h4>
                <div
                  className="answer-text user-answer"
                  dangerouslySetInnerHTML={{
                    __html:
                      analysis.userAnalysis ||
                      analysis.userAnswer ||
                      "No answer provided",
                  }}
                />
              </div>
              <div className="answer-section">
                <h4>Correct Answer</h4>
                <div
                  className="answer-text correct-answer"
                  dangerouslySetInnerHTML={{
                    __html: analysis.correctAnalysis || analysis.correctAnswer,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <div className="action-buttons">
                <button onClick={onRetry} className="control-button retry">
                  <span className="icon-reset">🔄</span>
                  Try Again
                </button>
                <button onClick={onNext} className="control-button next">
                  <span className="icon-arrow">→</span>
                  {isLastExercise ? "Complete Lesson" : "Next Exercise"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Multiple Choice Feedback
  return (
    <div className={`feedback ${isCorrect ? "correct" : "comparison"} show`}>
      <div className="text-center">
        {isCorrect ? (
          <>
            <div className="feedback-header">
              <span className="feedback-icon">🎉</span>
              <span className="feedback-title">Excellent! That's correct!</span>
            </div>
            <p style={{ margin: "15px 0", color: "#065f46" }}>
              You selected the right answer. Great job!
            </p>
          </>
        ) : (
          <>
            <div className="feedback-header">
              <span className="feedback-icon">❌</span>
              <span className="feedback-title">Not quite right</span>
            </div>
            <p style={{ margin: "15px 0", color: "#991b1b" }}>
              The correct answer was: <strong>{correctAnswer}</strong>
            </p>
          </>
        )}

        <div className="action-buttons">
          <button onClick={onRetry} className="control-button retry">
            <span className="icon-reset">🔄</span>
            Try Again
          </button>
          <button onClick={onNext} className="control-button next">
            <span className="icon-arrow">→</span>
            {isLastExercise ? "Complete Lesson" : "Next Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;

import React from "react";
import "../styles/components/ExerciseArea.css";

const ExerciseArea = ({
  mode,
  exercise,
  userAnswer,
  onAnswerChange,
  selectedChoice,
  onChoiceSelect,
  onSubmit,
  onReset,
  showFeedback,
}) => {
  const handleChoiceClick = (index) => {
    onChoiceSelect(index);
  };

  const getChoiceButtonClass = (index) => {
    let baseClass =
      "w-full p-4 text-left border-2 rounded-xl transition-all duration-300 hover:shadow-md ";

    if (selectedChoice === index) {
      baseClass += "border-sna-teal-500 bg-sna-teal-50 text-sna-teal-800";
    } else {
      baseClass += "border-gray-200 bg-white hover:border-sna-teal-300";
    }

    return baseClass;
  };

  return (
    <div className="exercise-area">
      {/* Exercise Content */}
      {mode === "writing" && (
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "15px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Type what you heard:
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type the sentence you heard here..."
            className="text-input"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
        </div>
      )}

      {mode === "choice" && (
        <div>
          <p
            style={{
              marginBottom: "20px",
              fontWeight: "600",
              color: "#374151",
              textAlign: "center",
            }}
          >
            Choose the correct sentence:
          </p>
          <div className="choices-container">
            {exercise.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceClick(index)}
                className={`choice-button ${
                  selectedChoice === index ? "selected" : ""
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showFeedback && (
        <div className="control-buttons">
          <button
            onClick={onSubmit}
            disabled={
              (mode === "writing" && !userAnswer.trim()) ||
              (mode === "choice" && selectedChoice === null)
            }
            className={`control-button check ${
              (mode === "writing" && !userAnswer.trim()) ||
              (mode === "choice" && selectedChoice === null)
                ? "disabled"
                : ""
            }`}
          >
            <span className="icon-check">✓</span>
            Check Answer
          </button>

          <button onClick={onReset} className="control-button">
            <span className="icon-reset">↻</span>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseArea;

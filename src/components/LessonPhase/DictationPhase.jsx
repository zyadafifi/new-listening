import React, { useState, useEffect } from "react";
import AudioControls from "../AudioControls";
import ExerciseArea from "../ExerciseArea";
import ProgressTracker from "../ProgressTracker";
import FeedbackDisplay from "../FeedbackDisplay";
import soundEffects from "../../utils/soundEffects";
import dataService from "../../services/dataService";
import "../../styles/phases/DictationPhase.css";

const DictationPhase = ({ lesson, onComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({
    correct: 0,
    total: 0,
    accuracy: 0,
  });

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1;

  // Update progress when exercise index changes
  useEffect(() => {
    if (currentExerciseIndex > 0) {
      const progress = Math.round(
        (currentExerciseIndex / lesson.exercises.length) * 100
      );
      dataService.updateLessonProgress(lesson.id, progress);
    }
  }, [currentExerciseIndex, lesson.id, lesson.exercises.length]);

  const modes = [
    {
      id: "writing",
      name: "Writing Mode",
      icon: "✏️",
      description: "Type what you hear",
    },
    {
      id: "choice",
      name: "Multiple Choice",
      icon: "✔️",
      description: "Choose the correct answer",
    },
  ];

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setUserAnswer("");
    setSelectedChoice(null);
    setShowFeedback(false);
    setFeedback(null);
  };

  const handleAnswerSubmit = () => {
    if (!selectedMode) return;

    let isCorrect = false;
    let score = 0;

    if (selectedMode === "writing") {
      if (!userAnswer.trim()) {
        alert("Please type your answer first!");
        return;
      }
      const analysis = analyzeAnswer(userAnswer.trim(), currentExercise.text);
      score = analysis.accuracy;
      isCorrect = analysis.isPerfect;
      setFeedback({ type: "writing", analysis, isCorrect });
    } else {
      if (selectedChoice === null) {
        alert("Please select an answer first!");
        return;
      }
      isCorrect = selectedChoice === 0; // First choice is always correct
      score = isCorrect ? 100 : 0;
      setFeedback({
        type: "choice",
        isCorrect,
        correctAnswer: currentExercise.text,
      });
    }

    // Play sound effect
    if (isCorrect) {
      soundEffects.playRightAnswer();
    } else {
      soundEffects.playWrongAnswer();
    }

    // Update stats
    const newStats = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      total: stats.total + 1,
      accuracy: Math.round(
        ((stats.correct + (isCorrect ? 1 : 0)) / (stats.total + 1)) * 100
      ),
    };
    setStats(newStats);

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastExercise) {
      // Mark lesson as completed
      dataService.completeLesson(lesson.id);
      onComplete();
    } else {
      setCurrentExerciseIndex((prev) => prev + 1);
      setUserAnswer("");
      setSelectedChoice(null);
      setShowFeedback(false);
      setFeedback(null);

      // Update progress
      const progress = Math.round(
        ((currentExerciseIndex + 1) / lesson.exercises.length) * 100
      );
      dataService.updateLessonProgress(lesson.id, progress);
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setSelectedChoice(null);
    setShowFeedback(false);
    setFeedback(null);
  };

  const handleRetry = () => {
    setUserAnswer("");
    setSelectedChoice(null);
    setShowFeedback(false);
    setFeedback(null);
  };

  const analyzeAnswer = (userInput, correctText) => {
    // Normalize both texts for comparison
    const normalizedUserInput = userInput.toLowerCase().replace(/[^\w\s]/g, "");
    const normalizedCorrectText = correctText
      .toLowerCase()
      .replace(/[^\w\s]/g, "");

    // Split into words
    const userWords = normalizedUserInput
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const correctWords = normalizedCorrectText
      .split(/\s+/)
      .filter((word) => word.length > 0);

    let correctCount = 0;
    let mistakes = 0;
    let missing = 0;
    let extra = 0;

    // Create analysis arrays for highlighting
    const userAnalysis = [];
    const correctAnalysis = [];

    // Compare word by word
    const maxLength = Math.max(userWords.length, correctWords.length);

    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i];
      const correctWord = correctWords[i];

      if (!userWord && correctWord) {
        // Missing word
        missing++;
        correctAnalysis.push(
          `<span class="word-missing">${correctWord}</span>`
        );
      } else if (userWord && !correctWord) {
        // Extra word
        extra++;
        userAnalysis.push(`<span class="word-extra">${userWord}</span>`);
      } else if (userWord === correctWord) {
        // Correct word
        correctCount++;
        userAnalysis.push(`<span class="word-correct">${userWord}</span>`);
        correctAnalysis.push(
          `<span class="word-correct">${correctWord}</span>`
        );
      } else {
        // Incorrect word
        mistakes++;
        userAnalysis.push(`<span class="word-incorrect">${userWord}</span>`);
        correctAnalysis.push(
          `<span class="word-should-be">${correctWord}</span>`
        );
      }
    }

    // Calculate accuracy
    const accuracy =
      correctWords.length > 0
        ? Math.round((correctCount / correctWords.length) * 100)
        : 0;

    return {
      correctWords: correctCount,
      totalWords: correctWords.length,
      mistakes,
      missing,
      extra,
      accuracy,
      userAnalysis: userAnalysis.join(" "),
      correctAnalysis: correctAnalysis.join(" "),
      isPerfect: accuracy === 100,
      userAnswer: userInput,
      correctAnswer: correctText,
    };
  };

  if (!currentExercise) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No exercises available
        </h2>
        <button onClick={onComplete} className="btn-primary">
          Return to Lessons
        </button>
      </div>
    );
  }

  return (
    <div className="dictation-phase-simple">
      <h2 className="dictation-title-simple">✏️ Dictation Phase</h2>

      {/* Progress Section */}
      <div className="progress-simple">
        <div className="progress-bar-simple">
          <div
            className="progress-fill-simple"
            style={{
              width: `${
                ((currentExerciseIndex + 1) / lesson.exercises.length) * 100
              }%`,
            }}
          />
        </div>
        <div className="exercise-counter-simple">
          Exercise {currentExerciseIndex + 1} of {lesson.exercises.length}
        </div>
      </div>

      {/* Audio Section */}
      <div className="audio-section-simple">
        <h3>Listen to the Sentence</h3>
        <AudioControls
          audioUrl={currentExercise.audio}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onVolumeChange={(volume) => console.log("Volume:", volume)}
          onSpeedChange={(speed) => console.log("Speed:", speed)}
        />
      </div>

      {/* Mode Selection */}
      {!selectedMode && (
        <div className="mode-selector-simple">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className="mode-button-simple"
            >
              <span className="mode-icon-simple">{mode.icon}</span>
              <div className="mode-info-simple">
                <span className="mode-name-simple">{mode.name}</span>
                <span className="mode-desc-simple">{mode.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Exercise Area */}
      {selectedMode && (
        <ExerciseArea
          mode={selectedMode}
          exercise={currentExercise}
          userAnswer={userAnswer}
          onAnswerChange={setUserAnswer}
          selectedChoice={selectedChoice}
          onChoiceSelect={setSelectedChoice}
          onSubmit={handleAnswerSubmit}
          onReset={handleReset}
          showFeedback={showFeedback}
        />
      )}

      {/* Feedback Display */}
      {showFeedback && feedback && (
        <FeedbackDisplay
          feedback={feedback}
          onNext={handleNext}
          onRetry={handleRetry}
          isLastExercise={isLastExercise}
        />
      )}
    </div>
  );
};

export default DictationPhase;

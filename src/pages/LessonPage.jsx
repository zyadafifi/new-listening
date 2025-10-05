import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataService from "../services/dataService";
import ListeningPhase from "../components/LessonPhase/ListeningPhase";
import DictationPhase from "../components/LessonPhase/DictationPhase";
import Header from "../components/Header";
import TipsPanel from "../components/TipsPanel";
import "../styles/pages/LessonPage.css";

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState("listening");
  const [showTips, setShowTips] = useState(false);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const foundLesson = dataService.getLessonById(parseInt(id));
    if (foundLesson) {
      // Check if lesson is unlocked
      if (!dataService.isLessonUnlocked(parseInt(id))) {
        alert("This lesson is locked. Complete the previous lesson first!");
        navigate("/");
        return;
      }
      setLesson(foundLesson);
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  const phases = [
    { id: "listening", name: "Listening", icon: "🎧" },
    { id: "dictation", name: "Dictation", icon: "✏️" },
  ];

  const handleLessonComplete = () => {
    dataService.completeLesson(parseInt(id));
    alert("Congratulations! You have completed this lesson!");
    navigate("/");
  };

  return (
    <div className="min-h-screen lesson-page">
      <Header onToggleTips={() => setShowTips(!showTips)} />

      <div className="container mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="lesson-header-modern">
          <div className="lesson-header-content">
            <h1 className="lesson-title-modern">{lesson.title}</h1>
            <p className="lesson-description-modern">{lesson.description}</p>

            <div className="lesson-meta-modern">
              <div className="meta-item-modern">
                <span className="meta-icon">⏱️</span>
                <span className="meta-text">{lesson.duration}</span>
              </div>
              <div className="meta-item-modern">
                <span className="meta-icon">📝</span>
                <span className="meta-text">
                  {lesson.exercises.length} exercises
                </span>
              </div>
              <div className="meta-item-modern">
                <span className="meta-icon">🎯</span>
                <span className="meta-text">Lesson {lesson.id} of 60</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="phase-indicator-modern">
          {phases.map((phase) => (
            <div
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`phase-step-modern ${
                currentPhase === phase.id ? "active" : ""
              }`}
            >
              <span className="phase-icon-modern">{phase.icon}</span>
              <span className="phase-text-modern">{phase.name}</span>
            </div>
          ))}
        </div>

        {/* Phase Content */}
        <div className="phase-content-modern">
          {currentPhase === "listening" && (
            <ListeningPhase
              lesson={lesson}
              onComplete={() => setCurrentPhase("dictation")}
            />
          )}

          {currentPhase === "dictation" && (
            <DictationPhase lesson={lesson} onComplete={handleLessonComplete} />
          )}
        </div>
      </div>

      {/* Tips Panel */}
      <TipsPanel isOpen={showTips} onClose={() => setShowTips(false)} />
    </div>
  );
};

export default LessonPage;

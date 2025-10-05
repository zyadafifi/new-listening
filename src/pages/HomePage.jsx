import React, { useState, useEffect } from "react";
import dataService from "../services/dataService";
import LessonCard from "../components/LessonCard";
import Header from "../components/Header";
import TipsPanel from "../components/TipsPanel";
import useProgress from "../hooks/useProgress";
import "../styles/pages/HomePage.css";

const HomePage = () => {
  const [showTips, setShowTips] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const lessonsPerPage = 20;
  const { getProgress } = useProgress();

  useEffect(() => {
    loadLessons();
    updateProgress();
  }, [currentPage]);

  // Refresh progress when component becomes visible (returning from lesson)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateProgress();
        // Reload lessons to get updated progress
        const pageLessons = dataService.getLessons(currentPage, lessonsPerPage);
        setLessons(pageLessons);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentPage]);

  const updateProgress = () => {
    setProgress(getProgress());
  };

  const loadLessons = () => {
    setLoading(true);
    const pageLessons = dataService.getLessons(currentPage, lessonsPerPage);
    const totalLessons = dataService.getTotalLessons();

    if (currentPage === 1) {
      setLessons(pageLessons);
    } else {
      setLessons((prev) => [...prev, ...pageLessons]);
    }

    setHasMore(currentPage * lessonsPerPage < totalLessons);
    setLoading(false);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <Header onToggleTips={() => setShowTips(!showTips)} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero-section text-white py-8 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                SNA Academy
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
                Master English through Interactive Listening and Dictation
              </p>
              
              {/* Compact Progress */}
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 max-w-md mx-auto border border-white/20">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {progress.completed}
                    </div>
                    <div className="text-emerald-300 font-medium text-xs uppercase tracking-wide">
                      Completed
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {progress.total - progress.completed}
                    </div>
                    <div className="text-slate-300 font-medium text-xs uppercase tracking-wide">
                      Remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="lessons-section">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Available Lessons
          </h2>
          <div className="lessons-grid">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LessonCard
                  lesson={lesson}
                  isUnlocked={lesson.isUnlocked}
                  isCompleted={lesson.isCompleted}
                  progress={lesson.progress}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="load-more-container mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="load-more-button"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>📚</span>
                  <span>Load More Lessons</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tips Panel */}
      <TipsPanel isOpen={showTips} onClose={() => setShowTips(false)} />
    </div>
  );
};

export default HomePage;

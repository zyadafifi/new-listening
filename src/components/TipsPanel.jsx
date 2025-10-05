import React, { useState } from "react";
import dataService from "../services/dataService";
import "../styles/components/TipsPanel.css";

const TipsPanel = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("listening");

  if (!isOpen) return null;

  const categories = [
    { id: "listening", name: "Listening", icon: "🎧" },
    { id: "writing", name: "Writing", icon: "✏️" },
    { id: "general", name: "General", icon: "📚" },
  ];

  const currentTips = dataService.getTipsDatabase()[activeCategory] || [];

  return (
    <div className={`tips-panel-modern ${isOpen ? "open" : ""}`}>
      <div className="tips-overlay-modern" onClick={onClose}></div>
      <div className="tips-content-modern">
        <div className="tips-header-modern">
          <h3 className="tips-title-modern">
            <span className="tips-icon-modern">💡</span>
            Learning Tips
          </h3>
          <button className="tips-close-modern" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="tips-body-modern">
          <div className="tip-categories-modern">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`tip-category-modern ${
                  activeCategory === category.id ? "active" : ""
                }`}
              >
                <span className="category-icon-modern">{category.icon}</span>
                <span className="category-name-modern">{category.name}</span>
              </button>
            ))}
          </div>
          <div className="tips-list-modern">
            {currentTips.map((tip, index) => (
              <div key={index} className="tip-item-modern">
                <div className="tip-item-header-modern">
                  <span className="tip-item-icon-modern">{tip.icon}</span>
                  <span className="tip-item-title-modern">{tip.title}</span>
                </div>
                <div className="tip-item-content-modern">{tip.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsPanel;

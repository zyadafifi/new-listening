import React from "react";
import "../styles/components/Header.css";

const Header = ({ onToggleTips }) => {
  return (
    <div className="header-modern">
      <div className="header-content">
        <div className="header-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">SNA Academy</span>
        </div>
        <button className="tips-button-modern" onClick={onToggleTips}>
          <span className="tips-icon">💡</span>
          <span className="tips-text">Tips & Help</span>
        </button>
      </div>
    </div>
  );
};

export default Header;

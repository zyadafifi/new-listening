// Global variables for audio file playback only
let sentences = [];
let currentSentenceIndex = 0;
let currentMode = null; // Changed from "writing" to null - no default mode
let selectedChoice = null;
let correctAnswers = 0;
let totalAttempts = 0;
let sentenceScores = [];
let audioElement = null;
let isPlaying = false;
let isPaused = false;

// Tips System Variables
let tipsDatabase = {
  listening: [
    {
      title: "Listen Multiple Times",
      content: "Don't worry if you don't understand everything on the first listen. Play the audio 2-3 times to catch all the details.",
      icon: "🔄"
    },
    {
      title: "Focus on Key Words",
      content: "Pay attention to stressed syllables and important words. These usually carry the main meaning of the sentence.",
      icon: "🎯"
    },
    {
      title: "Use Headphones",
      content: "Good quality headphones can help you hear subtle pronunciation differences and background sounds more clearly.",
      icon: "🎧"
    },
    {
      title: "Adjust Playback Speed",
      content: "Use the speed control to slow down audio if you're a beginner, or speed it up as you improve.",
      icon: "⚡"
    },
    {
      title: "Listen for Rhythm",
      content: "English has natural rhythm patterns. Try to identify where speakers pause and which words they emphasize.",
      icon: "🎵"
    }
  ],
  writing: [
    {
      title: "Don't Edit While Typing",
      content: "Write what you hear first, then go back to check for mistakes. Editing while listening can distract you.",
      icon: "✏️"
    },
    {
      title: "Focus on Sounds, Not Spelling",
      content: "Sometimes what sounds right is more important than perfect spelling. Focus on capturing the sounds you hear.",
      icon: "🔤"
    },
    {
      title: "Use Punctuation Clues",
      content: "Listen for pauses that indicate commas, and falling intonation that suggests periods.",
      icon: "📖"
    },
    {
      title: "Practice Common Words",
      content: "The most frequently used English words should become automatic. Practice writing them without thinking.",
      icon: "📚"
    },
    {
      title: "Don't Panic on Mistakes",
      content: "Making mistakes is part of learning. Each error teaches you something new about English sounds and patterns.",
      icon: "😌"
    }
  ],
  general: [
    {
      title: "Practice Daily",
      content: "Even 15 minutes of daily practice is more effective than longer, infrequent sessions.",
      icon: "📅"
    },
    {
      title: "Set Realistic Goals",
      content: "Start with easier sentences and gradually increase difficulty. Celebrate small improvements!",
      icon: "🎯"
    },
    {
      title: "Learn from Mistakes",
      content: "Review your errors to identify patterns. Are you missing certain sounds or word types?",
      icon: "📝"
    },
    {
      title: "Stay Motivated",
      content: "Track your progress and reward yourself for achieving milestones. Learning takes time!",
      icon: "💪"
    },
    {
      title: "Use Multiple Resources",
      content: "Combine dictation practice with reading, speaking, and listening to various English content.",
      icon: "🌟"
    }
  ]
};

let currentTipCategory = 'listening';
let dailyTips = [
  "Listen to each video at least twice - once for general understanding, then again for details!",
  "Take breaks between exercises to let your brain process what you've learned.",
  "Don't be afraid to replay difficult sentences multiple times - repetition builds skill!",
  "Focus on understanding the meaning first, then worry about perfect spelling.",
  "Practice with different accents and speaking speeds to improve your adaptability.",
  "Keep a vocabulary journal of new words you encounter during practice.",
  "Try to predict what comes next in a sentence - this improves your language intuition."
];

let userStats = {
  mistakePatterns: {},
  performanceHistory: [],
  strugglingAreas: []
};

// Load data from JSON file
async function loadData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    sentences = data.sentences;
    console.log("Data loaded successfully:", sentences);
  } catch (error) {
    console.error("Error loading data:", error);
    // Fallback to default sentences if JSON fails to load
    sentences = [
      {
        text: "The quick brown fox jumps over the lazy dog.",
        audio:
          "https://cdn13674550.b-cdn.net/SNA-audio/lesson%201/pronounce%201.mp3",
        choices: [
          "The quick brown fox jumps over the lazy dog.",
          "The quick brown fox jumped over the lazy dog.",
          "The quick brown fox jumps over a lazy dog.",
          "A quick brown fox jumps over the lazy dog.",
        ],
      },
    ];
  }
}

// Tips System Functions
function toggleTipsPanel() {
  const panel = document.getElementById('tipsPanel');
  const button = document.getElementById('tipsButton');
  
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    button.style.background = 'linear-gradient(45deg, #275151, #63a29b)';
    loadTipsForCategory(currentTipCategory);
  } else {
    panel.classList.add('hidden');
    button.style.background = 'linear-gradient(45deg, #63a29b, #275151)';
  }
}

function showTipCategory(category) {
  currentTipCategory = category;
  
  // Update tab appearances
  document.querySelectorAll('.tip-category').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(category + 'Tab').classList.add('active');
  
  loadTipsForCategory(category);
}

function loadTipsForCategory(category) {
  const container = document.getElementById('tipsContainer');
  const tips = tipsDatabase[category] || [];
  
  container.innerHTML = '';
  
  tips.forEach((tip, index) => {
    const tipElement = document.createElement('div');
    tipElement.className = 'tip-item';
    tipElement.style.animationDelay = `${index * 0.1}s`;
    
    tipElement.innerHTML = `
      <div class="tip-item-header">
        <span class="tip-item-icon">${tip.icon}</span>
        <span class="tip-item-title">${tip.title}</span>
      </div>
      <div class="tip-item-content">${tip.content}</div>
    `;
    
    tipElement.addEventListener('click', () => {
      showFloatingTip(tip.content);
    });
    
    container.appendChild(tipElement);
  });
}

function showFloatingTip(message) {
  const floatingTip = document.getElementById('floatingTip');
  const tipText = document.getElementById('floatingTipText');
  
  tipText.textContent = message;
  floatingTip.classList.remove('hidden');
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (!floatingTip.classList.contains('hidden')) {
      dismissFloatingTip();
    }
  }, 5000);
}

function dismissFloatingTip() {
  document.getElementById('floatingTip').classList.add('hidden');
}

function showContextualTip(context) {
  let tipMessage = '';
  
  switch(context) {
    case 'first_mistake':
      tipMessage = "Don't worry about the first mistake! Listen again and focus on the parts you missed.";
      break;
    case 'multiple_mistakes':
      tipMessage = "Having trouble? Try slowing down the audio or breaking the sentence into smaller parts.";
      break;
    case 'perfect_score':
      tipMessage = "Excellent work! You're developing great listening skills. Keep it up!";
      break;
    case 'mode_selection':
      tipMessage = "New to dictation? Try Multiple Choice first, then challenge yourself with Writing Mode!";
      break;
    case 'audio_available':
      tipMessage = "Audio is available for this sentence. Click play to listen before attempting the exercise.";
      break;
    case 'no_audio':
      tipMessage = "No audio for this sentence. Use your knowledge of English patterns to make your best guess!";
      break;
    default:
      return;
  }
  
  showFloatingTip(tipMessage);
}

function initializeDailyTip() {
  const today = new Date().getDate();
  const tipIndex = today % dailyTips.length;
  document.getElementById('dailyTipText').textContent = dailyTips[tipIndex];
}

function analyzeUserPerformance() {
  if (totalAttempts === 0) return;
  
  const accuracy = (correctAnswers / totalAttempts) * 100;
  userStats.performanceHistory.push(accuracy);
  
  // Show contextual tips based on performance
  if (accuracy === 100 && totalAttempts > 1) {
    showContextualTip('perfect_score');
  } else if (accuracy < 50 && totalAttempts >= 3) {
    showContextualTip('multiple_mistakes');
  }
}

// Function to update range slider colors dynamically
function updateRangeSliderColor(slider) {
    const value = slider.value;
    const min = slider.min || 0;
    const max = slider.max || 100;
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Update CSS custom property for the progress
    slider.style.setProperty('--range-progress', `${percentage}%`);
    
    // Update background with gradient
    const progressColor = '#63a29b';
    const trackColor = '#e5e7eb';
    
    slider.style.background = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`;
}

// Initialize audio controls for real audio files
function initializeAudioControls() {
    const audioSection = document.querySelector(".audio-section");
  
    // Remove any existing voice selector
    const oldVoiceSelect = document.querySelector(".voice-selector");
    if (oldVoiceSelect) {
      oldVoiceSelect.remove();
    }

    // Add volume and playback rate controls
    const controlsHTML = `
      <div class="audio-controls-container" style="min-height: 70px;">
        <div class="voice-selector" style = "margin-bottom: 15px;">
          <label for="volumeControl"><span class="icon-speaker" style="color: #63a29b;">🔊</span> Volume:</label>
          <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="1">
          <span id="volumeValue">100%</span>
        </div>
        <div class="voice-selector">
          <label for="playbackRateControl"><span class="icon-speed" style="color: #63a29b;">⚡</span> Speed:</label>
          <input type="range" id="playbackRateControl" min="0.5" max="2" step="0.1" value="1">
          <span id="speedValue">1.0x</span>
        </div>
      </div>
    `;
  
    audioSection.insertAdjacentHTML("afterbegin", controlsHTML);
  
    // Get the controls
    const volumeControl = document.getElementById("volumeControl");
    const playbackRateControl = document.getElementById("playbackRateControl");
    const volumeValue = document.getElementById("volumeValue");
    const speedValue = document.getElementById("speedValue");
  
    // Initialize colors
    updateRangeSliderColor(volumeControl);
    updateRangeSliderColor(playbackRateControl);
  
    // Add event listeners
    volumeControl.addEventListener("input", (e) => {
      if (audioElement) {
        audioElement.volume = e.target.value;
      }
      updateRangeSliderColor(e.target);
      volumeValue.textContent = Math.round(e.target.value * 100) + "%";
    });
  
    playbackRateControl.addEventListener("input", (e) => {
      if (audioElement) {
        audioElement.playbackRate = e.target.value;
      }
      updateRangeSliderColor(e.target);
      speedValue.textContent = parseFloat(e.target.value).toFixed(1) + "x";
    });
  
    // Update colors on mouse over for better UX
    [volumeControl, playbackRateControl].forEach(slider => {
      slider.addEventListener("mouseover", () => {
        slider.style.transition = "all 0.2s ease";
      });
      
      slider.addEventListener("mouseout", () => {
        slider.style.transition = "all 0.3s ease";
      });
    });
}

// Handle play/pause click - Main function for audio controls
function handlePlayPauseClick() {
  const currentSentence = sentences[currentSentenceIndex];

  // Check if audio URL exists for this sentence
  if (!currentSentence.audio) {
    showContextualTip('no_audio');
    return;
  }

  if (isPaused) {
    resumeAudio();
  } else if (isPlaying) {
    pauseAudio();
  } else {
    playAudioFile();
  }
}

// Play current sentence from CDN audio file
function playAudioFile() {
  const currentSentence = sentences[currentSentenceIndex];

  // Check if audio URL exists for this sentence
  if (!currentSentence.audio) {
    showContextualTip('no_audio');
    return;
  }

  // Stop any currently playing audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  // Create new audio element with CDN URL
  audioElement = new Audio(currentSentence.audio);

  // Set initial volume
  const volumeControl = document.getElementById("volumeControl");
  if (volumeControl) {
    audioElement.volume = volumeControl.value;
  }

  // Set up event handlers before playing
  audioElement.onloadstart = () => {
    console.log("Loading audio from:", currentSentence.audio);
  };

  audioElement.oncanplay = () => {
    console.log("Audio can start playing");
  };

  audioElement.onended = () => {
    isPlaying = false;
    isPaused = false;
    updatePlayButton();
  };

  audioElement.onerror = (e) => {
    isPlaying = false;
    isPaused = false;
    updatePlayButton();
    console.error("Audio error:", e);
    console.error("Failed to load audio from:", currentSentence.audio);
    alert("Error loading audio file. Please check your internet connection.");
  };

  // Play the audio
  audioElement
    .play()
    .then(() => {
      isPlaying = true;
      isPaused = false;
      updatePlayButton();
    })
    .catch((error) => {
      isPlaying = false;
      isPaused = false;
      updatePlayButton();
      console.error("Playback failed:", error);
      alert("Failed to play audio: " + error.message);
    });
}

// Pause current audio
function pauseAudio() {
  if (audioElement && isPlaying) {
    audioElement.pause();
    isPlaying = false;
    isPaused = true;
    updatePlayButton();
  }
}

// Resume audio playback
function resumeAudio() {
  if (audioElement && isPaused) {
    audioElement
      .play()
      .then(() => {
        isPlaying = true;
        isPaused = false;
        updatePlayButton();
      })
      .catch((error) => {
        console.error("Resume failed:", error);
        isPlaying = false;
        isPaused = false;
        updatePlayButton();
      });
  }
}

// Update play button state
function updatePlayButton() {
  const playButton = document.getElementById("playButton");
  if (playButton) {
    playButton.onclick = handlePlayPauseClick;

    if (isPaused) {
      playButton.innerHTML = '<span class="icon-play" style="color: white;">▷</span> Resume';
    } else if (isPlaying) {
      playButton.innerHTML = '<span class="icon-pause" style="color: white;">⏸</span> Pause';
    } else {
      playButton.innerHTML = '<span class="icon-play" style="color: white;">▷</span> Play Audio';
    }
  }
}

function goToStep2() {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
  document.getElementById("step1-indicator").classList.remove("active");
  document.getElementById("step2-indicator").classList.add("active");

  initializeDictation();
}

function initializeDictation() {
  currentSentenceIndex = 0;
  correctAnswers = 0;
  totalAttempts = 0;
  currentMode = null; // Reset mode selection
  
  // Keep exercise area and control buttons hidden until mode is selected
  document.getElementById("exerciseArea").classList.add("hidden");
  document.getElementById("controlButtons").classList.add("hidden");
  
  // Reset mode buttons to unselected state
  document.getElementById("writingMode").classList.remove("active");
  document.getElementById("choiceMode").classList.remove("active");
  
  // Show mode selector
  document.querySelector(".mode-selector").style.display = "flex";
  
  updateProgress();
  updateStats();
  toggleResetButton(true);
  
  // Show contextual tip for mode selection
  setTimeout(() => {
    showContextualTip('mode_selection');
  }, 1000);
}

function loadChoices() {
    const currentSentence = sentences[currentSentenceIndex];
    const choicesContainer = document.getElementById("choicesContainer");
    
    if (!choicesContainer || !currentSentence.choices) {
      console.error("Choices container not found or no choices available");
      return;
    }
  
    // Clear existing choices
    choicesContainer.innerHTML = "";
    
    // Create choice buttons
    currentSentence.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.textContent = choice;
      button.onclick = () => selectChoice(index);
      choicesContainer.appendChild(button);
    });
    
    // Reset selected choice
    selectedChoice = null;
}

function selectMode(mode) {
  currentMode = mode;

  // Update mode button states
  document.getElementById("writingMode").classList.remove("active");
  document.getElementById("choiceMode").classList.remove("active");
  
  if (mode === "writing") {
    document.getElementById("writingMode").classList.add("active");
    document.querySelector(".dictation-container h2").innerHTML = '<span class="icon-writing" style="color: #63a29b;">✏️</span> Interactive Dictation';
    document.getElementById("writingExercise").classList.remove("hidden");
    document.getElementById("choiceExercise").classList.add("hidden");
  } else if (mode === "choice") {
    document.getElementById("choiceMode").classList.add("active");
    document.querySelector(".dictation-container h2").innerHTML = '<span class="icon-choice" style="color: #63a29b;">✔</span> Multiple Choice';
    document.getElementById("writingExercise").classList.add("hidden");
    document.getElementById("choiceExercise").classList.remove("hidden");
    loadChoices();
  }

  // Hide mode selector permanently after selection
  document.querySelector(".mode-selector").style.display = "none";

  // Show exercise area and control buttons with animation
  document.getElementById("exerciseArea").classList.remove("hidden");
  document.getElementById("controlButtons").classList.remove("hidden");
  
  resetCurrentExercise();
  
  // Show audio availability tip
  const currentSentence = sentences[currentSentenceIndex];
  if (currentSentence.audio) {
    setTimeout(() => {
      showContextualTip('audio_available');
    }, 500);
  }
}

function selectChoice(index) {
  // Clear previous selections
  document.querySelectorAll(".choice-button").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Select current choice
  document.querySelectorAll(".choice-button")[index].classList.add("selected");
  selectedChoice = index;
}

// Audio objects for sound effects
const rightAnswerSound = new Audio("right answer SFX.wav");
const wrongAnswerSound = new Audio("wrong answer SFX.wav");

// Function to play sound effects with error handling
function playSoundEffect(audioElement) {
  try {
    audioElement.currentTime = 0;
    audioElement.play().catch((error) => {
      console.error("Sound effect error:", error);
    });
  } catch (error) {
    console.error("Sound effect error:", error);
  }
}

// Function to analyze answer and create word-by-word comparison
function analyzeAnswer(userInput, correctText) {
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
      correctAnalysis.push(`<span class="word-missing">${correctWord}</span>`);
    } else if (userWord && !correctWord) {
      // Extra word
      extra++;
      userAnalysis.push(`<span class="word-extra">${userWord}</span>`);
    } else if (userWord === correctWord) {
      // Correct word
      correctCount++;
      userAnalysis.push(`<span class="word-correct">${userWord}</span>`);
      correctAnalysis.push(`<span class="word-correct">${correctWord}</span>`);
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
    mistakes: mistakes,
    missing: missing,
    extra: extra,
    accuracy: accuracy,
    userAnalysis: userAnalysis.join(" "),
    correctAnalysis: correctAnalysis.join(" "),
    isPerfect: accuracy === 100,
  };
}

// Helper function to normalize words for comparison
function normalizeWord(word) {
  return word.toLowerCase().replace(/[^\w]/g, "");
}

function checkAnswer() {
  // Don't allow checking if no mode is selected
  if (!currentMode) {
    alert("Please select a mode first!");
    return;
  }

  let isCorrect = false;
  let score = 0;
  const currentSentence = sentences[currentSentenceIndex];

  if (currentMode === "writing") {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) {
      alert("Please type your answer first!");
      return;
    }
    const analysis = analyzeAnswer(userInput, currentSentence.text);
    score = analysis.accuracy;
    isCorrect = score === 100;

    // Store detailed analysis for feedback
    currentSentence.userAnalysis = analysis;
  } else {
    if (selectedChoice === null) {
      alert("Please select an answer first!");
      return;
    }
    isCorrect = selectedChoice === 0;
    score = isCorrect ? 100 : 0;

    // Highlight correct and wrong choices
    document.querySelectorAll(".choice-button").forEach((btn, index) => {
      if (index === 0) {
        btn.classList.add("correct");
      } else if (index === selectedChoice && selectedChoice !== 0) {
        btn.classList.add("wrong");
      }
    });
  }

  totalAttempts++;
  if (isCorrect) {
    correctAnswers++;
    playSoundEffect(rightAnswerSound);
  } else {
    playSoundEffect(wrongAnswerSound);
    
    // Show contextual tip for first mistake
    if (totalAttempts === 1) {
      setTimeout(() => {
        showContextualTip('first_mistake');
      }, 1500);
    }
  }

  sentenceScores[currentSentenceIndex] = score;
  showFeedback(isCorrect, currentSentence.text);
  updateStats();
  analyzeUserPerformance();

  document.getElementById("checkButton").classList.add("hidden");
  document.getElementById("nextButton").classList.remove("hidden");
}

// Function to normalize text for comparison
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateSimilarityScore(userInput, correctAnswer) {
  if (userInput === correctAnswer) return 100;

  const userWords = userInput.split(" ");
  const correctWords = correctAnswer.split(" ");

  let matchedWords = 0;
  let totalWords = correctWords.length;

  for (const word of userWords) {
    if (correctWords.includes(word)) {
      matchedWords++;
    }
  }

  const rawScore = (matchedWords / totalWords) * 100;
  return Math.min(rawScore, 90);
}

function calculateAverageScore() {
  if (sentenceScores.length === 0) return 0;

  const sum = sentenceScores.reduce((total, score) => total + score, 0);
  return sum / sentenceScores.length;
}

function showFeedback(isCorrect, correctText) {
  let feedback = document.getElementById("feedback");
  const statsSection = document.querySelector(".stats");
  const exerciseArea = document.getElementById("exerciseArea");
  
  // Create feedback element if it doesn't exist
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "feedback";
    feedback.className = "feedback";
  }
  
  if (currentMode === "writing") {
    // Hide exercise area and stats section when showing feedback in writing mode
    exerciseArea.classList.add("hidden");
    statsSection.style.display = "none";
    
    const userInput = document.getElementById("userInput").value.trim();
    const analysis = analyzeAnswer(userInput, correctText);

    if (analysis.isPerfect) {
      feedback.innerHTML = `
          <div class="feedback-header">
            <span class="feedback-icon">🎉</span>
            <span class="feedback-title">Perfect! Every word is correct!</span>
          </div>
          <div class="perfect-answer">
            <p>Your answer matches exactly:</p>
            <div class="answer-text perfect-match">${userInput}</div>
          </div>
        `;
      feedback.className = "feedback perfect show";
      // Insert feedback in the same position as stats
      statsSection.parentNode.insertBefore(feedback, statsSection);

    } else {
      feedback.innerHTML = `
          <div class="comparison-container">
            <div class="accuracy-header">
              <div class="accuracy-circle" style="background: ${getAccuracyColor(
                analysis.accuracy
              )}">
                <span class="accuracy-number">${analysis.accuracy}%</span>
                <span class="accuracy-label">Accuracy</span>
              </div>
              <div class="accuracy-details">
                <p>${getFeedbackMessage(analysis.accuracy)}</p>
              </div>
            </div>
            
            <div class="stats-row">
              <div class="stat-box">
                <div class="stat-number">${analysis.correctWords}</div>
                <div class="stat-label">Correct Words</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.mistakes}</div>
                <div class="stat-label">Mistakes</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.missing}</div>
                <div class="stat-label">Missing</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.extra}</div>
                <div class="stat-label">Extra</div>
              </div>
            </div>
            
            <div class="answer-comparison">
              <div class="answer-section">
                <h4>Your Answer:</h4>
                <div class="answer-text user-answer">${
                  analysis.userAnalysis
                }</div>
              </div>
              <div class="answer-section">
                <h4>Correct Answer:</h4>
                <div class="answer-text correct-answer">${
                  analysis.correctAnalysis
                }</div>
              </div>
            </div>
            
            <div class="improvement-tips">
              <h4>Tips to improve:</h4>
              <ul>
                ${getImprovementTips(analysis)}
              </ul>
            </div>
          </div>
        `;
      feedback.className = "feedback comparison show";
      // Insert feedback in the same position as stats
      statsSection.parentNode.insertBefore(feedback, statsSection);
    }
  } else {
    // Multiple choice mode feedback - don't hide exercise area or stats
    if (isCorrect) {
      feedback.textContent = "🎉 Excellent! That's correct!";
      feedback.className = "feedback correct show";
    } else {
      feedback.innerHTML = `❌ Not quite right.<br>Correct answer: "${correctText}"`;
      feedback.className = "feedback wrong show";
    }
    // For multiple choice, insert after stats (default behavior)
    if (!feedback.parentNode) {
      statsSection.insertAdjacentElement("afterend", feedback);
    }
  }
}

// Helper functions for feedback
function getAccuracyColor(accuracy) {
  if (accuracy >= 90) return "linear-gradient(135deg, #10b981, #059669)";
  if (accuracy >= 70) return "linear-gradient(135deg, #3b82f6, #1d4ed8)";
  if (accuracy >= 50) return "linear-gradient(135deg, #f59e0b, #d97706)";
  return "linear-gradient(135deg, #ef4444, #dc2626)";
}

function getFeedbackMessage(accuracy) {
  if (accuracy >= 90) return "Great job! Almost perfect!";
  if (accuracy >= 70) return "Good effort! Keep practicing!";
  if (accuracy >= 50) return "Not bad, but needs improvement.";
  return "Needs more practice. Listen carefully and try again!";
}

function getImprovementTips(analysis) {
  const tips = [];

  if (analysis.missing > 0) {
    tips.push("<li>Listen carefully for missing words</li>");
  }

  if (analysis.extra > 0) {
    tips.push("<li>Avoid adding extra words that weren't in the audio</li>");
  }

  if (analysis.mistakes > 0) {
    tips.push("<li>Pay attention to word endings and small differences</li>");
  }

  if (tips.length === 0) {
    tips.push(
      "<li>You're doing great! Just a few minor adjustments needed</li>"
    );
  }

  return tips.join("");
}

function nextSentence() {
  // Stop any playing audio when moving to next sentence
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    isPaused = false;
    updatePlayButton();
  }

  // Show exercise area and stats again when moving to next sentence
  const exerciseArea = document.getElementById("exerciseArea");
  const statsSection = document.querySelector(".stats");
  if (exerciseArea) {
    exerciseArea.classList.remove("hidden");
  }
  if (statsSection) {
    statsSection.style.display = "flex";
  }

  if (currentSentenceIndex < sentences.length - 1) {
    currentSentenceIndex++;
    updateProgress();
    resetCurrentExercise();
    
    // Show audio availability tip for new sentence
    const currentSentence = sentences[currentSentenceIndex];
    if (currentSentence.audio) {
      setTimeout(() => {
        showContextualTip('audio_available');
      }, 500);
    } else {
      setTimeout(() => {
        showContextualTip('no_audio');
      }, 500);
    }
  } else {
    showFinalResults();
  }
}

function resetCurrentExercise() {
  // Stop any playing audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    isPaused = false;
    updatePlayButton();
  }

  // Show exercise area and stats again when resetting
  const exerciseArea = document.getElementById("exerciseArea");
  const statsSection = document.querySelector(".stats");
  if (exerciseArea) {
    exerciseArea.classList.remove("hidden");
  }
  if (statsSection) {
    statsSection.style.display = "flex";
  }

  // Clear input if it exists
  const userInput = document.getElementById("userInput");
  if (userInput) {
    userInput.value = "";
  }

  // Clear choice button states
  document.querySelectorAll(".choice-button").forEach((btn) => {
    btn.classList.remove("selected", "correct", "wrong");
  });

  // Clear feedback
  const feedback = document.getElementById("feedback");
  if (feedback) {
    feedback.className = "feedback";
    // Remove feedback from DOM if it exists
    if (feedback.parentNode) {
      feedback.remove();
    }
  }

  // Reset buttons
  document.getElementById("checkButton").classList.remove("hidden");
  document.getElementById("nextButton").classList.add("hidden");

  // Load choices if in choice mode
  if (currentMode === "choice") {
    loadChoices();
  }
  
  // Reset selected choice
  selectedChoice = null;
}

function resetExercise() {
  // Stop any playing audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    isPaused = false;
  }

  // Show exercise area and stats again when resetting
  const exerciseArea = document.getElementById("exerciseArea");
  const statsSection = document.querySelector(".stats");
  if (exerciseArea) {
    exerciseArea.classList.remove("hidden");
  }
  if (statsSection) {
    statsSection.style.display = "flex";
  }

  // Only reset current sentence, not everything
  resetCurrentExercise();
  
  // Clear feedback
  const feedback = document.getElementById("feedback");
  if (feedback && feedback.parentNode) {
    feedback.remove();
  }

  // Don't reset mode selection or go back to mode selector
  // Don't reset progress or stats
  // Keep the same mode and continue with current sentence
}

function updateProgress() {
  const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;
  document.getElementById("progress").style.width = progress + "%";
  document.getElementById("counter").textContent = `Sentence ${
    currentSentenceIndex + 1
  } of ${sentences.length}`;
}

function updateStats() {
  document.getElementById("correctCount").textContent = correctAnswers;
  document.getElementById("totalCount").textContent = totalAttempts;

  const accuracy =
    totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  document.getElementById("accuracy").textContent = accuracy + "%";
}

function showFinalResults() {
  const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
  const averageScore = Math.round(calculateAverageScore());

  let message = "";

  if (averageScore >= 90) {
    message = "🏆 Outstanding! You have excellent listening skills!";
  } else if (averageScore >= 70) {
    message = "👍 Great job! Your listening skills are developing well!";
  } else if (averageScore >= 50) {
    message = "📚 Good effort! Keep practicing to improve your skills!";
  } else {
    message = "💪 Don't give up! Practice makes perfect!";
  }

  document.getElementById("exerciseArea").innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h3 style="color: #4caf50; margin-bottom: 20px; font-size: 1.8rem;">Exercise Complete!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${message}</p>
            <div style="background: linear-gradient(135deg, #f8f9ff, #e5e7eb); padding: 20px; border-radius: 15px; margin: 20px 0;">
                <h4 style="margin-bottom: 15px;">Final Results:</h4>
                <p><strong>Correct Answers:</strong> ${correctAnswers}/${totalAttempts}</p>
                <p><strong>Accuracy:</strong> ${accuracy}%</p>
            </div>
            <button onclick="restartExercise()" style="background: linear-gradient(45deg, #63a29b, #275151); color: white; padding: 15px 30px; border: none; border-radius: 10px; font-size: 1.1rem; cursor: pointer; margin-top: 20px;">
                <span style="color: white;">↻</span> Start New Exercise
            </button>
        </div>
    `;

  toggleResetButton(false);
  
  // Show final performance tip
  setTimeout(() => {
    if (accuracy >= 80) {
      showFloatingTip("Excellent performance! Consider challenging yourself with faster playback speeds next time.");
    } else if (accuracy >= 60) {
      showFloatingTip("Good progress! Try focusing on the tips in the help panel to improve further.");
    } else {
      showFloatingTip("Keep practicing! Remember, consistency is more important than perfection.");
    }
  }, 2000);
}

// Function to completely restart the exercise (goes back to mode selection)
function restartExercise() {
  // Stop any playing audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    isPaused = false;
  }

  // Show exercise area and stats again when restarting
  const exerciseArea = document.getElementById("exerciseArea");
  const statsSection = document.querySelector(".stats");
  if (exerciseArea) {
    exerciseArea.classList.remove("hidden");
  }
  if (statsSection) {
    statsSection.style.display = "flex";
  }

  currentSentenceIndex = 0;
  correctAnswers = 0;
  totalAttempts = 0;
  sentenceScores = [];
  currentMode = null; // Reset mode selection
  
  // Hide exercise area and control buttons again
  document.getElementById("exerciseArea").classList.add("hidden");
  document.getElementById("controlButtons").classList.add("hidden");
  
  // Reset mode buttons
  document.getElementById("writingMode").classList.remove("active");
  document.getElementById("choiceMode").classList.remove("active");
  
  // Show mode selector again
  document.querySelector(".mode-selector").style.display = "flex";
  
  updateProgress();
  updateStats();
  
  // Clear feedback
  const feedback = document.getElementById("feedback");
  if (feedback && feedback.parentNode) {
    feedback.remove();
  }

  toggleResetButton(true);

  // Reset the exercise area content
  document.getElementById("exerciseArea").innerHTML = `
        <div id="writingExercise" class="hidden">
            <label for="userInput" style="display: block; margin-bottom: 10px; font-weight: 600; color: #374151;">
                Type what you heard:
            </label>
            <textarea id="userInput" class="text-input" placeholder="Type the sentence you heard here..." spellcheck="false" autocorrect="off" autocapitalize="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"></textarea>
        </div>
        
        <div id="choiceExercise" class="hidden">
            <p style="margin-bottom: 20px; font-weight: 600; color: #374151;">Choose the correct sentence:</p>
            <div class="choices-container" id="choicesContainer">
                <!-- Choices will be populated by JavaScript -->
            </div>
        </div>
    `;

  // Reset the dictation container title
  document.querySelector(".dictation-container h2").innerHTML = '<span class="icon-dictation" style="color: #63a29b;">📝</span> Interactive Dictation';
}

function toggleResetButton(show) {
  const resetButton = document.querySelector(
    '.control-button[onclick="resetExercise()"]'
  );
  if (resetButton) {
    resetButton.style.display = show ? "block" : "none";
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async function () {
  // Load data first
  await loadData();

  // Initialize tips system
  initializeDailyTip();
  loadTipsForCategory('listening');

  // Initialize audio controls
  initializeAudioControls();

  // Preload sound effects
  try {
    rightAnswerSound.preload = "auto";
    wrongAnswerSound.preload = "auto";
    rightAnswerSound.load();
    wrongAnswerSound.load();
  } catch (error) {
    console.error("Error loading sound effects:", error);
  }

  // Disable spellcheck function
  function disableSpellCheck() {
    const userInput = document.getElementById("userInput");
    if (userInput) {
      userInput.setAttribute("spellcheck", "false");
      userInput.setAttribute("autocorrect", "off");
      userInput.setAttribute("autocapitalize", "off");
    }
  }

  disableSpellCheck();

  // MutationObserver for dynamic elements
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        disableSpellCheck();
      }
    });
  });

  const exerciseArea = document.getElementById("exerciseArea");
  if (exerciseArea) {
    observer.observe(exerciseArea, {
      childList: true,
      subtree: true,
    });
  }

  // Add keyboard shortcuts for better UX
  document.addEventListener('keydown', function(e) {
    // Space bar to play/pause audio
    if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handlePlayPauseClick();
    }
    
    // Enter to check answer (when not in textarea)
    if (e.code === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      const checkButton = document.getElementById('checkButton');
      const nextButton = document.getElementById('nextButton');
      
      if (!checkButton.classList.contains('hidden')) {
        checkAnswer();
      } else if (!nextButton.classList.contains('hidden')) {
        nextSentence();
      }
    }
    
    // Escape to close tips panel
    if (e.code === 'Escape') {
      const tipsPanel = document.getElementById('tipsPanel');
      if (!tipsPanel.classList.contains('hidden')) {
        toggleTipsPanel();
      }
    }
    
    // Numbers 1-4 for multiple choice selection
    if (currentMode === 'choice' && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
      const choiceIndex = parseInt(e.code.slice(-1)) - 1;
      const choices = document.querySelectorAll('.choice-button');
      if (choices[choiceIndex]) {
        selectChoice(choiceIndex);
      }
    }
  });

  // Add click outside to close tips panel
  document.addEventListener('click', function(e) {
    const tipsPanel = document.getElementById('tipsPanel');
    const tipsButton = document.getElementById('tipsButton');
    
    if (!tipsPanel.classList.contains('hidden') && 
        !tipsPanel.contains(e.target) && 
        !tipsButton.contains(e.target)) {
      toggleTipsPanel();
    }
  });

  // Add visibility change listener to pause audio when tab is not active
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying) {
      pauseAudio();
    }
  });

  // Show welcome tip after a short delay
  setTimeout(() => {
    showFloatingTip("Welcome to SNA Academy! Click the Tips & Help button for learning strategies and shortcuts.");
  }, 2000);
});
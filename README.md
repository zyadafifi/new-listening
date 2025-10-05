# SNA Academy - English Learning Platform

A modern, interactive English learning platform built with React.js and Tailwind CSS. Master English through listening and dictation exercises with YouTube video integration.

## 🎯 Features

### 🏠 Home Page

- **Lesson Overview**: Browse available lessons with difficulty levels and descriptions
- **Progress Tracking**: Visual progress indicators for each lesson
- **Responsive Design**: Mobile-first design that works on all devices
- **Interactive Cards**: Hover effects and smooth animations

### 🎧 Listening Phase

- **YouTube Integration**: Embedded YouTube playlists for listening practice
- **Daily Tips**: Contextual learning tips that change daily
- **Progress Indicators**: Visual feedback on listening progress
- **Instructions**: Clear guidance for effective listening practice

### ✏️ Dictation Phase

- **Dual Modes**: Choose between Writing Mode or Multiple Choice
- **Smart Analysis**: Detailed word-by-word analysis of written answers
- **Audio Controls**: Volume and playback speed adjustment
- **Real-time Feedback**: Immediate feedback with detailed explanations

### 🎵 Audio Features

- **High-Quality Audio**: CDN-hosted audio files for exercises
- **Playback Controls**: Play, pause, volume, and speed controls
- **Sound Effects**: Audio feedback for correct/incorrect answers
- **Error Handling**: Graceful fallback when audio is unavailable

### 📊 Progress Tracking

- **Real-time Stats**: Live accuracy, correct answers, and total attempts
- **Performance Analytics**: Detailed analysis of mistakes and improvements
- **Visual Progress**: Animated progress bars and completion indicators
- **Achievement System**: Performance-based feedback and encouragement

### 💡 Learning Support

- **Comprehensive Tips**: Categorized tips for listening, writing, and general learning
- **Contextual Help**: Tips that appear based on user performance
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Accessibility**: Screen reader friendly and keyboard accessible

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SNA-Listening
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── LessonPhase/     # Lesson-specific components
│   │   ├── ListeningPhase.jsx
│   │   └── DictationPhase.jsx
│   ├── AudioControls.jsx
│   ├── ExerciseArea.jsx
│   ├── FeedbackDisplay.jsx
│   ├── Header.jsx
│   ├── KeyboardShortcuts.jsx
│   ├── LessonCard.jsx
│   └── TipsPanel.jsx
├── pages/               # Page components
│   ├── HomePage.jsx
│   └── LessonPage.jsx
├── hooks/               # Custom React hooks
│   └── useKeyboardShortcuts.js
├── utils/               # Utility functions
│   └── soundEffects.js
├── data/                # Data and configuration
│   └── lessons.js
├── assets/              # Static assets
│   └── audio/           # Sound effects
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles with Tailwind
```

## 🎨 Design System

### Color Palette

- **Primary**: SNA Teal (#14b8a6)
- **Secondary**: SNA Dark (#0f172a)
- **Accent**: Green (#22c55e)
- **Background**: Gradient from teal to dark

### Typography

- **Font Family**: Inter (Google Fonts)
- **Responsive**: Fluid typography with clamp() functions
- **Hierarchy**: Clear heading and text size relationships

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Clean borders with focus states
- **Animations**: Smooth transitions and micro-interactions

## ⌨️ Keyboard Shortcuts

| Shortcut | Action                               |
| -------- | ------------------------------------ |
| `Space`  | Play/Pause audio                     |
| `Enter`  | Submit answer or go to next          |
| `Esc`    | Reset current exercise               |
| `Ctrl+W` | Select Writing Mode                  |
| `Ctrl+M` | Select Multiple Choice Mode          |
| `1-4`    | Select choice (Multiple Choice mode) |
| `Ctrl+N` | Next exercise                        |
| `Ctrl+R` | Reset exercise                       |

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured experience (1024px+)
- **Large Screens**: Maximum content width with centered layout

## 🔧 Customization

### Adding New Lessons

Edit `src/data/lessons.js` to add new lessons:

```javascript
{
  id: 4,
  title: "Advanced Conversation",
  description: "Master complex conversational patterns",
  difficulty: "Advanced",
  duration: "30 minutes",
  youtubePlaylistId: "YOUR_PLAYLIST_ID",
  thumbnail: "THUMBNAIL_URL",
  exercises: [
    // Exercise objects
  ]
}
```

### Modifying Tips

Update the `tipsDatabase` in `src/data/lessons.js`:

```javascript
tipsDatabase: {
  listening: [
    {
      title: "Your Tip Title",
      content: "Your tip content",
      icon: "🎧",
    },
  ];
}
```

### Styling

The application uses Tailwind CSS with custom configuration in `tailwind.config.js`. Modify the theme to change colors, fonts, and other design tokens.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run build test
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for client-side routing

### Other Platforms

The built application is a static site that can be deployed to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **YouTube API**: For video integration
- **Tailwind CSS**: For the utility-first CSS framework
- **React**: For the component-based architecture
- **Vite**: For the fast build tool and development server

## 📞 Support

For support, email support@sna-academy.com or create an issue in the repository.

---

**SNA Academy** - Master English through Listening and Dictation 🎓

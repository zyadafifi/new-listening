// Utility to generate 60 comprehensive lessons
const lessonTemplates = [
  // Basic Level (1-20)
  {
    category: "Basic",
    topics: [
      "Greetings",
      "Numbers",
      "Colors",
      "Family",
      "Food",
      "Weather",
      "Time",
      "Days",
      "Months",
      "Animals",
      "Body Parts",
      "Clothes",
      "House",
      "School",
      "Jobs",
      "Transportation",
      "Hobbies",
      "Sports",
      "Music",
      "Movies",
    ],
  },

  // Intermediate Level (21-40)
  {
    category: "Intermediate",
    topics: [
      "Travel",
      "Shopping",
      "Restaurants",
      "Health",
      "Technology",
      "Environment",
      "Education",
      "Work",
      "Relationships",
      "Culture",
      "History",
      "Geography",
      "Science",
      "Art",
      "Literature",
      "Philosophy",
      "Psychology",
      "Economics",
      "Politics",
      "Social Issues",
    ],
  },

  // Advanced Level (41-60)
  {
    category: "Advanced",
    topics: [
      "Business",
      "Academic",
      "Professional",
      "Technical",
      "Scientific",
      "Medical",
      "Legal",
      "Financial",
      "International",
      "Diplomatic",
      "Research",
      "Innovation",
      "Leadership",
      "Management",
      "Strategy",
      "Analysis",
      "Criticism",
      "Debate",
      "Negotiation",
      "Presentation",
    ],
  },
];

const generateLessonContent = (id, category, topic) => {
  const baseSentences = {
    Basic: [
      "Hello, how are you today?",
      "What is your favorite color?",
      "I have three brothers and two sisters.",
      "The weather is beautiful today.",
      "I like to play football with my friends.",
      "My mother is a teacher at the local school.",
      "We eat dinner together every evening.",
      "The cat is sleeping on the sofa.",
      "I go to school by bus every morning.",
      "My favorite subject is mathematics.",
    ],
    Intermediate: [
      "The conference will be held in the main auditorium next month.",
      "Environmental protection requires immediate action from all nations.",
      "The research findings suggest a significant correlation between variables.",
      "Cultural diversity enriches our understanding of different perspectives.",
      "The economic impact of this decision cannot be underestimated.",
      "Technological advancement has revolutionized modern communication methods.",
      "Educational institutions play a crucial role in societal development.",
      "The historical significance of this event shaped our current reality.",
      "International cooperation is essential for global problem-solving.",
      "The psychological effects of stress vary among different individuals.",
    ],
    Advanced: [
      "The implementation of strategic initiatives requires comprehensive stakeholder analysis.",
      "Multinational corporations must navigate complex regulatory frameworks across jurisdictions.",
      "The epistemological foundations of this methodology warrant careful examination.",
      "Socioeconomic factors significantly influence educational outcomes and opportunities.",
      "The interdisciplinary approach facilitates innovative solutions to complex problems.",
      "Quantitative analysis reveals statistically significant patterns in the dataset.",
      "The ontological assumptions underlying this theory challenge conventional paradigms.",
      "Institutional frameworks must adapt to accommodate evolving technological landscapes.",
      "The phenomenological experience of consciousness remains a subject of ongoing investigation.",
      "Metacognitive strategies enhance learning outcomes across diverse educational contexts.",
    ],
  };

  const sentences = baseSentences[category] || baseSentences.Basic;
  const randomSentence =
    sentences[Math.floor(Math.random() * sentences.length)];

  // Generate choices with common mistakes
  const choices = [
    randomSentence, // Correct answer
    randomSentence.replace(/s$/, ""), // Remove 's' from end
    randomSentence.replace(/the /, "a "), // Replace 'the' with 'a'
    randomSentence.replace(/is/, "are"), // Change verb form
    randomSentence.replace(/and/, "or"), // Change conjunction
    randomSentence.replace(/will/, "would"), // Change tense
    randomSentence.replace(/can/, "could"), // Change modal
    randomSentence.replace(/have/, "has"), // Change verb form
    randomSentence.replace(/this/, "that"), // Change demonstrative
    randomSentence.replace(/these/, "those"), // Change demonstrative
  ].slice(0, 4); // Take only 4 choices

  return {
    id: id,
    text: randomSentence,
    audio:
      id <= 20
        ? `https://cdn13674550.b-cdn.net/SNA-audio/lesson%20${Math.ceil(
            id / 5
          )}/pronounce%20${id}.mp3`
        : null,
    choices: choices,
  };
};

export const generateAllLessons = () => {
  const lessons = [];
  let exerciseId = 1;

  lessonTemplates.forEach((level, levelIndex) => {
    level.topics.forEach((topic, topicIndex) => {
      const lessonId = levelIndex * 20 + topicIndex + 1;
      const exercises = [];

      // Generate 3-5 exercises per lesson
      const exerciseCount = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < exerciseCount; i++) {
        exercises.push(
          generateLessonContent(exerciseId, level.category, topic)
        );
        exerciseId++;
      }

      lessons.push({
        id: lessonId,
        title: `${topic} - ${level.category}`,
        description: `Master ${topic.toLowerCase()} vocabulary and expressions at ${level.category.toLowerCase()} level`,
        duration: `${15 + Math.floor(Math.random() * 15)} minutes`,
        youtubeVideoId: `example${lessonId}`,
        thumbnail: `https://img.youtube.com/vi/example${lessonId}/maxresdefault.jpg`,
        exercises: exercises,
      });
    });
  });

  return lessons;
};

export default generateAllLessons;

import React, { useState, useEffect, useCallback } from "react";
import { Brain, Languages } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizContent {
  title: string;
  subtitle: string;
  inactivityWarning: string;
  startButton: string;
  scoreText: string;
  outOf: string;
  perfectScore: string;
  goodScore: string;
  encouragement: string;
  tryAgain: string;
  questionLabel: string;
  scoreLabel: string;
  timeUntilReset: string;
}

const translations: Record<string, QuizContent> = {
  en: {
    title: "Chaos Quiz Challenge",
    subtitle: "Let's do a simple test! You have one minute. Good luck!",
    inactivityWarning: "Quiz will restart after 20 seconds of inactivity!",
    startButton: "Start Quiz",
    scoreText: "Your Score:",
    outOf: "out of",
    perfectScore: "Perfect score! You're amazing! 🌟",
    goodScore: "Well done! Keep practicing! 👏",
    encouragement: "Keep trying, you'll do better next time! 💪",
    tryAgain: "Try Again",
    questionLabel: "Question",
    scoreLabel: "Score",
    timeUntilReset: "Time until reset",
  },
  de: {
    title: "Chaos-Quiz-Challenge",
    subtitle:
      "Machen wir einen einfachen Test! Sie haben eine Minute Zeit. Viel Glück!",
    inactivityWarning:
      "Das Quiz wird nach 20 Sekunden Inaktivität neu gestartet!",
    startButton: "Quiz starten",
    scoreText: "Dein Ergebnis:",
    outOf: "von",
    perfectScore: "Perfekte Punktzahl! Du bist fantastisch! 🌟",
    goodScore: "Gut gemacht! Übe weiter! 👏",
    encouragement: "Bleib dran, beim nächsten Mal wird es besser! 💪",
    tryAgain: "Erneut versuchen",
    questionLabel: "Frage",
    scoreLabel: "Punkte",
    timeUntilReset: "Zeit bis zum Neustart",
  },
};

const questions: Record<string, Question[]> = {
  en: [
    {
      question: "How many days are there in a leap year?",
      options: ["365", "366", "364"],
      correct: 1,
    },
    {
      question: "How many letters are in the word 'butterfly'?",
      options: ["10", "12", "13"],
      correct: 2,
    },
    {
      question: "What is 15 + 7 – 5?",
      options: ["16", "18", "17"],
      correct: 2,
    },
    {
      question: "How many hours are there in a day?",
      options: ["24", "25", "23"],
      correct: 0,
    },
    {
      question: "Which month has 28 days?",
      options: ["February", "All months", "March"],
      correct: 1,
    },
    {
      question: "What color is made by mixing blue and yellow?",
      options: ["Green", "Purple", "Orange"],
      correct: 0,
    },
    {
      question: "How many continents are there on Earth?",
      options: ["5", "6", "7"],
      correct: 2,
    },
    {
      question:
        "How many times does the letter 'e' appear in the word 'elephant'?",
      options: ["1", "2", "3"],
      correct: 1,
    },
    {
      question: "What is the third digit in the number 7315?",
      options: ["3", "1", "7"],
      correct: 1,
    },
    {
      question: "What is the result of 6 × 7?",
      options: ["42", "48", "63"],
      correct: 0,
    },
  ],

  de: [
    {
      question: "Wie viele Tage hat ein Schaltjahr?",
      options: ["365", "366", "364"],
      correct: 1,
    },
    {
      question: "Wie viele Buchstaben hat das Wort „Schmetterling“?",
      options: ["10", "12", "13"],
      correct: 2,
    },
    {
      question: "Was ist 15 + 7 – 5?",
      options: ["16", "18", "17"],
      correct: 2,
    },
    {
      question: "Wie viele Stunden hat ein Tag?",
      options: ["24", "25", "23"],
      correct: 0,
    },
    {
      question: "Welcher Monat hat 28 Tage?",
      options: ["Februar", "Alle Monate", "März"],
      correct: 1,
    },
    {
      question: "Welche Farbe entsteht, wenn man Blau und Gelb mischt?",
      options: ["Grün", "Lila", "Orange"],
      correct: 0,
    },
    {
      question: "Wie viele Kontinente gibt es auf der Erde?",
      options: ["5", "6", "7"],
      correct: 2,
    },
    {
      question: "Wie oft kommt der Buchstabe „e“ im Wort „Elefant“ vor?",
      options: ["1", "2", "3"],
      correct: 1,
    },
    {
      question: "Was ist die dritte Ziffer in der Zahl 7315?",
      options: ["3", "1", "7"],
      correct: 1,
    },
    {
      question: "Was ist das Ergebnis von 6 × 7?",
      options: ["42", "48", "63"],
      correct: 0,
    },
  ],
};

const INACTIVITY_TIMEOUT = 20000; // 2 minutes in milliseconds

interface QuizProps {
  onStart: () => void;
  onEnd: () => void;
}

function Quiz({ onStart, onEnd }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [started, setStarted] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [language, setLanguage] = useState<"en" | "de">("de");

  const t = translations[language];
  const currentQuestions = questions[language];

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setStarted(false);
    onEnd();
  }, [onEnd]);

  const updateInteraction = useCallback(() => {
    setLastInteraction(Date.now());
  }, []);

  useEffect(() => {
    if (!started || showScore) return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastInteraction >= INACTIVITY_TIMEOUT) {
        resetQuiz();
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    return () => clearInterval(interval);
  }, [started, showScore, lastInteraction, resetQuiz]);

  useEffect(() => {
    if (!started || showScore) return;

    const handleActivity = () => {
      updateInteraction();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [started, showScore, updateInteraction]);

  const handleStart = () => {
    setStarted(true);
    updateInteraction();
    onStart();
  };

  const handleAnswer = (selectedOption: number) => {
    updateInteraction();
    if (selectedOption === currentQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < currentQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      onEnd();
    }
  };

  const handleRestart = () => {
    resetQuiz();
    updateInteraction();
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "de" : "en"));
  };

  if (!started) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 text-center animate-fade-in">
        <Brain className="w-16 h-16 mx-auto text-purple-600 mb-4" />
        <button
          onClick={toggleLanguage}
          className="flex-1 mb-4 p-4 rounded-full bg-gray-100 text-purple-700 hover:bg-white transition-colors"
          aria-label="Toggle language"
        >
          <Languages className="w-6 h-6 text-purple-600" />
          <span className="ml-2 text-sm font-medium text-gray-600">
            {language === "en" ? "EN" : "DE"}
          </span>
        </button>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{t.title}</h1>
        <p className="text-gray-600 mb-8">
          {t.subtitle}
          <br />
          <span className="text-sm text-red-500">{t.inactivityWarning}</span>
        </p>
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transform transition hover:scale-105"
        >
          {t.startButton}
        </button>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">🎉</h2>
        <p className="text-2xl mb-4">
          {t.scoreText} {score} {t.outOf} {currentQuestions.length}
        </p>
        <p className="text-gray-600 mb-6">
          {score === currentQuestions.length
            ? t.perfectScore
            : score >= currentQuestions.length / 2
            ? t.goodScore
            : t.encouragement}
        </p>
        <button
          onClick={handleRestart}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transform transition hover:scale-105"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  const timeLeft = Math.max(
    0,
    Math.floor((INACTIVITY_TIMEOUT - (Date.now() - lastInteraction)) / 1000)
  );

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-500">
            {t.questionLabel} {currentQuestion + 1}/{currentQuestions.length}
          </span>
          <span className="text-sm font-semibold text-purple-600">
            {t.scoreLabel}: {score}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-red-500">
            {t.timeUntilReset}: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {currentQuestions[currentQuestion].question}
        </h2>
      </div>
      <div className="grid gap-4">
        {currentQuestions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="bg-gray-50 hover:bg-purple-50 text-left p-4 rounded-lg transition-colors duration-200 hover:shadow-md"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Ban, Bell, Bug, Bomb } from 'lucide-react';
import Quiz from './components/Quiz';
import RandomPopup from './components/RandomPopup';

const MAX_POPUPS = 8;

function App() {
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; isFloating: boolean }[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    if (!isQuizActive) return;

    const createPopup = () => {
      const x = Math.random() * (window.innerWidth - 200);
      const y = Math.random() * (window.innerHeight - 200);
      const isFloating = Math.random() > 0.5;
      
      setPopups(prev => {
        const newPopups = [...prev, { id: Date.now(), x, y, isFloating }];
        // Remove oldest popups if exceeding MAX_POPUPS
        if (newPopups.length > MAX_POPUPS) {
          return newPopups.slice(-MAX_POPUPS);
        }
        return newPopups;
      });
    };

    // Create popups more frequently (every 800ms)
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // Increased probability of popup creation
        createPopup();
      }
    }, 800);

    // Cleanup function
    return () => clearInterval(interval);
  }, [isQuizActive]);

  const removePopup = (id: number) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  };

  const startQuiz = () => {
    setIsQuizActive(true);
  };

  const endQuiz = () => {
    setIsQuizActive(false);
    setPopups([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-2xl mx-auto">
        <Quiz onStart={startQuiz} onEnd={endQuiz} />
      </div>
      {popups.map(popup => (
        <RandomPopup
          key={popup.id}
          x={popup.x}
          y={popup.y}
          isFloating={popup.isFloating}
          onClose={() => removePopup(popup.id)}
        />
      ))}
    </div>
  );
}

export default App;
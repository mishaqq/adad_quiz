import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Bell, Bug, Bomb } from "lucide-react";

const distractingMessages = [
  "Wo hab ich das gesehen?",
  "Warum blinkt das so?",
  "Das ist zu schwer…",
  "Ich brauche Kaffee…",
  "Was war das für ein Geräusch?",
  "Wie viele Fragen noch?",
  "Habe ich das richtig gemacht?",
  "Warum dauert das so lange?",
  "Ich muss etwas Wichtiges aufschreiben!",
  "Oh nein, ich habe die Antwort vergessen.",
  "Schauen die anderen zu?",
  "Diese Farben lenken mich ab.",
  "Was soll ich später einkaufen?",
  "Diese Schrift sieht komisch aus…",
  "Hat gerade jemand was gesagt?",
];

const icons = [AlertTriangle, Bell, Bug, Bomb];

interface RandomPopupProps {
  x: number;
  y: number;
  isFloating: boolean;
  onClose: () => void;
}

function RandomPopup({ x, y, isFloating, onClose }: RandomPopupProps) {
  const [message] = useState(
    distractingMessages[Math.floor(Math.random() * distractingMessages.length)]
  );
  const Icon = icons[Math.floor(Math.random() * icons.length)];
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isFloating) return;

    const floatAnimation = () => {
      const radius = 30; // Maximum float distance
      const angle = Date.now() * 0.001; // Time-based angle
      const newX = x + Math.cos(angle) * radius;
      const newY = y + Math.sin(angle) * radius;
      setPosition({ x: newX, y: newY });
    };

    const animationFrame = setInterval(floatAnimation, 16);
    return () => clearInterval(animationFrame);
  }, [isFloating, x, y]);

  // Add auto-close after random time between 5-10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, Math.random() * 5000 + 5000); // Random time between 5-10 seconds

    return () => clearTimeout(timeout);
  }, [onClose]);

  const popupStyle: React.CSSProperties = {
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 50,
    transform: "scale(0)",
    animation: `popup 0.3s ease-out forwards${
      isFloating ? ", float 3s ease-in-out infinite" : ""
    }`,
  };

  return (
    <div
      style={popupStyle}
      onClick={onClose}
      className={`bg-white rounded-lg shadow-xl p-4 w-64 cursor-pointer hover:bg-gray-50 transition-colors ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${isFloating ? "floating-popup" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-red-500 mr-2" />
          <span className="font-semibold text-gray-800">Alert!</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export default RandomPopup;

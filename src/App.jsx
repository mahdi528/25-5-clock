import { useState, useEffect } from "react";
import "./App.css";

export default function PomodoroClock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [timerLabel, setTimerLabel] = useState("Session");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            const beep = document.getElementById("beep");
            if (beep) {
              beep.play(); // تأكد من تشغيل الصوت عند الوصول إلى صفر
            }

            const newSession = !isSession;
            setIsSession(newSession);
            setTimerLabel(newSession ? "Session" : "Break");
            return newSession ? sessionLength * 60 : breakLength * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, isSession, sessionLength, breakLength]);

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    setTimerLabel("Session");
    const beep = document.getElementById("beep");
    if (beep) {
      beep.pause();
      beep.currentTime = 0;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="pomodoro-container">
      <h1>Pomodoro Clock</h1>
      <div id="break-label" className="label">Break Length</div>
      <button id="break-decrement" className="btn" onClick={() => setBreakLength((prev) => Math.max(1, prev - 1))}>-</button>
      <span id="break-length" className="value">{breakLength}</span>
      <button id="break-increment" className="btn" onClick={() => setBreakLength((prev) => Math.min(60, prev + 1))}>+</button>

      <div id="session-label" className="label">Session Length</div>
      <button id="session-decrement" className="btn" onClick={() => {
        setSessionLength((prev) => Math.max(1, prev - 1));
        setTimeLeft((prev) => Math.max(60, prev - 60));
      }}>-</button>
      <span id="session-length" className="value">{sessionLength}</span>
      <button id="session-increment" className="btn" onClick={() => {
        setSessionLength((prev) => Math.min(60, prev + 1));
        setTimeLeft((prev) => Math.min(3600, prev + 60));
      }}>+</button>

      <div id="timer-label" className="timer-label">{timerLabel}</div>
      <div id="time-left" className="time-left">{formatTime(timeLeft)}</div>

      <button id="start_stop" className="btn" onClick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button id="reset" className="btn" onClick={handleReset}>Reset</button>

      {/* تأكد من المسار الصحيح للملف في مجلد public */}
      <audio id="beep" src="/sound/Beep sound effects.mp3"></audio>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const TimerProgressBar = () =>
{
  const TOTAL_SECONDS = 25;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Update every n milliseconds
    } else if (timeLeft === 0) {
      setIsRunning(false); // Stop the timer when it reaches 0
    }
    // Cleanup function to clear the interval when the component unmounts or when isRunning/timeLeft changes
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]); // Re-run effect when isRunning or timeLeft changes

  const startTimer = () => {
    setTimeLeft(TOTAL_SECONDS); // Reset timer to 30 seconds
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TOTAL_SECONDS);
  };

  // Calculate the percentage for the progress bar
  const progress = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

  return (
    <ProgressBar now={progress} label={`${timeLeft} seconds`} animated={isRunning} />
  );
};

export default TimerProgressBar;
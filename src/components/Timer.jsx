import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Timer = ({ min, sec, onTimerEnd, orderId }) => {
  const [minutes, setMinutes] = useState(min);
  const [seconds, setSeconds] = useState(sec);

  useEffect(() => {
    const savedTime = localStorage.getItem(`timer-${orderId}`);
    if (savedTime) {
      const { minutes, seconds } = JSON.parse(savedTime);
      setMinutes(minutes);
      setSeconds(seconds);
    }
  }, [orderId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
        onTimerEnd();
      }
      localStorage.setItem(`timer-${orderId}`, JSON.stringify({ minutes, seconds }));
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds, onTimerEnd, orderId]);

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <div className="text-lg font-mono bg-gray-100 text-gray-800 p-2 rounded-lg shadow-md text-center">
      {formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
};

Timer.propTypes = {
  min: PropTypes.number,
  sec: PropTypes.number,
  onTimerEnd: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
};

Timer.defaultProps = {
  min: 0,
  sec: 0,
};

export default Timer;
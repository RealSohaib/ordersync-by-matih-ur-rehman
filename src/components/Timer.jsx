import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Timer = ({ min, Sec }) => {
  const [minutes, setMinutes] = useState(min);
  const [seconds, setSeconds] = useState(Sec);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <div className="text-lg font-mono bg-gray-800 text-white p-2 rounded">
      {formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
};

Timer.propTypes = {
  minuts: PropTypes.number,
  seconds: PropTypes.number,
};

Timer.defaultProps = {
  minuts: 0,
  seconds: 0,
};

export default Timer;
import "./App.css";
import { useEffect, useState } from "react";

const SESSION = "session";
const BREAK = "break";

const SETUP = "setup";
const COUNTDOWN = "countdown";

const PAUSE = "pause";

const INIT_TIMER_VALUE = { session: 25, break: 5 };

const INIT_SETUP_VALUE = {
  ...INIT_TIMER_VALUE,
  sessionSelect: SESSION,
};

const INIT_COUNTDOWN_VALUE = {
  ...INIT_SETUP_VALUE,
  clock: {
    min: INIT_SETUP_VALUE.session,
    second: 0,
  },
};

function App() {
  const [setup, setSetUp] = useState(INIT_SETUP_VALUE);
  const [countdown, setCountDown] = useState(INIT_COUNTDOWN_VALUE);
  const [second, setSecond] = useState(0);
  const [stage, setStage] = useState(SETUP);

  function handleSetup(event) {
    let eventId = event.target.id.split("-");
    let temp = { ...setup };
    if (stage === SETUP) {
      switch (eventId[1]) {
        case "decrement":
          temp[eventId[0]]--;
          setSetUp((prev) => {
            return temp[eventId[0]] >= 1 ? temp : { ...prev };
          });
          break;
        case "increment":
          temp[eventId[0]]++;
          setSetUp((prev) => {
            return temp[eventId[0]] <= 60 ? temp : { ...prev };
          });
          break;
        default:
          break;
      }
    }
  }

  function handleStartStop() {
    switch (stage) {
      case COUNTDOWN:
        setStage(PAUSE);
        break;
      case SETUP:
        setCountDown((prev) => {
          return {
            ...prev,
            session: setup.session,
            break: setup.break,
            clock: { min: setup.session, second: 0 },
          };
        });
      case PAUSE:
        setStage(COUNTDOWN);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    let interval = null;
    if (stage === COUNTDOWN) {
      if (countdown.clock.min === 0 && countdown.clock.second === 0) {
        let audio = document.getElementById("beep");
        audio.play();
      }
      interval = setInterval(() => {
        setCountDown((prev) => {
          let temp = { ...prev };
          if (temp.clock.second > 0) {
            temp.clock.second -= 1;
          } else {
            if (temp.clock.min > 0) {
              temp.clock.min -= 1;
              temp.clock.second = 59;
            } else {
              temp.sessionSelect =
                temp.sessionSelect === SESSION ? BREAK : SESSION;
              temp.clock = {
                min: prev[prev.sessionSelect === SESSION ? BREAK : SESSION],
                second: 0,
              };
            }
          }
          return temp;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [stage, countdown]);

  function setupSelect(event) {
    let eventId = event.target.id.split("-");
    if (stage === SETUP && (eventId[0] === BREAK || eventId[0] === SESSION)) {
      if (setup.sessionSelect !== eventId[0]) {
        setSetUp((prev) => {
          return { ...prev, sessionSelect: eventId[0] };
        });
      }
    }
  }

  function resetClock() {
    setSetUp(INIT_SETUP_VALUE);
    setCountDown(INIT_COUNTDOWN_VALUE);
    setStage(SETUP);
    let audio = document.getElementById("beep");
    if (!audio.ended) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function shownDigit(number) {
    return number < 10 ? `0${number}` : number.toString();
  }

  return (
    <div className="App">
      <div className="container" id="setup-container">
        <div
          className="container"
          id="break-container"
          onMouseOver={setupSelect}
        >
          <h3 id="break-label">BREAK LENGTH</h3>
          <div className="container" id="value-container">
            <button
              id="break-decrement"
              onClick={handleSetup}
              disabled={stage != SETUP}
            ></button>
            <p id="break-length">{setup.break}</p>
            <button
              id="break-increment"
              onClick={handleSetup}
              disabled={stage != SETUP}
            ></button>
          </div>
        </div>
        <div
          className="container"
          id="session-container"
          onMouseOver={setupSelect}
        >
          <h3 id="session-label">SESSION LENGTH</h3>
          <div className="container" id="value-container">
            <button
              id="session-decrement"
              onClick={handleSetup}
              disabled={stage != SETUP}
            ></button>
            <p id="session-length">{setup.session}</p>
            <button
              id="session-increment"
              onClick={handleSetup}
              disabled={stage != SETUP}
            ></button>
          </div>
        </div>
      </div>
      <div className="container" id="timer-container">
        <h3 id="timer-header">{stage.toUpperCase()}</h3>
        <h3 id="timer-label">
          {stage === SETUP
            ? setup.sessionSelect.toUpperCase()
            : countdown.sessionSelect.toUpperCase()}
        </h3>
        <div className="container" id="value-container">
          <h4 id="time-left">
            {stage === SETUP
              ? `${shownDigit(setup[setup.sessionSelect])}:00`
              : `${shownDigit(countdown.clock.min)}:${shownDigit(
                  countdown.clock.second
                )}`}
          </h4>
        </div>
        <div className="container" id="button-container">
          <button type="button" id="start_stop" onClick={handleStartStop}>
            {stage === SETUP || stage === PAUSE ? "START" : PAUSE.toUpperCase()}
          </button>
          <button type="reset" id="reset" onClick={resetClock}>
            RESET
          </button>
        </div>

        <audio
          id="beep"
          preload="metadata"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
}

export default App;

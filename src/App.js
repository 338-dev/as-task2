import { useState } from 'react';
import './App.css';

function App() {

  const [inputTimer, setInputTimer] = useState('');
  const [firstTry, setFirstTry] = useState(true)
  const [timerKeeper, setTimerKeeper] = useState([]);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [lastBoxPlacedTime, setLastBoxPlacedTime] = useState(null);
  const [selectedInd, setselectedInd] = useState([])
  const [keepTimeOut, setkeepTimeOut] = useState(null);
  const [pauseTimer, setPauseTimer] = useState([])

  const Grid =
    [...Array.from({ length: 5 },
      () => Array.from({ length: 5 },
        () => ''))];


  const handleSetInd = () => {
    let firstInd = Math.floor(Math.random() * 10) % 5;
    let secondInd = Math.floor(Math.random() * 10) % 5;

    setselectedInd([firstInd, secondInd])

    return [firstInd, secondInd];

  }

  const handleStart = () => {
    if (isGamePaused) {
      setIsGamePaused(false);
      setPauseTimer([pauseTimer, Date.now()]);
      return
    }

    handleSetInd();
    let tempLastTime = Date.now();
    setLastBoxPlacedTime(tempLastTime);
    if (firstTry && inputTimer) {
      let timeout = setTimeout(() => {
        handleSetInd();
        setTimerKeeper([...timerKeeper, (Date.now() - tempLastTime) / 1000]);
        setLastBoxPlacedTime(Date.now());
        setFirstTry(false);
      }, inputTimer * 1000);

      setkeepTimeOut(timeout)
    }

  }


  const handlePause = () => {
    if (selectedInd.length !== 0) {
      setIsGamePaused(true);
      clearTimeout(keepTimeOut);
      setkeepTimeOut(null);
      setPauseTimer([Date.now()]);
    }
  }

  const handleReset = () => {

    setInputTimer('');
    setFirstTry(true);
    setselectedInd([]);
    setLastBoxPlacedTime(null);
    setTimerKeeper([]);
    setIsGamePaused(false);
    clearTimeout(keepTimeOut);
    setkeepTimeOut(null);
    setPauseTimer([]);
  }

  const handleRedBoxClick = (row, col) => {
    clearTimeout(keepTimeOut);
    if (selectedInd[0] === row && selectedInd[1] === col & !isGamePaused) {
      handleSetInd();
      if (pauseTimer.length > 0) {

        setTimerKeeper([...timerKeeper, ((Date.now() - lastBoxPlacedTime) - (pauseTimer[1] - pauseTimer[0])) / 1000]);
        setPauseTimer([])
      }
      else
        setTimerKeeper([...timerKeeper, (Date.now() - lastBoxPlacedTime) / 1000]);

      setLastBoxPlacedTime(Date.now());
    }
  }

  const handleTimer = (e) => {
    if (!isGamePaused && selectedInd.length === 0)
      setInputTimer(e.target.value);
  }

  return (
    <div className="App">
      <div className='buttonContainer'>

        <button className='buttons' onClick={handleStart}>
          Start
        </button>
        <button className='buttons' onClick={handlePause}>
          Pause
        </button>
        <button className='buttons' onClick={handleReset}>
          Reset
        </button>

        <div>
          Input Timer:
          <div>
          <input type='number' value={inputTimer} onChange={handleTimer} className='inputTimer' />
          </div>
        </div>
      </div>

      <div className='gridCont'>
        {
          Grid.map((row, indRow) => (
            <div className='gridRow' key={indRow}>
              {
                row.map((col, indCol) => (
                  <div className={(selectedInd[0] === indRow && selectedInd[1] === indCol) ? 'highLightedArea gridCol' : 'gridCol'} key={indCol} onClick={() => handleRedBoxClick(indRow, indCol)}>

                  </div>
                ))
              }
            </div>
          ))
        }
      </div>

      <div className='timerCont'>
        <div className='timeHeading'>
          <div className='leftHead'>Mouse Click Number</div>
          <div className='rightHead'>Reaction Time</div>
        </div>
        <div className='timerTable'>

          {
            timerKeeper.map((time, ind) => (
              <div className='timerRow'>
                <div className='leftHead'>{ind + 1}</div>
                <div className='rightHead'>{time} s</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;

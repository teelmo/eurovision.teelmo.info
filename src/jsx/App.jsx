import React, { useRef, useState, useEffect } from 'react';
import '../styles/styles.less';

function App() {
  // Data states.
  const [data, setData] = useState(false);
  const [currentData, setCurrentData] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  const contentRef = useRef();
  const newRef = useRef();
  const navRef = useRef();
  const simulationButtonRef = useRef();

  useEffect(() => {
    // const data_file = 'https://eurovisiondrinking.com/2025/drinking.json';
    const data_file = './assets/data/drinking.json';
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setData(JSON.parse(body).reverse()));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setCurrentData(data[currentId]);
  }, [data, currentId]);

  const changeScreen = (value) => {
    contentRef.current.style.opacity = 0;
    setTimeout(() => {
      setCurrentId(currentId + value);
      contentRef.current.style.opacity = 1;
      newRef.current.style.opacity = 1;
    }, 500);
    setTimeout(() => {
      newRef.current.style.opacity = 0;
    }, 5000);
  };

  const startSimulation = () => {
    simulationButtonRef.current.textContent = 'Simulating';
    simulationButtonRef.current.disabled = true;
    setInterval(() => {
      contentRef.current.style.opacity = 0;
      setTimeout(() => {
        setCurrentId(currentId + 1);
        contentRef.current.style.opacity = 1;
        newRef.current.style.opacity = 1;
      }, 500);
      setTimeout(() => {
        newRef.current.style.opacity = 0;
      }, 5000);
    }, 10000);
  };

  return (
    <div className="app">
      {
        currentData && (
          <div className="screen">
            <div className="simulation_container">
              <div className="button_container">
                <button className="simulation" type="button" onClick={() => startSimulation()} ref={simulationButtonRef}>
                  Start simulation
                </button>
              </div>
            </div>
            <div className="content" ref={contentRef}>
              <div className="event_occurred">
                <span className="new" ref={newRef}>New!</span>
                {' '}
                {new Date(currentData.occurred).toISOString().substring(11, 19)}

              </div>
              <div className="event_info">
                <div className="event_name">
                  <h3>
                    {currentData.name}
                  </h3>
                </div>
                <div className="event_description"><h4>{currentData.description}</h4></div>
                <div className="event_penalty">
                  <span className="label">Drink</span>
                  {' '}
                  <h3>{currentData.penalty}</h3>
                </div>
              </div>
              {
                currentData.performance && (
                  <div className="event_performance">
                    <span className="artist">{currentData.performance.artist}</span>
                    {' '}
                    –
                    {' '}
                    <span className="song">{currentData.performance.song}</span>
                    {' '}
                    (
                    <span className="country">{currentData.performance.country}</span>
                    )
                  </div>
                )
              }
            </div>
            <div className="navigation_container" ref={navRef}>
              {
                currentId > 0 && (
                  <div className="button_container">
                    <button className="previous" type="button" onClick={() => changeScreen(-1)}>
                      <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                  </div>
                )
              }
              <div className="button_container">
                <button className="next" type="button" onClick={() => changeScreen(1)}>
                  Next
                  <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )
      }
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;

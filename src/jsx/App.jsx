import { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/styles.css';

const POLL_INTERVAL = 10_000;

const App = () => {
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const lastIdRef = useRef(null);
  const contentRef = useRef();
  const newRef = useRef();
  const navRef = useRef();

  const currentData = data[currentId] ?? null;

  const flashNew = useCallback(() => {
    if (!newRef.current) return;
    newRef.current.style.opacity = 1;
    setTimeout(() => {
      if (newRef.current) newRef.current.style.opacity = 0;
    }, 5000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/2026/drinking.json');
        if (!res.ok) throw new Error(res.statusText);
        const fresh = await res.json();

        if (fresh[0]?.id !== lastIdRef.current) {
          lastIdRef.current = fresh[0]?.id ?? null;
          setData(fresh);
          setCurrentId(0);
          flashNew();
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [flashNew]);

  const changeScreen = value => {
    const next = currentId + value;
    if (next < 0 || next >= data.length) return;
    if (!contentRef.current) return;
    contentRef.current.style.opacity = 0;
    setTimeout(() => {
      setCurrentId(next);
      contentRef.current.style.opacity = 1;
      flashNew();
    }, 500);
  };

  return (
    <div className="app">
      {currentData && (
        <div className="screen">
          <div className="content" ref={contentRef}>
            <div className="event_occurred">
              <span className="new" ref={newRef}>
                New!
              </span>{' '}
              {new Date(currentData.occurred).toISOString().substring(11, 19)}
            </div>
            <div className="event_info">
              <div className="event_name">
                <h3>{currentData.name}</h3>
              </div>
              <div className="event_description">
                <h4>{currentData.description}</h4>
              </div>
              <div className="event_penalty">
                <span className="label">Drink</span> <h3>{currentData.penalty}</h3>
              </div>
            </div>
            {currentData.performance && (
              <div className="event_performance">
                <span className="artist">{currentData.performance.artist}</span> – <span className="song">{currentData.performance.song}</span> (<span className="country">{currentData.performance.country}</span>)
              </div>
            )}
          </div>
          <div className="navigation_container" ref={navRef}>
            {currentId > 0 && (
              <div className="button_container">
                <button className="previous" type="button" onClick={() => changeScreen(-1)}>
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Previous</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              </div>
            )}
            {currentId < data.length - 1 && (
              <div className="button_container">
                <button className="next" type="button" onClick={() => changeScreen(1)}>
                  Next
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Next</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

import { useEffect, useState } from 'react';
import type { ABTestData } from './types/data';
import './App.css';

function App() {
  const [data, setData] = useState<ABTestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  if (!data) {
    return <div className="app">Failed to load data</div>;
  }

  return (
    <div className="app">
      <h1>A/B Test Results</h1>
      <p>Chart coming soon...</p>
    </div>
  );
}

export default App;

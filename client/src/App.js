import React from 'react';
import MatchHistory from './components/MatchHistory';

const App = () => {
  const puuid = 'lu7s0VhKiokkYvXAo5O0KiLWg5PhGYmop3NNdTvVXsgCGgIQEzo_E0XWr7Jq6seWUB5OunBBgpLazg'; // Replace with actual value

  return (
    <div>
      <MatchHistory puuid={puuid} />
    </div>
  );
};

export default App;

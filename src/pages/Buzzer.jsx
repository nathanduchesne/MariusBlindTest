import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import '../styles/Buzzer.css';

const Buzzer = () => {
  const [teamName, setTeamName] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const { registerTeam, currentTeam, buzz, buzzerEnabled } = useSocket();

  const handleRegister = (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      registerTeam(teamName.trim());
      setIsRegistering(false);
    }
  };

  const handleBuzz = () => {
    buzz();
  };

  if (isRegistering) {
    return (
      <div className="buzzer-container">
        <div className="registration-form">
          <h1>DJ Blind Test</h1>
          <h2>Enter Your Team Name</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              required
            />
            <button type="submit">Join Game</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="buzzer-container">
      <div className="team-info">
        <h2>{currentTeam?.name}</h2>
        <p>Score: {currentTeam?.score}</p>
      </div>

      <button
        className={`buzzer-button ${!buzzerEnabled ? 'disabled' : ''} ${currentTeam?.buzzed ? 'buzzed' : ''}`}
        onClick={handleBuzz}
        disabled={!buzzerEnabled || currentTeam?.buzzed}
      >
        {currentTeam?.buzzed ? 'BUZZED!' : 'BUZZ'}
      </button>

      <div className="status-message">
        {!buzzerEnabled && <p>Waiting for DJ to enable buzzers...</p>}
        {currentTeam?.buzzed && <p>You've buzzed in! Wait for the DJ.</p>}
      </div>
    </div>
  );
};

export default Buzzer;

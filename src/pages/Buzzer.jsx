import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import '../styles/Buzzer.css';

const Buzzer = () => {
  const [teamName, setTeamName] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [localBuzzed, setLocalBuzzed] = useState(false);
  const { registerTeam, currentTeam, buzz, buzzerEnabled, socket } = useSocket();

  const handleRegister = (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      registerTeam(teamName.trim());
      setIsRegistering(false);
    }
  };

  const handleBuzz = () => {
    setLocalBuzzed(true);
    buzz();
  };
  
  // Reset localBuzzed when buzzers are reset or state changes
  useEffect(() => {
    if (!socket) return;
    
    const handleBuzzersReset = () => {
      console.log('Buzzers reset event received');
      setLocalBuzzed(false);
    };
    
    const handleBuzzerStateChanged = (enabled) => {
      console.log('Buzzer state changed event received:', enabled);
      if (enabled) {
        setLocalBuzzed(false);
      }
    };
    
    socket.on('buzzersReset', handleBuzzersReset);
    socket.on('buzzerStateChanged', handleBuzzerStateChanged);
    
    return () => {
      socket.off('buzzersReset', handleBuzzersReset);
      socket.off('buzzerStateChanged', handleBuzzerStateChanged);
    };
  }, [socket]);

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
      </div>

      <button
        className={`buzzer-button ${!buzzerEnabled || localBuzzed || currentTeam?.buzzed ? 'disabled' : ''} ${currentTeam?.buzzed || localBuzzed ? 'buzzed' : ''}`}
        onClick={handleBuzz}
        disabled={!buzzerEnabled || localBuzzed || currentTeam?.buzzed}
      >
        {currentTeam?.buzzed || localBuzzed ? 'BUZZED!' : 'BUZZ'}
      </button>

      <div className="status-message">
        {!buzzerEnabled && <p>Waiting for DJ to enable buzzers...</p>}
        {(currentTeam?.buzzed || localBuzzed) && <p>You've buzzed in! Wait for the DJ.</p>}
      </div>
    </div>
  );
};

export default Buzzer;

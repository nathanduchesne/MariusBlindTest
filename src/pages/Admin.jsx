import { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import '../styles/Admin.css';

const Admin = () => {
  const { 
    teams, 
    buzzerOrder, 
    resetBuzzers, 
    updateScore,
    removeFromBuzzerOrder
  } = useSocket();

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Simple authentication (in a real app, use proper authentication)
  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (password === 'ifYouFindThisGetALife') { // Simple password for demo
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-auth-form">
          <h1>DJ Admin Console</h1>
          <form onSubmit={handleAuthenticate}>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter DJ Password"
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="auth-button">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const handleResetBuzzers = () => {
    resetBuzzers();
  };

  const handleScoreChange = (teamId, change) => {
    updateScore(teamId, change);
  };

  const handleRemoveFromOrder = (teamId) => {
    removeFromBuzzerOrder(teamId);
  };

  // Sort teams by score in descending order
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>DJ Admin Console</h1>
        <div className="admin-controls">
          <button 
            className="reset-button"
            onClick={handleResetBuzzers}
          >
            Reset Buzzers
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="teams-section">
          <h2>Teams</h2>
          <div className="teams-list">
            {sortedTeams.length === 0 ? (
              <p className="no-teams">No teams have joined yet.</p>
            ) : (
              sortedTeams.map((team) => (
                <div key={team.id} className="team-item">
                  <div className="team-name">
                    {team.name}
                    {team.buzzed && <span className="buzzed-indicator">BUZZED</span>}
                  </div>
                  <div className="team-score">{team.score}</div>
                  <div className="score-controls">
                    <button onClick={() => handleScoreChange(team.id, -1)}>-</button>
                    <button onClick={() => handleScoreChange(team.id, 1)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="buzzer-order-section">
          <h2>Buzzer Order</h2>
          <div className="buzzer-order-list">
            {buzzerOrder.length === 0 ? (
              <p className="no-buzzes">No teams have buzzed yet.</p>
            ) : (
              buzzerOrder.map((entry, index) => (
                <div key={index} className="buzzer-entry">
                  <div className="buzzer-rank">{index + 1}</div>
                  <div className="buzzer-team-name">{entry.teamName}</div>
                  <div className="buzzer-time">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      fractionalSecondDigits: 3
                    })}
                  </div>
                  <button 
                    className="remove-from-order"
                    onClick={() => handleRemoveFromOrder(entry.teamId)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

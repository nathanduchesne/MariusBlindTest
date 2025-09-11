import { useSocket } from '../contexts/SocketContext';
import '../styles/Display.css';

const Display = () => {
  const { teams, buzzerOrder, buzzerEnabled } = useSocket();

  // Sort teams by score in descending order
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  
  // Get top 3 teams (for podium display)
  const topTeams = sortedTeams.slice(0, 3);
  // Get remaining teams
  const remainingTeams = sortedTeams.slice(3);

  return (
    <div className="display-container">
      <div className="display-header">
        <h1>DJ Blind Test</h1>
        <div className={`buzzer-status ${buzzerEnabled ? 'enabled' : 'disabled'}`}>
          Buzzers: {buzzerEnabled ? 'ENABLED' : 'DISABLED'}
        </div>
      </div>

      <div className="display-content">
        <div className="scores-section">
          <h2>Leaderboard</h2>
          
          {topTeams.length > 0 && (
            <div className="podium">
              {topTeams.map((team, index) => (
                <div 
                  key={team.id} 
                  className={`podium-position position-${index + 1}`}
                >
                  <div className="position-number">{index + 1}</div>
                  <div className="podium-team-name">{team.name}</div>
                  <div className="podium-team-score">{team.score}</div>
                </div>
              ))}
            </div>
          )}

          <div className="teams-list">
            {remainingTeams.map((team, index) => (
              <div key={team.id} className="team-item">
                <div className="team-rank">{index + 4}</div>
                <div className="team-name">
                  {team.name}
                  {team.buzzed && <span className="buzzed-indicator">BUZZED</span>}
                </div>
                <div className="team-score">{team.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="buzzer-order-section">
          <h2>Buzzer Order</h2>
          <div className="buzzer-order-list">
            {buzzerOrder.length === 0 ? (
              <p className="no-buzzes">Waiting for teams to buzz in...</p>
            ) : (
              buzzerOrder.map((entry, index) => {
                // Calculate time difference if not the first entry
                const firstBuzzTime = buzzerOrder[0].timestamp;
                const timeDiff = index === 0 
                  ? null 
                  : ((entry.timestamp - firstBuzzTime) / 1000).toFixed(3);
                
                return (
                  <div key={index} className="buzzer-entry">
                    <div className="buzzer-rank">{index + 1}</div>
                    <div className="buzzer-team-name">{entry.teamName}</div>
                    <div className="buzzer-time">
                      {index === 0 ? (
                        // First team shows actual time
                        new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          fractionalSecondDigits: 3
                        })
                      ) : (
                        // Other teams show time difference
                        `+${timeDiff}s`
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;

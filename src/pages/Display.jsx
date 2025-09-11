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
  
  // Calculate positions and heights for podium
  const calculatePodiumData = () => {
    if (topTeams.length === 0) return [];
    
    // Get the highest score (first team's score)
    const highestScore = topTeams[0].score;
    
    // Create an array to track which teams are tied
    const tiedPositions = {};
    let currentPosition = 1;
    
    return topTeams.map((team, index) => {
      // Calculate height percentage based on score compared to highest score
      // Minimum height is 40% even if score is 0
      const heightPercentage = highestScore > 0 
        ? 40 + (team.score / highestScore * 60)
        : 100;
      
      // Determine position (for ties)
      if (index > 0 && team.score === topTeams[index - 1].score) {
        // This team is tied with the previous team
        currentPosition = currentPosition; // Keep the same position
      } else if (index > 0) {
        // Not tied, increment position
        currentPosition = index + 1;
      }
      
      // Track teams with the same position (ties)
      if (!tiedPositions[currentPosition]) {
        tiedPositions[currentPosition] = [];
      }
      tiedPositions[currentPosition].push(team.id);
      
      return {
        ...team,
        heightPercentage,
        position: currentPosition,
        // Teams tied for first get gold, teams tied for second get silver, etc.
        colorClass: currentPosition === 1 ? 'gold' : currentPosition === 2 ? 'silver' : 'bronze'
      };
    });
  };
  
  const podiumData = calculatePodiumData();

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
          
          {podiumData.length > 0 && (
            <div className="podium">
              {podiumData.map((team, index) => (
                <div 
                  key={team.id} 
                  className={`podium-position position-${team.position} ${team.colorClass}`}
                  style={{ 
                    height: `${team.heightPercentage}%`,
                    order: team.position === 1 ? 2 : team.position === 2 ? 1 : 3
                  }}
                >
                  <div className="position-number">{team.position}</div>
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

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [teams, setTeams] = useState([]);
  const [buzzerEnabled, setBuzzerEnabled] = useState(false);
  const [buzzerOrder, setBuzzerOrder] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    // In production, use relative URL which will connect to the same domain
    const serverURL = import.meta.env.PROD ? '' : 'http://localhost:3001';
    const socketInstance = io(serverURL);
    setSocket(socketInstance);

    // Socket event listeners
    socketInstance.on('gameState', ({ teams, buzzerEnabled, buzzerOrder }) => {
      setTeams(teams);
      setBuzzerEnabled(buzzerEnabled);
      setBuzzerOrder(buzzerOrder);
    });

    socketInstance.on('teamsUpdated', (updatedTeams) => {
      setTeams(updatedTeams);
      // Update current team if it exists in the updated teams
      if (currentTeam) {
        const updated = updatedTeams.find(team => team.id === currentTeam.id);
        if (updated) {
          setCurrentTeam(updated);
        }
      }
    });

    socketInstance.on('teamRegistered', (team) => {
      setCurrentTeam(team);
    });

    socketInstance.on('buzzerStateChanged', (enabled) => {
      setBuzzerEnabled(enabled);
    });

    socketInstance.on('buzzerOrderUpdated', (order) => {
      setBuzzerOrder(order);
    });

    socketInstance.on('buzzersReset', () => {
      setBuzzerOrder([]);
      if (currentTeam) {
        setCurrentTeam(prev => ({ ...prev, buzzed: false }));
      }
      setBuzzerEnabled(true);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Register a team
  const registerTeam = (teamName) => {
    if (socket && teamName) {
      socket.emit('registerTeam', teamName);
    }
  };

  // Buzz function for teams
  const buzz = () => {
    if (socket && currentTeam && buzzerEnabled && !currentTeam.buzzed) {
      socket.emit('buzz', currentTeam.id);
    }
  };

  const resetBuzzers = () => {
    if (socket) {
      socket.emit('resetBuzzers');
    }
  };

  const updateScore = (teamId, change) => {
    if (socket) {
      socket.emit('updateScore', { teamId, change });
    }
  };

  const removeFromBuzzerOrder = (teamId) => {
    if (socket) {
      socket.emit('removeFromBuzzerOrder', teamId);
    }
  };

  const value = {
    socket,
    teams,
    buzzerEnabled,
    buzzerOrder,
    currentTeam,
    registerTeam,
    buzz,
    resetBuzzers,
    updateScore,
    removeFromBuzzerOrder
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

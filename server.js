import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Game state
let teams = [];
let buzzerEnabled = true; // Always enabled by default
let buzzerOrder = [];

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send current game state to new connections
  socket.emit('gameState', { teams, buzzerEnabled, buzzerOrder });
  
  // Register team
  socket.on('registerTeam', (teamName) => {
    const existingTeam = teams.find(team => team.name === teamName);
    
    if (existingTeam) {
      // If team already exists, just update the socket ID
      existingTeam.socketId = socket.id;
      socket.emit('teamRegistered', existingTeam);
    } else {
      // Create new team
      const newTeam = {
        id: socket.id,
        socketId: socket.id,
        name: teamName,
        score: 0,
        buzzed: false
      };
      teams.push(newTeam);
      socket.emit('teamRegistered', newTeam);
    }
    
    // Broadcast updated teams list
    io.emit('teamsUpdated', teams);
  });
  
  // Team buzzes
  socket.on('buzz', (teamId) => {
    if (!buzzerEnabled) return;
    
    const team = teams.find(team => team.id === teamId);
    if (!team || team.buzzed) return;
    
    team.buzzed = true;
    const buzzTime = Date.now();
    
    buzzerOrder.push({
      teamId,
      teamName: team.name,
      timestamp: buzzTime
    });
    
    // Broadcast updated buzzer order and teams
    io.emit('buzzerOrderUpdated', buzzerOrder);
    io.emit('teamsUpdated', teams);
  });
  
  
  // Admin resets buzzers
  socket.on('resetBuzzers', () => {
    buzzerOrder = [];
    teams.forEach(team => {
      team.buzzed = false;
    });
    
    // Enable buzzers when resetting
    buzzerEnabled = true;
    
    // Send events in the correct order
    io.emit('teamsUpdated', teams);
    io.emit('buzzerStateChanged', buzzerEnabled);
    io.emit('buzzerOrderUpdated', buzzerOrder);
    io.emit('buzzersReset');
  });
  
  // Admin updates score
  socket.on('updateScore', ({ teamId, change }) => {
    const team = teams.find(team => team.id === teamId);
    if (!team) return;
    
    team.score += change;
    if (team.score < 0) team.score = 0;
    
    io.emit('teamsUpdated', teams);
  });
  
  // Admin removes team from buzzer order
  socket.on('removeFromBuzzerOrder', (teamId) => {
    buzzerOrder = buzzerOrder.filter(entry => entry.teamId !== teamId);
    io.emit('buzzerOrderUpdated', buzzerOrder);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

# DJ Blind Test Game

A real-time web application for DJs to host blind test games with multiple teams. The app features a buzzer system, score tracking, and a display view for showing game progress on a big screen.

## Features

- **Real-time interactions** using WebSockets
- **Three different views**:
  - `/buzzer` - For players to register teams and buzz in
  - `/admin` - For the DJ to control the game, manage scores, and see buzzer order
  - `/display` - For displaying on a big screen to show scores and buzzer order
- **Responsive design** that works on both mobile and desktop
- **Team registration** system
- **Buzzer functionality** with timestamps to determine order
- **Score management** for keeping track of team points

## Tech Stack

- React 19
- React Router v7
- Socket.io for real-time communication
- Express.js for the server
- Vite for frontend build

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd MariageMarius
```

2. Install dependencies:
```
npm install
```

3. Install concurrently (if not already installed):
```
npm install concurrently --save-dev
```

## Running the App Locally

To run both the server and client concurrently:

```
npm start
```

This will start:
- The WebSocket server on port 3001
- The Vite development server (typically on port 5173)

## Usage

1. **DJ Setup**:
   - Open `/admin` in a browser
   - Login with the default password: `dj1234`
   - Enable buzzers when ready to start a round

2. **Display Setup**:
   - Open `/display` in a browser and share this screen or project it
   - This will show the leaderboard and buzzer order

3. **Player Setup**:
   - Players visit the app (default route redirects to `/buzzer`)
   - Enter team name to register
   - Use the buzzer button when it's enabled

4. **Game Flow**:
   - DJ plays music and enables buzzers
   - Teams buzz in when they recognize the song
   - DJ checks the buzzer order on the admin panel
   - DJ awards points using the +/- buttons next to team names
   - DJ resets buzzers for the next round

## Deployment

To deploy the application:

1. Build the frontend:
```
npm run build
```

2. The server is configured to serve the static files in production mode.

3. Deploy to your hosting provider of choice (Heroku, Vercel, etc.)

4. Set the environment variable `PORT` if needed (defaults to 3001)

## Future Enhancements

- Enhanced authentication for the admin panel
- Customizable game settings
- Sound effects for buzzer actions
- Multiple game modes
- Team avatars or colors
- History of past games

## License

MIT
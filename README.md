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

To run both the server and client concurrently in development mode:

```
./start.sh
```

or

```
npm run dev:start
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

You can deploy this application to various cloud platforms. Here are instructions for two popular options:

### Option 1: Render.com (Recommended)

1. Create an account on [Render](https://render.com/) if you don't have one

2. Click "New +" and select "Web Service"

3. Connect your GitHub repository or use the "Public Git repository" option with your repo URL

4. Fill in the following details:
   - **Name**: mariage-marius (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Select the free plan and click "Create Web Service"

6. Your app will be deployed and available at a URL like `https://your-app-name.onrender.com`

7. Share this URL with your friends to let them connect to your game

### Option 2: Railway.app

1. Create an account on [Railway](https://railway.app/) if you don't have one

2. Create a new project and select "Deploy from GitHub repo"

3. Connect your GitHub repository

4. Add the following environment variables if needed:
   - `PORT`: 3001 (or your preferred port)
   - `NODE_ENV`: production

5. Your app will be deployed and available at a Railway-provided URL

### Option 3: Heroku

1. Create an account on [Heroku](https://heroku.com/) if you don't have one

2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

3. Login to Heroku and create a new app:
```
heroku login
heroku create mariage-marius
```

4. Push your code to Heroku:
```
git push heroku main
```

5. Your app will be available at `https://mariage-marius.herokuapp.com`

### Using Your Own Domain

If you have your own domain name, you can configure it with any of these services to use a custom URL instead of their provided subdomains.

### Important Notes

- The app uses WebSockets, so make sure your hosting provider supports them
- Some free tiers may have limitations on connection time or may sleep after inactivity
- For persistent, 24/7 availability, consider a paid tier on any of these platforms

## Future Enhancements

- Enhanced authentication for the admin panel
- Customizable game settings
- Sound effects for buzzer actions
- Multiple game modes
- Team avatars or colors
- History of past games

## License

MIT
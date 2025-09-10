import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import './App.css';

// Import pages (we'll create these next)
import Buzzer from './pages/Buzzer';
import Admin from './pages/Admin';
import Display from './pages/Display';

function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/buzzer" replace />} />
          <Route path="/buzzer" element={<Buzzer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/display" element={<Display />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;
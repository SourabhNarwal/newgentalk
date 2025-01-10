import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatRoom from './pages/Chatroom';
import LoadingSpin from './components/LoadingSpin';
import { useEffect, useState } from 'react';
import Otpverify from './pages/Otpverify';
import Home from './pages/Home';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000); // 2000 milliseconds = 2 seconds 
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) { return <LoadingSpin />; }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/newgentalk" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verification" element={<Otpverify />} />
        <Route path="/chatroom" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;


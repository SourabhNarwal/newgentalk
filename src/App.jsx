import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatRoom from './pages/Chatroom';
import LoadingSpin from './components/LoadingSpin';
import { useEffect, useState } from 'react';
import Otpverify from './pages/Otpverify';
import Home from './pages/Home';
import NewPassword from './pages/forgetpassword/NewPassword';

const server="https://fabc-112-196-126-3.ngrok-free.app";

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
        <Route path="/newgentalk/" element={<Home server={server}/>} />
        <Route path="/newgentalk/login" element={<Login server={server} />} />
        <Route path="/newgentalk/signup" element={<Signup server={server} />} />
        <Route path='/newgentalk/forgot-pass' element={<NewPassword  server={server} />} />
        <Route path="/newgentalk/verification" element={<Otpverify server={server} />} />
        <Route path="/newgentalk/chatroom" element={<ChatRoom server={server} />} />
      </Routes>
    </Router>
  );
}

export default App;


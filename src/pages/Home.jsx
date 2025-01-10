import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const handlebtn = () => {
        navigate('/login');
    }
  return (
    <div>
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
        <button onClick={handlebtn}>go to login</button>
    </div>
  )
}

export default Home
import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Register from './components/Register';
import RegisterPage from './components/RegisterPage';
import UserProfile from './components/UserProfile';
import Search from './components/Search';
import Users from './components/Users';
import Feed from './components/Feed';


const App = () => (
  <Router>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/Search" element={<Search />}/>
        <Route path="/users/:userId" element={<Users />} /> 
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </UserProvider>
  </Router>
);

export default App;

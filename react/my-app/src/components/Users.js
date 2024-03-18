import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css'; // Подключаем файл со стилями

const Users = () => {
  const [userData, setUserData] = useState(null);
  const { userId } = useParams(); // Получаем параметр userId из URL
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div className="loading">Loading...</div>; 
  }

  return (
    <div>
      <header className={showNav ? 'menu-open' : ''}>
        <div>
            <h1> {userData.name}'s Profile </h1>
            </div>
            <button className="menu-btn" onClick={toggleNav}>
            Menu
            </button>
            <nav className={`main-nav ${showNav ? 'show-nav' : ''}`}>
            <ul>
                <li>
                <Link to="/" className="nav-link">Home</Link>
                </li>
                <li>
                <Link to="/about" className="nav-link">About</Link>
                </li>
                <li>
                <Link to="/services" className="nav-link">Services</Link>
                </li>
                <li>
                <Link to="/profile" className="nav-link">Go to Profile</Link>
                </li>

            </ul>
            </nav>
        </header>
      <main className="user-profile-main">
        <div className="profile-info-card">
          <p className="profile-info-label">Name:</p>
          <p className="profile-info">{userData.name}</p>
        </div>
        <div className="profile-info-card">
          <p className="profile-info-label">Email:</p>
          <p className="profile-info">{userData.email}</p>
        </div>
        <div className="profile-info-card">
          <h2>Social Links</h2>
          <ul>
            {userData.socialLinks && userData.socialLinks.length > 0 ? (
              userData.socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </li>
              ))
            ) : (
              <li>No social links found</li>
            )}
          </ul>
        </div>
      </main>
      <footer>
          <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
        </footer>
    </div>
  );
};

export default Users;

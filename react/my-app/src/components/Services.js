import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Services = () => {
  const [userFromLocalStorage, setUserFromLocalStorage] = useState(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    setUserFromLocalStorage(userFromLocalStorage);
  }, []);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <>
      <div>
        <header className={showNav ? 'menu-open' : ''}>
          <div>
            <h1>
              Our Services
            </h1>
          </div>
          <button className="menu-btn" onClick={toggleNav}>Menu</button>
          <nav className={`main-nav ${showNav ? 'show-nav' : ''}`}>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/about" className="nav-link">About</Link></li>
              <li><Link to="/services" className="nav-link">Services</Link></li>
              <li>
                {userFromLocalStorage ? (
                  <Link to="/profile" className="nav-link">Go to Profile</Link>
                ) : (
                  <Link to="/register" className="nav-link">Register/Login</Link>
                )}
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <div className="row">
            <div className="col-md-12">
              <h2>Our Services</h2>
              <p>Insert your services description here</p>
            </div>
          </div>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
        </footer>
      </div>
    </>
  );
};

export default Services;

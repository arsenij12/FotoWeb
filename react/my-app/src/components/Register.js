import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:8001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      
      window.location.href = '/RegisterPage';
    } catch (error) {
      console.error('Error while registering:', error.message);
    }
  };

  return (
    <div>
      <header className={showNav ? 'menu-open' : ''}>
        <div>
          <h1>Welcome to SnapPortfolio</h1>
        </div>
        <button className="menu-btn" onClick={toggleNav}>Menu</button>
        <nav className={`main-nav ${showNav ? 'show-nav' : ''}`}>
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/services" className="nav-link">Services</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">Register</div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input id="name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus className="form-control" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">E-Mail Address</label>
                      <input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divlog">
          <Link to="/RegisterPage">Have an account? Login here</Link>
        </div>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default Register;

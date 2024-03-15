import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UserProfile from './UserProfile';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const navigate = useNavigate(); 
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/', 
  });

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/api/login', {
        email,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user); 
        navigate('/profile');
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Сохраняем данные пользователя в localStorage
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Error while logging in');
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
          {user ? (
            <UserProfile user={user} /> // Рендеринг UserProfile при успешной аутентификации
          ) : (
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">Login</div>

                  <div className="card-body">
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                      <div className="form-group">
                        <label htmlFor="email">E-Mail Address</label>
                        <input id="email" type="email" name="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                      </div>

                      <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="divlog">
          <Link to="/register">Don't have an account? Register here</Link>
        </div>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default LoginPage;

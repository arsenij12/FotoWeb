import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userFromLocalStorage, setUserFromLocalStorage] = useState(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    setUserFromLocalStorage(userFromLocalStorage);
  }, []);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/api/search-users?username=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  return (
    <div>
      <header className={showNav ? 'menu-open' : ''}>
        <div>
          <h1>Search Peoples</h1>
        </div>
        <button className="menu-btn" onClick={toggleNav}>Menu</button>
        <nav className={`main-nav ${showNav ? 'show-nav' : ''}`}>
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/services" className="nav-link">Services</Link></li>
            <li><Link to="/feed" className="nav-link">Feed's</Link></li>
            <li><Link to="/profile" className="nav-link">Go to Profile</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>User Search</h1>
        <input 
          type="text" 
          placeholder="Enter username" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>

        <div>
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((user, index) => (
              <li key={index}>
                <Link to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default Search;

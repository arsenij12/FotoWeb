import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserProfile.css';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-all-posts');
      setPosts(response.data); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="user-profile-container">
      <header className={showNav ? 'menu-open' : ''}>
        <div>
          <h1>My Profile</h1>
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
              <Link to="/search" className="nav-link">Search</Link>
            </li>
            <li><Link to="/profile" className="nav-link">Go to Profile</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h2>Feed of posts</h2>
        {posts.map((post, index) => (
          <div key={index} className='profile-info-card-usersname'> 
            <div className='post-imgs-div'>
                <img src={`http://127.0.0.1:8000/get_images/${post.image_name}_${post.user_id}`} alt={`Image ${index}`} className='users-post'/>
            </div>
            <ul>
                <li>
                    <h1>{post.username}'s Post</h1>
                </li>
                <li>
                <p>{post.content}</p>
                </li>
            </ul>
          </div>
        ))}
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default Feed;

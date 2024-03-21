import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const Users = () => {
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();
  const [showNav, setShowNav] = useState(false);
  const [scrollingImages, setScrollingImages] = useState([]);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/api/get-social-links/${userId}`);
      setUserData(prevUserData => ({
        ...prevUserData,
        socialLinks: response.data.socialLinks
      }));
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/api/users/${userId}`);
        setUserData(response.data);
        fetchSocialLinks(); // Добавленный вызов fetchSocialLinks
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchScrollingImages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get-image-scrolling/${userId}`);
        setScrollingImages(response.data);
      } catch (error) {
        console.error('Error fetching scrolling images:', error);
      }
    };

    fetchUserData();
    fetchScrollingImages();
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
                <li><Link to="/feed" className="nav-link">Feed's</Link></li>
                <li>
                <Link to="/profile" className="nav-link">Go to Profile</Link>
                </li>

            </ul>
            </nav>
        </header>
        <main className="user-profile-main">
        <div className="profile-info-card-usersname">
            <div className="user-profile-image">
            <img
                src={userData && userData.name ? `http://127.0.0.1:8000/profile-image/${userData.name}_${userData.id}` : 'http://localhost:3000//icon.png'}
                className="image-preview"
                />
            </div>
            <div className="user-profile-info">
            <p className="profile-info-label">Name:</p>
            <p className="profile-info">{userData.name}</p>
            </div>
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
        <div className="profile-info-card">
          <h2>Scrolling Images</h2>
            {scrollingImages.map((image, index) => (
              <div key={index} className='profile-info-card-usersname'> 
                <img src={`http://127.0.0.1:8000/get_images/${image.image_name}_${userId}`} alt={`Image ${index}`} className="users-post" />
                <ul>
                    <li>
                        <h1>{userData.name}'s Post</h1>
                    </li>
                    <li>
                        <p className="scrolling-image-text">{image.post_text}</p>
                    </li>
                </ul>
              </div>
            ))}
        </div>
      </main>
      <footer>
          <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
        </footer>
    </div>
  );
};

export default Users;

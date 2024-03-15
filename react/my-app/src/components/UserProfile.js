import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; 

const UserProfile = () => {
  const [userFromLocalStorage, setUserFromLocalStorage] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate(); 
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    setUserFromLocalStorage(userFromLocalStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/register');
  };
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('imageName', selectedImage.name);

      try {
        const response = await fetch('http://localhost:8000/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          alert('Image name uploaded successfully: ' + data.imageName);
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      }
    } else {
      alert('Please select an image');
    }
  };

  return (
    <div className="user-profile-container">
        <header className={showNav ? 'menu-open' : ''}>
          <div>
            <h1>My Profile</h1>
          </div>
          <button className="menu-btn" onClick={toggleNav}>Menu</button>
          <nav className={`main-nav ${showNav ? 'show-nav' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="user-profile-main">
        {userFromLocalStorage ? (
          <div className="user-profile-info">
            <div className="profile-info-card">
              <p className="profile-info-label">ID:</p>
              <p className="profile-info">{userFromLocalStorage.id}</p>
            </div>
            <div className="profile-info-card">
              <p className="profile-info-label">Email:</p>
              <p className="profile-info">{userFromLocalStorage.email}</p>
            </div>
            <div className="profile-info-card">
              <p className="profile-info-label">Name:</p>
              <p className="profile-info">{userFromLocalStorage.name}</p>
            </div>
            <div className="profile-info-card">
              <label htmlFor="imageInput">Upload Image:</label>
              <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
              <button onClick={handleImageUpload}>Upload Image</button>
            </div>
          </div>
        ) : (
          <p className="profile-info">Please log in</p>
        )}
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default UserProfile;

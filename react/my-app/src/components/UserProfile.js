import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userFromLocalStorage, setUserFromLocalStorage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [socialLink, setSocialLink] = useState('');
  const [socialNetwork, setSocialNetwork] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);

  const navigate = useNavigate();

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    setUserFromLocalStorage(userFromLocalStorage);
    if (userFromLocalStorage) {
      fetchSocialLinks(userFromLocalStorage);
    }
  }, []);

  const fetchSocialLinks = async (user) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserFromLocalStorage(data);
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/register');
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(image);
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);

      try {
        const response = await fetch('http://localhost:8000/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Uploaded file info:', data.file_info);
          alert('Image uploaded successfully');
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

  const handleEditProfile = () => {
    alert('Edit profile functionality coming soon!');
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setNewPassword('');
  };

  const handleSubmitNewPassword = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userFromLocalStorage.email, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        handleCancelChangePassword();
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleSocialLinkChange = (e) => {
    setSocialLink(e.target.value);
  };

  const handleSocialNetworkChange = (e) => {
    setSocialNetwork(e.target.value);
  };

  const handleSaveSocialLink = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/add-social-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userFromLocalStorage.id,
          socialNetwork: socialNetwork,
          link: socialLink,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchSocialLinks(userFromLocalStorage);
      } else {
        throw new Error('Failed to add social link');
      }
    } catch (error) {
      console.error('Error adding social link:', error);
      alert('Error adding social link');
    }
  };

  const handleToggleSocialLinks = () => {
    setShowSocialLinks(true);
  };

  const handleAddFriend = async () => {
    try {
      if (!friendUsername) {
        alert('Please enter a username to add as a friend');
        return;
      }

      const response = await fetch('http://localhost:8000/api/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userFromLocalStorage.id,
          friendUsername: friendUsername,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserFromLocalStorage((prevUser) => ({
          ...prevUser,
          friends: Array.isArray(prevUser.friends) ? [...prevUser.friends, data.friend] : [data.friend],
        }));
        alert('Friend added successfully');
      } else {
        throw new Error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Error adding friend');
    }
  };

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
            <li><Link to="/search" className="nav-link">Search</Link></li>
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
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              <label htmlFor="imageInput">Upload Image:</label>
              <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
              <button onClick={handleImageUpload}>Upload Image</button>
            </div>
            <div className="profile-info-card">
              <button onClick={() => setAddingFriend(true)}>Friendship</button>
              {addingFriend && (
                <div>
                  <input
                    type="text"
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                    placeholder="Enter friend's username"
                  />
                  <button onClick={handleAddFriend}>Add Friend</button>
                </div>
              )}
              {userFromLocalStorage.friends && Array.isArray(userFromLocalStorage.friends) && userFromLocalStorage.friends.length > 0 ? (
                userFromLocalStorage.friends.map((friend, index) => (
                  <div key={index} className="friend-ship">
                    <Link to={`/users/${friend.id}`} className="friend-ship-info">Name: {friend.name}</Link>
                    <p className="friend-ship-info">Email: {friend.email}</p>
                  </div>
                ))
              ) : (
                <p>No friends added</p>
              )}
            </div>
            <div className="profile-info-card">
              <button onClick={handleEditProfile}>Edit Profile</button>
            </div>
            <div className="profile-info-card">
              <button onClick={handleChangePassword}>Change Password</button>
            </div>
            {showChangePassword && (
              <div className="profile-info-card">
                <label htmlFor="newPasswordInput">New Password:</label>
                <input
                  type="password"
                  id="newPasswordInput"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleSubmitNewPassword}>Submit</button>
                <button onClick={handleCancelChangePassword}>Cancel</button>
              </div>
            )}
            <div className="profile-info-card">
              {showSocialLinks ? (
                <>
                  <label htmlFor="socialLinkInput">Social Link:</label>
                  <input
                    type="text"
                    id="socialLinkInput"
                    value={socialLink}
                    onChange={handleSocialLinkChange}
                  />
                  <label htmlFor="socialNetworkInput">Social Network:</label>
                  <input
                    type="text"
                    id="socialNetworkInput"
                    value={socialNetwork}
                    onChange={handleSocialNetworkChange}
                  />
                  <button onClick={handleSaveSocialLink}>Save Link</button>
                </>
              ) : (
                <button onClick={handleToggleSocialLinks}>Add Social Link</button>
              )}
            </div>
            <div className="profile-info-card">
              <p className="profile-info-label">Social Links:</p>
              {socialLinks.length > 0 ? (
                <ul>
                  {socialLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No social links added</p>
              )}
            </div>
            <div className="profile-info-card">
              <p className="profile-info-label">Activity:</p>
              <p className="profile-info">Logins: {userFromLocalStorage.logins}</p>
              <p className="profile-info">Actions: {userFromLocalStorage.actions}</p>
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

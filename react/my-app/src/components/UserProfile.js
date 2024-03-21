import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userFromLocalStorage, setUserFromLocalStorage] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [socialLink, setSocialLink] = useState('');
  const [socialNetwork, setSocialNetwork] = useState('');
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [friendUsername, setFriendUsername] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [changeImg, setChangeImg] = useState(false);
  const [scrollingImages, setScrollingImages] = useState([]);
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const toogleChangeImg = () => {
    setChangeImg(!changeImg);
  };

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleFriendShip = () => {
    setAddingFriend(!addingFriend);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        setUserFromLocalStorage(userFromLocalStorage);
    
        if (userFromLocalStorage) {
          const response = await fetch(`http://localhost:8001/api/get-social-links/${userFromLocalStorage.id}`);
    
          if (response.ok) {
            const data = await response.json();
            console.log('Response data:', data);
            setSocialLinks(data.socialLinks);
            if (Array.isArray(data.socialLinks)) { 
              setScrollingImages(data.socialLinks.map(image => ({
                image_name: image.image_name,
                post_text: image.post_text
              })));
            } else {
              throw new Error('Data is not an array');
            }
            fetchFriends(userFromLocalStorage.id);
            fetchScrollingImages(userFromLocalStorage.id);
          } else {
            throw new Error('Failed to fetch social links');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
  
    const fetchScrollingImages = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8000/get-image-scrolling/${userId}`);
  
        if (response.ok) {
          const data = await response.json();
          setScrollingImages(data);
        } else {
          throw new Error('Failed to fetch scrolling images');
        }
      } catch (error) {
        console.error('Error fetching scrolling images:', error);
      }
    };
  
    fetchUserProfile();
  }, []);
  
  

  const fetchFriends = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/get-friends/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserFromLocalStorage((prevUser) => ({
          ...prevUser,
          friends: data.friends,
        }));
      } else {
        throw new Error('Failed to fetch friends');
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/register');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImage) {
        alert('Please select an image to upload');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('username', userFromLocalStorage.name);
      formData.append('userid', userFromLocalStorage.id);
      formData.append('text', text)


      const response = await fetch('http://localhost:8000/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully');
        fetchScrollingImages(userFromLocalStorage.id);
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const handleSubmitNewPassword = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/change-password', {
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
      const response = await fetch('http://localhost:8001/api/add-social-link', {
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

  const handleUploadClick = async () => {
    try {
      if (!selectedImage) {
        alert('Please select an image to upload');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('text', text)
      formData.append('username', userFromLocalStorage.name);
      formData.append('userid', userFromLocalStorage.id);

      const response = await fetch('http://localhost:8000/upload-image-scrolling', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const handleAddFriend = async () => {
    try {
      if (!friendUsername) {
        alert('Please enter a username to add as a friend');
        return;
      }

      const response = await fetch('http://localhost:8001/api/add-friend', {
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
            <li><Link to="/feed" className="nav-link">Feed's</Link></li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
        <button className="setting-btn" onClick={toggleSettings}>Settings</button>

      </header>
      <main className="user-profile-main">
        {showSettings ? (
          <div>
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
                <div className="profile-info-card-usersname">
                  <div className="user-profile-image" onClick={toogleChangeImg}>
                    <img src={`http://127.0.0.1:8000/profile-image/${userFromLocalStorage.name}_${userFromLocalStorage.id}`} alt="Preview" className="image-preview" />
                  </div>
                  <div className="user-profile-info">
                    <p className="profile-info-label">Name:</p>
                    <p className="profile-info">{userFromLocalStorage.name}</p>
                  </div>
                </div>
                {changeImg && (

                  <div className="profile-info-card">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                    <label htmlFor="imageInput">Upload Image:</label>
                    <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
                    <button onClick={handleImageUpload}>Upload Image</button>
                  </div>
                )}
                <div className="profile-info-card">
                  <button onClick={toggleFriendShip}>Friendship</button>
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
          </div>
        ) : (
          <div>
            <div>
              <input type="file" onChange={handleImageChange} accept="image/*" />

              {selectedImage && (
                <div className='profile-info-card-uploud-post'>
                  <h3>Selected Image:</h3>
                  <img src={URL.createObjectURL(selectedImage)} alt="Selected" width="200" />
                  <input type='text' value={text} onChange={(e) => setText(e.target.value)} placeholder="Введите текст"/>
                </div>
              )}

              <button onClick={handleUploadClick}>Upload Image</button>
            </div>
            <div>
              {scrollingImages.map((image, index) => (
                <div key={index} className='profile-info-card-usersname'> 
                  <div className='post-imgs-div'>
                    <img src={`http://127.0.0.1:8000/get_images/${image.image_name}_${userFromLocalStorage.id}`} alt={`Image ${index}`} className='users-post'/>
                  </div>
                  <ul>
                    <li>
                      <h1>{userFromLocalStorage.name}'s Post</h1>
                    </li>
                    <li>
                      <p>{image.post_text}</p>
                    </li>
                  </ul>
                  
                </div>
              ))}

            </div>

          </div>
        )}
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default UserProfile;


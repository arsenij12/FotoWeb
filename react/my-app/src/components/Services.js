import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import './Services.css';

const Services = () => {
  const [userFromLocalStorage, setUserFromLocalStorage] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [feedbackFormData, setFeedbackFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    setUserFromLocalStorage(userFromLocalStorage);
  }, []);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const sendFeedbackDataToServer = async () => {
    try {
      const response = await fetch('API для запроса', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackFormData)
      });
      if (!response.ok) {
        throw new Error('Failed to send feedback data');
      }
      console.log('Feedback data sent successfully');
      // Очищаем поля формы
      setFeedbackFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending feedback data:', error.message);
      // Тут можно добавить код для обработки ошибок.
    }
  };

  const handleFeedbackFormSubmit = (e) => {
    e.preventDefault();
    sendFeedbackDataToServer();
  };

  const handleFeedbackFormChange = (e) => {
    const { name, value } = e.target;
    setFeedbackFormData({
      ...feedbackFormData,
      [name]: value
    });
  };

  const handleOrderService = () => {
    console.log('Order Service clicked');
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
              {userFromLocalStorage && (
                <>
                  <li><Link to="/search" className="nav-link">Search</Link></li>
                  <li><Link to="/profile" className="nav-link">Go to Profile</Link></li>
                </>
              )}
              {!userFromLocalStorage && (
                <li><Link to="/register" className="nav-link">Register/Login</Link></li>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <div className="row">
            <div className="col-md-12">
              <h2>Our Services</h2>
              <p>Insert your services description here</p>
              {/* Форма обратной связи */}
              <form onSubmit={handleFeedbackFormSubmit}>
                <label>
                  Name:
                  <input type="text" name="name" value={feedbackFormData.name} onChange={handleFeedbackFormChange} />
                </label>
                <label>
                  Email:
                  <input type="email" name="email" value={feedbackFormData.email} onChange={handleFeedbackFormChange} />
                </label>
                <label>
                  Subject:
                  <input type="text" name="subject" value={feedbackFormData.subject} onChange={handleFeedbackFormChange} />
                </label>
                <label>
                  Message:
                  <textarea name="message" value={feedbackFormData.message} onChange={handleFeedbackFormChange} />
                </label>
                <button type="submit">Send Feedback</button>
              </form>
              {/* Кнопка "Заказать услугу" */}
              <button onClick={handleOrderService}>Order Service</button>
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

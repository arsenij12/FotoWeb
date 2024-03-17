import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'react-slick';
import './About.css';

const About = () => {
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
    <div>
      <header className={showNav ? 'menu-open' : ''}>
          <div>
            <h1>SnapPortfolio</h1>
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
      <main className="container mt-5">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">О нас</div>

              <div className="card-body">
                <p className="mb-0">
                  Добро пожаловать на сайт фотографов! Мы - сообщество профессионалов и любителей, делимся опытом, новинками, идеями и искусством фотографии. Здесь вы найдете множество полезной информации о фотографии, сможете обсудить актуальные вопросы, посмотреть фотографии наших участников и поделиться своими работами. Наша миссия - объединить всех, кто любит фотографию, и создать пространство, где каждый сможет найти вдохновение, обменяться опытом и прокачать свои фотографические навыки. Присоединяйтесь к нашему сообществу и поделитесь своим взглядом на мир через объектив камеры
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="slider-container">
              <Slider autoplay = "true">
                <div className="slide-item"><img src="http://localhost:8000/images/Img1.png" alt="Image 1"></img></div>
                <div className="slide-item"><img src="http://localhost:8000/images/img2.png" alt="Image 2"></img></div>
                <div className="slide-item"><img src="http://localhost:8000/images/Img3.png" alt="Image 3"></img></div>
              </Slider>
            </div>
            <div className="text-container">
              <h2>Заголовок</h2>
              <p>Текстовый элемент, который будет отображаться рядом со слайдером</p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} My Laravel Site</p>
      </footer>
    </div>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import "./App.css";

const Home = () => {
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
    <>
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
              <h2>Новости и обновления</h2>
              <p>Дорогие фотографы и любители фотографии,<br />
                <br />С радостью сообщаем вам о запуске нашего нового сайта, посвященного искусству фотографии! Мы создали этот ресурс с целью объединить всех, кто разделяет наше увлечение фотографией и стремится развивать свои навыки в этой области.
                <br />Наши планы на будущее сайта амбициозны. Мы надеемся, что наш сайт станет центром обсуждений, обмена опытом и идеями, а также местом, где вы сможете найти вдохновение и поддержку в вашем творчестве.
                <br />Мы приглашаем вас присоединиться к нашему сообществу фотографов. Вы можете поделиться своими фотографиями, выставить их на обсуждение, комментировать работы других участников и делиться своим опытом.
                <br />Немного о нас: Мы - команда энтузиастов, которые привержены фотографии и хотят сделать мир фотографии доступным для всех. У нас есть опыт в этой области, и мы стремимся создать место, где каждый может найти что-то интересное и полезное для себя.
                <br />Как пользоваться нашим сайтом: Для начала пользования сайтом вам необходимо зарегистрироваться. Создание аккаунта легко и быстро. Затем вы можете публиковать свои фотографии, просматривать работы других участников, комментировать их и обсуждать фотографические темы.
                <br />Мы благодарим вас за внимание и поддержку нашего проекта! Мы надеемся, что наш сайт станет вашим любимым местом для общения и обмена опытом.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h2>Ссылки на социальные сети</h2>
              <div className="social-buttons">
                <a href="https://www.facebook.com/" target="_blank">
                  <img src="http://localhost:8000/images/FacebookHome.png" alt="Facebook" />
                </a>
                <a href="https://twitter.com/" target="_blank">
                  <img src="http://localhost:8000/images/TwitterHome.png" alt="Twitter" />
                </a>
                <a href="https://www.instagram.com/" target="_blank">
                  <img src="http://localhost:8000/images/InstagramHome.png" alt="Instagram" />
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h2>Важные разделы сайта</h2>
              {/* Add links to important sections here */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h2>Последние новинки</h2>
              {/* Add latest photos section here */}
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

export default Home;


import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <header>
      <nav className="navbar">
        <div className="logo-container">
          <Link to="/">
            <img src="img/space obj.png" alt="space.obj logo" className="logo-img" />
          </Link>
          <span className="logo-text">space.obj</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/solar-system">solar system</Link></li>
          <li><Link to="/comparison">space object comparison</Link></li>
          <li><Link to="/customizer">planet customizer</Link></li>
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  const heroStyle = {
    background: 'linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0) 30%), url("/img/hero_bg.jpeg") center center / cover no-repeat'
  };

  return (
    <section className="hero" style={heroStyle}>
      <div className="hero-left">
        <h1 className="hero-title">
          the stars don't look bigger,<br />
          but they do look brighter
        </h1>
      </div>
      <div className="hero-right">
        <a href="#" className="hero-btn">explore</a>
        <a href="#" className="hero-btn">customize</a>
      </div>
    </section>
  );
}

function Slider() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const slidesData = [
    { color: '#ff6b6b', text: 'Slide 1' },
    { color: '#feca57', text: 'Slide 2' },
    { color: '#48dbfb', text: 'Slide 3' },
    { color: '#1dd1a1', text: 'Slide 4' },
    { color: '#5f27cd', text: 'Slide 5' }
  ];
  const slideWidth = 1200;
  const slideMargin = 10;
  const totalSlideWidth = slideWidth + slideMargin * 2;
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateSlider = () => {
    const containerWidth = containerRef.current.offsetWidth;
    const centerOfSlide = currentIndex * totalSlideWidth + slideWidth / 2 + slideMargin;
    let offset = centerOfSlide - containerWidth / 2;
    const totalTrackWidth = slidesData.length * totalSlideWidth;
    if (offset < 0) offset = 0;
    const maxOffset = totalTrackWidth - containerWidth;
    if (maxOffset > 0 && offset > maxOffset) offset = maxOffset;
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  };

  useEffect(() => {
    updateSlider();
  }, [currentIndex]);

  useEffect(() => {
    const handleResize = () => updateSlider();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  const goToSlide = (index) => {
    let newIndex = index;
    if (newIndex < 0) newIndex = slidesData.length - 1;
    if (newIndex >= slidesData.length) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  return (
    <div>
      <div className="slider-container" ref={containerRef}>
        <div className="slider-track" ref={trackRef}>
          {slidesData.map((slide, idx) => (
            <div key={idx} className="slide" style={{ backgroundColor: slide.color }}>
              {slide.text}
            </div>
          ))}
        </div>
      </div>
      <div className="slider-controls">
        <button className="arrow-btn prev-btn" onClick={() => goToSlide(currentIndex - 1)}>
          <span className="arrow-left"></span>
        </button>
        <div className="dots">
          {slidesData.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
            ></span>
          ))}
        </div>
        <button className="arrow-btn next-btn" onClick={() => goToSlide(currentIndex + 1)}>
          <span className="arrow-right"></span>
        </button>
      </div>
    </div>
  );
}

function Intro() {
  return (
    <section className="intro">
      <div className="intro-container">
        <h2>welcome to space.obj</h2>
        <p>
          explore the universe like never before, space.obj is an interactive tool that lets you visualize the solar system, compare celestial bodies, and even customize your own planet using real data.
        </p>
        <p className="quote-text">
          “somewhere, something incredible is waiting to be known.” — <span className="quote-author">carl sagan</span>
        </p>
        <p>
          our goal is to make space exploration more accessible, blending scientific accuracy with creative freedom. whether you're observing the planets, comparing their sizes, or designing your own world, space.obj puts the cosmos at your fingertips.
        </p>
      </div>
    </section>
  );
}

function PlaceholderBoxes() {
  return (
    <section className="placeholder-boxes">
      <div className="box">
        <img src="img/face.jpeg" alt="Placeholder 1" />
        <p>Alp<br />Doymaz</p>
      </div>
      <div className="box">
        <img src="img/face.jpeg" alt="Placeholder 2" />
        <p>Aleksandr<br />Belousov</p>
      </div>
      <div className="box">
        <img src="img/face.jpeg" alt="Placeholder 3" />
        <p>Wai<br />Hlaing</p>
      </div>
      <div className="box">
        <img src="img/LamaFace.jpeg" alt="Placeholder 4" />
        <p>Lama<br />Ngawang</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-divider"></div>
      <div className="footer-middle">
        <div className="footer-links">
          <a href="#">link</a>
          <a href="#">link</a>
          <a href="#">link</a>
        </div>
        <div className="footer-logo">
          <Link to="/">
            <img src="img/space obj.png" alt="space.obj logo" />
          </Link>
          <span>space.obj</span>
        </div>
        <div className="footer-links">
          <a href="#">link</a>
          <a href="#">link</a>
          <a href="#">link</a>
        </div>
      </div>
      <div className="footer-icons">
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=1" alt="icon 1" />
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=2" alt="icon 2" />
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=3" alt="icon 3" />
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=4" alt="icon 4" />
      </div>
      <div className="footer-bottom">
        <p>hunter college css233 | group 2</p>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div>
      <Header />
      <Hero />
      <Slider />
      <Intro />
      <PlaceholderBoxes />
      <Footer />
    </div>
  );
}

function SolarSystem() {
  return (
    <div>
      <Header />
      <Hero />

      <Footer />
    </div>
  );
}

function ComparisonPage() {
  return (
    <div>
      <Header />
      <Hero />

      <Footer />
    </div>
  );
}

function CustomizerPage() {
  return (
    <div>
      <Header />
      <Hero />

      <Footer />
    </div>
  );
}

export default HomePage;
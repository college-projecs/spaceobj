import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header>
      <nav className="navbar">
        <div className="logo-container">
          <Link to="/">
            <img src="/img/space%20obj.png" alt="space.obj logo" className="logo-img" />
          </Link>
          <span className="logo-text">space.obj</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/solarsystem">solar system</Link></li>
          <li><Link to="/compare">space object comparison</Link></li>
          <li><Link to="/custom">planet customizer</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export function Hero() {
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
        <Link to="/solar-system" className="hero-btn">explore</Link>
        <Link to="/custom" className="hero-btn">customize</Link>
      </div>
    </section>
  );
}

function Slider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const slidesData = [
  { src: '/img/Frame 14.png', alt: 'Slide 1' },
  { src: '/img/Frame 15.png', alt: 'Slide 2' },
  { src: '/img/Frame 16.png', alt: 'Slide 3' },
  { src: '/img/Frame 14.png', alt: 'Slide 4' },
  { src: '/img/Frame 15.png', alt: 'Slide 5' },
];

  const slideWidth = 1200;
  const slideMargin = 10;
  const totalSlideWidth = slideWidth + slideMargin * 2;
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateSlider = () => {
    if (!containerRef.current || !trackRef.current) return;
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
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, []);

  const goToSlide = (index: number) => {
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
            <div
              key={idx}
              className="slide"
              style={{
                width: slideWidth,
                margin: `0 ${slideMargin}px`,
                flex: '0 0 auto'
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="slider-controls">
        <button className="arrow-btn prev-btn" onClick={() => goToSlide(currentIndex - 1)}>
          ‹
        </button>
        <div className="dots">
          {slidesData.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
        <button className="arrow-btn next-btn" onClick={() => goToSlide(currentIndex + 1)}>
          ›
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
        <img src="/img/face.jpeg" alt="Placeholder 1" />
        <p>Alp<br />Doymaz</p>
      </div>
      <div className="box">
        <img src="/img/face.jpeg" alt="Placeholder 2" />
        <p>Aleksandr<br />Belousov</p>
      </div>
      <div className="box">
        <img src="/img/face.jpeg" alt="Placeholder 3" />
        <p>Wai<br />Hlaing</p>
      </div>
      <div className="box">
        <img src="/img/LamaFace.jpeg" alt="Placeholder 4" />
        <p>Lama<br />Ngawang</p>
      </div>
    </section>
  );
}

export function Footer() {
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
            <img src="/img/space%20obj.png" alt="space.obj logo" />
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
        {/* <img src="https://via.placeholder.com/40/7DE2D1/131515?text=1" alt="icon 1" />
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=2" alt="icon 2" />
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=3" alt="icon 3" />
        <img src="https://via.placeholder.com/40/7DE2D1/131515?text=4" alt="icon 4" />
        */}
        
      </div>
      <div className="footer-bottom">
        <p>hunter college css233 | group 2</p>
      </div>
    </footer>
  );
}

export function HomePage() {
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

export default HomePage;
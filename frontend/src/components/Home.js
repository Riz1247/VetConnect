import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pets?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="animated-title">Find Your Perfect Companion</h1>
            <p className="animated-subtitle">Adopt a pet and give them a forever home</p>
            
            <form onSubmit={handleSearch} className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
              <input
                type="text"
                placeholder="Search for pets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>

            <div className="hero-features">
              <div className="feature-card">
                <i className="fas fa-paw feature-icon"></i>
                <h3>Adopt</h3>
                <p>Find your perfect furry friend</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-heart feature-icon"></i>
                <h3>Care</h3>
                <p>Professional pet care services</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-home feature-icon"></i>
                <h3>Shelter</h3>
                <p>Support local animal shelters</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard";
import "./PetList.css";

const PetList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/pets")
      .then((response) => setPets(response.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  return (
    <div className="petlist-container">
      <div className="sidebar-filter">
        <h2 className="filter-title">Filters</h2>

        <div className="filter-section">
          <label className="filter-label">Gender</label>
          <div className="checkbox-option"><input type="checkbox" /> Male</div>
          <div className="checkbox-option"><input type="checkbox" /> Female</div>
        </div>
        <hr />

        <div className="filter-section">
          <label className="filter-label">Age</label>
          <div className="checkbox-option"><input type="checkbox" /> Under 1 Year</div>
          <div className="checkbox-option"><input type="checkbox" /> 1 - 2 Years</div>
          <div className="checkbox-option"><input type="checkbox" /> 2 - 7 Years</div>
          <div className="checkbox-option"><input type="checkbox" /> 7+ Years</div>
        </div>
        <hr />

        <div className="filter-section">
          <label className="filter-label">Vaccinated</label>
          <div className="checkbox-option"><input type="checkbox" /> Yes</div>
          <div className="checkbox-option"><input type="checkbox" /> No</div>
        </div>
        <hr />

        <div className="filter-section">
          <label className="filter-label">Shelters</label>
          <select className="filter-select">
            <option>Select from menu…</option>
            <option>Dhanmondi</option>
            <option>Gulshan</option>
            <option>Banani</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        <div className="top-search-container">
          <div className="top-search-field">
            <label htmlFor="petType">Pet Type</label>
            <select id="petType" className="top-search-select">
              <option value="">Any</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>

          <div className="top-search-field">
            <label htmlFor="breed">Breeds</label>
            <select id="breed" className="top-search-select">
              <option value="">Select from menu…</option>
              <option value="Labrador">Labrador</option>
              <option value="Poodle">Poodle</option>
              <option value="Persian">Persian</option>
            </select>
          </div>

          <div className="top-search-field">
            <label htmlFor="location">Location</label>
            <select id="location" className="top-search-select">
              <option value="">Select Location</option>
              <option value="Dhanmondi">Dhanmondi</option>
              <option value="Gulshan">Gulshan</option>
              <option value="Banani">Banani</option>
            </select>
          </div>
        </div>

        <div className="top-divider"></div>

        <div className="pet-cards">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetList;

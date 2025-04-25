import { useLocation, useHistory } from 'react-router-dom';  // For navigating and reading URL
import queryString from 'query-string'; // For handling query parameters in the URL
import DoctorCard from './DoctorCard';  // Adjust the path based on where the file is located
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    specialty: '',
    consultation: '',
    sort: 'fees',
  });

  useEffect(() => {
    // Fetch doctors data from the API
    axios.get('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then(response => {
        setDoctors(response.data); // Store the doctor data in state
      })
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  // Apply filters to the doctors data
  const filteredDoctors = doctors
    .filter(doctor => doctor.name.toLowerCase().includes(filters.search.toLowerCase()))
    .filter(doctor => filters.specialty ? doctor.specialty.includes(filters.specialty) : true)
    .filter(doctor => filters.consultation ? doctor.consultation === filters.consultation : true)
    .sort((a, b) => {
      if (filters.sort === 'fees') {
        return a.fee - b.fee;
      } else {
        return b.experience - a.experience;
      }
    });

  return (
    <div>
      <h1>Doctors List</h1>

      {/* Search Bar */}
      <input 
        type="text" 
        value={filters.search} 
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search by doctor name"
      />

      {/* Consultation Type Filter */}
      <div>
        <label>
          <input 
            type="radio" 
            value="Video Consult" 
            checked={filters.consultation === 'Video Consult'} 
            onChange={(e) => setFilters({ ...filters, consultation: e.target.value })}
          />
          Video Consult
        </label>
        <label>
          <input 
            type="radio" 
            value="In Clinic" 
            checked={filters.consultation === 'In Clinic'} 
            onChange={(e) => setFilters({ ...filters, consultation: e.target.value })}
          />
          In Clinic
        </label>
      </div>

      {/* Specialty Filter */}
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={filters.specialty === 'Dentist'} 
            onChange={(e) => setFilters({ ...filters, specialty: e.target.checked ? 'Dentist' : '' })}
          />
          Dentist
        </label>
        {/* Add more specialties as needed */}
      </div>

      {/* Sort Filter */}
      <div>
        <label>
          Sort By:
          <select 
            value={filters.sort} 
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="fees">Fees (Low to High)</option>
            <option value="experience">Experience (High to Low)</option>
          </select>
        </label>
      </div>

      {/* Doctor List */}
      <div className="doctor-list">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id}>
            <h2>{doctor.name}</h2>
            <p>{doctor.specialty}</p>
            <p>{doctor.experience} years experience</p>
            <p>{doctor.fee} fee</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;

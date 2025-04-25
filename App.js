import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard'; // Assuming DoctorCard is in a separate file

function App() {
  // State variables
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    consultationType: '',
    specialties: [],
    sort: '',
  });

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data); // Initialize with all doctors
    };

    fetchDoctors();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter doctors by search query
  const filteredDoctorsBySearch = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Display up to 3 suggestions for autocomplete
  const searchSuggestions = filteredDoctorsBySearch.slice(0, 3);

  // Filter doctors by applied filters (consultation type, specialties, and sort)
  const applyFilters = (filteredDoctors) => {
    let result = filteredDoctors;

    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter(doctor => doctor.consultationType === filters.consultationType);
    }

    // Apply specialties filter
    if (filters.specialties.length > 0) {
      result = result.filter(doctor =>
        filters.specialties.every(specialty => doctor.specialties.includes(specialty))
      );
    }

    // Apply sorting
    if (filters.sort) {
      if (filters.sort === 'fees') {
        result = result.sort((a, b) => a.fee - b.fee);
      } else if (filters.sort === 'experience') {
        result = result.sort((a, b) => b.experience - a.experience);
      }
    }

    return result;
  };

  // Apply filters and search together
  const filteredDoctorsList = applyFilters(filteredDoctorsBySearch);

  return (
    <div>
      {/* Search bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by doctor name"
        data-testid="autocomplete-input"
      />

      {/* Autocomplete suggestions */}
      {searchSuggestions.length > 0 && (
        <ul>
          {searchSuggestions.map(doctor => (
            <li
              key={doctor.id}
              onClick={() => setSearchQuery(doctor.name)}  // When clicking a suggestion, set the search query
              data-testid="suggestion-item"
            >
              {doctor.name}
            </li>
          ))}
        </ul>
      )}

      {/* Filter Panel */}
      <div>
        <h3>Consultation Type</h3>
        <input
          type="radio"
          id="video-consult"
          name="consultationType"
          value="Video Consult"
          onChange={(e) => setFilters({ ...filters, consultationType: e.target.value })}
        />
        <label htmlFor="video-consult">Video Consult</label>

        <input
          type="radio"
          id="in-clinic"
          name="consultationType"
          value="In Clinic"
          onChange={(e) => setFilters({ ...filters, consultationType: e.target.value })}
        />
        <label htmlFor="in-clinic">In Clinic</label>

        <h3>Specialties</h3>
        {['General Physician', 'Dentist', 'Dermatologist', 'Paediatrician', 'Gynaecologist'].map((specialty) => (
          <div key={specialty}>
            <input
              type="checkbox"
              id={`specialty-${specialty}`}
              onChange={() => {
                const newSpecialties = filters.specialties.includes(specialty)
                  ? filters.specialties.filter((item) => item !== specialty)
                  : [...filters.specialties, specialty];
                setFilters({ ...filters, specialties: newSpecialties });
              }}
            />
            <label htmlFor={`specialty-${specialty}`}>{specialty}</label>
          </div>
        ))}

        <h3>Sort By</h3>
        <select
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          value={filters.sort}
        >
          <option value="">Select Sort</option>
          <option value="fees">Fees (Ascending)</option>
          <option value="experience">Experience (Descending)</option>
        </select>
      </div>

      {/* Render filtered doctor cards */}
      <div>
        {filteredDoctorsList.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default App;

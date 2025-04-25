import React from 'react';
import './DoctorCard.css';

function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card-header">
        <h3 className="doctor-name">{doctor.name}</h3>
        <span className="doctor-fee">₹{doctor.fee}</span>
      </div>

      <div className="doctor-specialties">
        {doctor.specialties && doctor.specialties.length > 0 
          ? doctor.specialties.join(', ') 
          : 'No specialties listed'}
      </div>

      <div className="doctor-details">
        <p className="doctor-experience">{doctor.experience} Years of Experience</p>
      </div>

      <button className="book-appointment-btn">Book Appointment</button>
    </div>
  );
}

export default DoctorCard;
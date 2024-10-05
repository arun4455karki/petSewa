import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../Styles/BookAppointment.css'; // Import the CSS file
import { PetContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const {loginStatus} = useContext(PetContext)
    const userId = localStorage.getItem('userID')
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        customer: userId,
        petName: '',
        petType: '',
        appointmentDate: '',
        appointmentTime: '',
        serviceType: '',
    });

  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Combine date and time into a single Date object
        const combinedDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
        const appointmentData = {
            ...formData,
            appointmentDateAndTime: combinedDateTime
        }
        console.log(appointmentData)
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/addAppointment`, { appointment: appointmentData });
        setMessage(response.data.message);
        setTimeout( () => {
            navigate('/appointments')
        }, 200)
        setFormData({
        customer: '',
        petName: '',
        petType: '',
        appointmentDate: '',
        appointmentTime: '',
        groomingService: '',
        });
    } catch (error) {
      setMessage('Failed to book appointment. Please try again.');
    }
  };
  

  return (
    loginStatus ? <>
    <div className="appointment-form-container">
        {loginStatus ? (<>
            <h2 className="form-title" style={{fontWeight: 'bold', letterSpacing: '1px'}}>Book an Appointment</h2>
            <form onSubmit={handleSubmit} className="appointment-form">


                <div className="form-group">
                <label>Pet Name:</label>
                <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                </div>

                <div className="form-group">
                <label>Pet Type:</label>
                <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    required
                    className="form-select"
                >
                    <option value="">Select Pet Type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                </select>
                </div>

                <div className="form-group">
                <label>Appointment Date:</label>
                <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                </div>

                <div className="form-group">
                <label>Appointment Time:</label>
                <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                </div>

                <div className="form-group">
                <label>Grooming Service:</label>
                <select
                    name="serviceType"
                    value={formData.groomingService}
                    onChange={handleChange}
                    required
                    className="form-select"
                >
                    <option value="">Select Service</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Bathing">Bathing</option>
                    <option value="Nail Trimming">Nail Trimming</option>
                </select>
                </div>

                <button type="submit" className="submit-btn">Book Appointment</button>
            </form>

            {message && <p className="message">{message}</p>}
        </>
        ):(
            <div className="not-logged-in-message">
            <h2>You are not logged in</h2>
            <p>Please <span to="/login">log in</span> to book an appointment.</p>
            </div>
        )}

    </div>
    </>: <>
    </>
  );
};

export default BookAppointment;

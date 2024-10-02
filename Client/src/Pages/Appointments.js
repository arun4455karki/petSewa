import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axios } from '../Utils/Axios';
import toast from 'react-hot-toast';
import '../Styles/Appointments.css'
function Appointments() {
  // const { userID } = useContext(PetContext);
  const userId = localStorage.getItem('userID')
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/getAppointmentsByUserId/${userId}`);
        setAppointments(response.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchAppointments();
  }, [userId]);

  return (
    <section className="appointments d-flex flex-column align-items-center mb-5 text-black" style={{ paddingTop: '80px' }}>
      <h1 className="mt-5 mb-5 text-black fw-bolder">
        <span>My</span> Appointments
      </h1>

      <div className="dashboard-table pt-5 px-5 w-75">
        <table className="w-100 pt-5">
          <tbody className="text-center">
            {appointments.length > 0 ? (
              <>
              <tr>
                <th>
                  <span>Pet Name</span> 
                </th>
                <th>
                  <span>Service</span> 
                </th>
                <th>
                  <span>Date</span>
                </th>
                <th>
                  <span>Time</span>
                </th>
                <th>
                  <span>Status</span>
                </th>
                <th>
                  <span>Action</span>
                </th>
              </tr>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td >
                    {appointment.petName}
                  </td>
                  <td >
                    {appointment.serviceType}
                  </td>
                  <td>
                    {new Date(appointment.appointmentDateAndTime).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(appointment.appointmentDateAndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className = {`${appointment.status}`}>
                    {appointment.status}
                  </td>
                  <td>
                    {
                      appointment.status == 'Scheduled' ? <button
                      className="btn btn-danger"
                      onClick={() => navigate(`/appointments/${appointment._id}`)}
                    >
                      Cancel
                    </button> :<></>
                    }
                  </td>
                </tr>
              ))}
              </>
            ) : (
              <tr>
                <td colSpan="4">
                  <h3>No Appointments</h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Appointments;

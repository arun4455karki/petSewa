import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axios } from '../Utils/Axios';
import toast from 'react-hot-toast';
import '../Styles/Subscriptions.css'
function Subscriptions() {
  // const { userID } = useContext(PetContext);
  const userId = localStorage.getItem('userID')
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        console.log()
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/getSubscriptionsByUserId/${userId}`);
        console.log(response.data.data)
        setSubscriptions(response.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  return (
    <section className="appointments d-flex flex-column align-items-center mb-5 text-black" style={{ paddingTop: '80px' }}>
      <h1 className="mt-5 mb-5 text-black fw-bolder">
        <span>My</span> Subscriptions
      </h1>

      <div className="dashboard-table pt-5 px-5 w-75">
        <table className="w-100 pt-5">
          <tbody className="text-center">
            {subscriptions?.length > 0 ? (
              <>
              <tr>
                <th>
                    <span>Product Image</span>
                </th>
                <th>
                  <span>Product Name</span> 
                </th>
                <th>
                  <span>Next Due Date</span>
                </th>

                <th>
                  <span>Status</span>
                </th>
                <th>
                  <span>Action</span>
                </th>
              </tr>
              {subscriptions.map((subscription) => (
                <tr key={subscription._id}>
                  <td >
                    <img src={subscription.product.image} className = 'subscription-image'/>
                  </td>
                  <td >
                    {subscription.product.title}
                  </td>
                  <td className='cancelled' style = {{letterSpacing: '0.2rem'}}>
                    {new Date(subscription.nextOrderDate).toLocaleDateString()}
                  </td>
                  <td className = {`${subscription.status}`}>
                    {subscription.status}
                  </td>
                  <td>
                    {
                      subscription.status == 'active' ? <button
                      className="btn btn-danger"
                      onClick={() => navigate(`/subscriptions`)}
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

export default Subscriptions;

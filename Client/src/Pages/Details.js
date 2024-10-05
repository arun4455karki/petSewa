import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetContext } from '../Context/Context';
import Button from '../Components/Button';
import toast from 'react-hot-toast';
import '../Styles/Details.css';
import '../Styles/Home.css';
import axios from 'axios'

export default function Details() {
  const { id } = useParams();
  const { fetchProductDetails, loginStatus, cart, addToCart } = useContext(PetContext);
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [interval, setInterval] = useState('weekly')
  const userId = localStorage.getItem('userID')
  const handleIntervalChange = (e) => {
    const {name, value} = e.target

    setInterval(value)
  }
  const handleSubscription = async () => {
    try{
      const subscriptionObject = {
        user: userId,
        product: id,
        interval: interval,
        startDate: new Date(),
        status: 'active'
      }
      console.log(subscriptionObject)
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/addSubscription`, {subscription: subscriptionObject})
      setTimeout( () => {
        navigate('/mySubscriptions')
      }, 300)
    }catch(err) {
      console.log('An error occurred', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const products = await fetchProductDetails(id);
      console.log(products)
      setItem(products);
    };

    fetchData();
  }, [id, fetchProductDetails]);

  return (
    <>
      <div className="details d-flex flex-column flex-md-row align-items-center pb-3">
        <div className="w-100 w-md-50 d-flex justify-content-center align-items-center">
          <img src={item.image} alt={item.title} />
        </div>
        <div className="d-flex flex-column w-100 w-md-50 text-black me-5 ms-5">
          <h1 className="fw-bold mb-3">{item.title}</h1>
          <h4 className="fw-bold mb-3">AUD {item.price}</h4>
          <hr />
          <p className="mt-3 text-muted mb-4">{item.description}</p>
          {/* <h1>{item.interval}</h1> */}
          <div className="d-flex align-items-center gap-3">
            <div>
              {cart?.some((value) => value.product._id === id) ? (
                <Button rounded color="dark" className="det-button" onClick={() => navigate('/cart')}>
                  Go to Cart
                </Button>
              ) : (
                <Button
                  rounded
                  color="dark"
                  className="det-button"
                  onClick={() => {
                    loginStatus ? addToCart(item._id) : toast.error('Sign in to your account');
                  }}
                >
                  Add to Cart
                </Button>
              )}
            </div>
            <div>
              <Button rounded className="det-button" style={{ backgroundColor: '#ed6335' }}>
                Buy Now
              </Button>
            </div>
          </div>
            <div className = 'd-flex flex-column'>
              <span style={{fontSize: '24px', margin: '12px 16px 8px'}}>or</span>
              <div className = 'd-flex'>
                <Button style={{minWidth: '190px', maxWidth: '200px', fontSize: '18px', fontWeight: 'bold', padding: '12px 32px', marginRight: '20px'}}
                        onClick = { () => handleSubscription() }
                >Subscribe</Button>
                <select
                      name="interval"
                      value={interval}
                      onChange={handleIntervalChange}
                      required
                      className="form-select"
                  >
                      <option value="">Select Subscription Interval</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                  </select>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axios } from '../Utils/Axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client'

const PetContext = createContext();

const PetProvider = ({ children }) => {
  const userID = localStorage.getItem('userID');
  const [products, setProducts] = useState([]);
  const [socket, setSocket] = useState(null)
  const [loginStatus, setLoginStatus] = useState(userID ? true : false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedPetType, setSelectedPetType] = useState('dog'); // New state for pet type
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/users/products');
        setProducts(response.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  useEffect( () =>{
    console.log('login status updated', loginStatus)
    if(loginStatus){
      const role = localStorage.getItem('role')
      const id = role=='user' ? localStorage.getItem('userID') : 'admin'

      const newSocket = io(process.env.REACT_APP_BACKEND_BASE_URL,
        {query: {id }}
      )
      setSocket(newSocket);
    }else{
      socket?.disconnect()
      setSocket(null)
    }
  }, [loginStatus])

  ////////////////////// Pet Type Functions /////////////////////////////
  // Function to set the selected pet type
  const selectPetType = (petType) => {
    setSelectedPetType(petType);
  };

  // Function to reset the pet type (optional)
  const resetPetType = () => {
    setSelectedPetType(null);
  };
  ////////////////////////////////////////////////////////////////////////

  const fetchFood = async () => {
    try {
      const response = await axios.get(`/api/users/products/category/${selectedPetType}/food`);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const fetchToy = async () => {
    try {
      const response = await axios.get(`/api/users/products/category/${selectedPetType}/toys`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const fetchAccessories = async () => {
    try {
      const response = await axios.get(`/api/users/products/category/${selectedPetType}/accessories`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const fetchSubscription = async () => {
    try {
      const response = await axios.get(`/api/users/products/category/${selectedPetType}/subscriptions`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const response = await axios.get(`/api/users/products/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/users/${userID}/cart`);
      setCart(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const addToCart = async (productID) => {
    try {
      await axios.post(`/api/users/${userID}/cart`, { productID });
      const response = await axios.get(`/api/users/${userID}/cart`);
      setCart(response.data.data);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const removeFromCart = async (productID) => {
    try {
      await axios.delete(`/api/users/${userID}/cart/${productID}`);
      const response = await axios.get(`/api/users/${userID}/cart`);
      setCart(response.data.data);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleQuantity = async (cartID, quantityChange) => {
    const data = { id: cartID, quantityChange };
    try {
      await axios.put(`/api/users/${userID}/cart`, data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchWishlist = async () => {
    try {
      if (loginStatus) {
        const response = await axios.get(`/api/users/${userID}/wishlist`);
        setWishlist(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const addToWishlist = async (productID) => {
    try {
      await axios.post(`/api/users/${userID}/wishlist`, { productID });
      const response = await axios.get(`/api/users/${userID}/wishlist`);
      toast.success('Added to wishlist');
      setWishlist(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const removeFromWishlist = async (productID) => {
    try {
      await axios.delete(`/api/users/${userID}/wishlist/${productID}`);
      const response = await axios.get(`/api/users/${userID}/wishlist`);
      toast.success('Removed from wishlist');
      setWishlist(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePrice = (price) => `AUD ${Number(price).toLocaleString('en-IN')}`;

  const totalPrice = cart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const response = await axios.post(`/api/users/${userID}/payment`);
      const url = response.data.url;
      const confirmation = window.confirm('You are being redirected to the Stripe payment gateway. Continue?');
      if (confirmation) window.location.replace(url);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      await axios.get(`/api/users/payment/success`);
      setCart([]);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      navigate('/');
    }
  };

  return (
    <PetContext.Provider
      value={{
        socket,
        products,
        fetchProductDetails,
        fetchFood,
        fetchToy,
        fetchAccessories,
        fetchSubscription,
        fetchCart,
        addToCart,
        removeFromCart,
        handleQuantity,
        cart,
        loginStatus,
        setLoginStatus,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        wishlist,
        handlePrice,
        totalPrice,
        handleCheckout,
        fetchPaymentStatus,
        selectedPetType, // Providing pet type in context
        selectPetType,   // Function to select pet type
        resetPetType     // Function to reset pet type
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export { PetContext, PetProvider };

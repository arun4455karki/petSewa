import React, { useContext } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import { useNavigate, useLocation } from 'react-router-dom';
import { PetContext } from '../Context/Context';
import { Input } from '../Components/Input';
import { axios } from '../Utils/Axios';
import Button from '../Components/Button';
import toast from 'react-hot-toast';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoginStatus } = useContext(PetContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value;
    const loginData = { email, password };
    const isAdminLogin = location.pathname.startsWith('/admin/login')
    if (!email || !password) {
      return toast.error('Enter All the Inputs');
    }

    const endpoint = isAdminLogin ? '/api/admin/login' : '/api/users/login';

    try {
      console.log(endpoint)
      const response = await axios.post(endpoint, loginData);
      if(isAdminLogin){
        localStorage.setItem('role', 'admin')
        localStorage.setItem('adminID', response.data.data._id )
      }else{
        localStorage.setItem('role', 'user')
        localStorage.setItem('userID', response.data.data._id )
      }

      localStorage.setItem('name', response.data.data.name);
      localStorage.setItem('jwt_token', response.data.data.jwt_token);
      toast.success(response.data.message);
      setLoginStatus(true);
      navigate(isAdminLogin ? '/dashboard' : '/');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <MDBContainer className="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="mb-3 text-black">Welcome back</h1>

        <Input type="email" label="Email Address" name="email" />
        <Input type="password" label="Password" name="password" />

        <Button type="submit" className="mb-4 w-100" color="black">
          Log in
        </Button>

        <div className="pointer text-center">
          <p>
            Don't have an account?{' '}
            <span className="text-black fw-bold" onClick={() => navigate('/registration')}>
              Register
            </span>
          </p>
        </div>
      </form>
    </MDBContainer>
  );
}

export default Login;

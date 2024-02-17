import React, { useState } from 'react';
import { getRequest, postRequest, apiClient } from './Axios.js';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from './GlobalStateProvider';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useGlobalState();

  // const loginGoogleUser = async (event) => {
  //   event.preventDefault(); 
  //   try {
  //     const response = await getRequest('/auth/google', null);
  //     if (response.status === 200) {
  //       setUser(response.data.user);
  //       navigate('/home');
  //     }
  //   } catch (err) {
  //     setError('Error logging in');
  //   }
  // };

  const loginLocalUser = async (event) => {
    event.preventDefault(); 
    try {
      const response = await postRequest('/auth/login', { email: email, pw: password });
      if (response.status === 200) {
        setUser(response.data.user); 
        localStorage.setItem('loggedIn', true);
        navigate('/home');
        
      } else if (response.status === 400){
        setError(response.data.error);
      }
    } catch (err) {
      setError('Error logging in');
    }
  };

  return (
    <section className="container-fluid vh-100">
      
      <div className="row d-flex justify-content-center align-items-center h-100">
        
        <div className="col-sm-8 d-flex justify-content-center align-items-center">
          
          <div className="card w-50" style={{ borderRadius: "1rem", minWidth: '360px' }}>
            
            <div className="card-body ">
              
              <h3 className="mb-4 text-center">Login</h3>
              
              {error && <p className="text-danger text-center">{error}</p>}
              
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">Email</label>
                <input type="text" id="email" name="email" required className="form-control form-control-md"  onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-outline mb-2">
                <label className="form-label" htmlFor="password">Password</label>
                <input type="password" id="password" name="pw" required className="form-control form-control-md"  onChange={(e) => setPassword(e.target.value)} />
              </div>
              
              <div className="col text-center m-">
                <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={loginLocalUser} value="Login"/>
              </div>
              
              <hr className="my-2" />
              
              <div className="text-center">
                Don't have an account? <a href="/register" className="text-blue-500">Register</a>
              </div>
            
            </div>
        
          </div>
        
        </div>
      
      </div>
    
    </section>
  );
};

export default Login;

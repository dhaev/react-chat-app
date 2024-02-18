import React, { useState, useEffect } from 'react';
import { postRequest } from './Axios.js';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from './GlobalStateProvider';
import { validateEmail, validatePassword } from './validations.js'; // Import the validation functions

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(''); // Add state for email error
  const [passwordError, setPasswordError] = useState(''); // Add state for password error
  const [formSubmitted, setFormSubmitted] = useState(false); // Add state for form submission
  const navigate = useNavigate();
  const { setUser } = useGlobalState();

  // useEffect(() => {
  //   if (formSubmitted) { // Only validate if form has been submitted
  //   setEmailError(validateEmail(email));
  //   setPasswordError(validatePassword(password));
  // }
  // }, [email, password,formSubmitted]);

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
    event.stopPropagation()
    // setFormSubmitted(true);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    console.log((emailErr || passwordErr))
    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      // setError('Please correct the errors before submitting.');
      return;
    } else {
      try {
        console.log("sending req")
        const response = await postRequest('/auth/login', { email: email, pw: password });
        if (response.status === 200) {
          setUser(response.data.user);
          localStorage.setItem('loggedIn', true);
          navigate('/home');
        } else if (response.status === 400) {
          setError(response.data.error);
        }
      } catch (err) {
        setError('logging attempt failed');
      }
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
                <label className={`form-label ${emailError ? 'error' : ''}`} htmlFor="email">
                  {emailError || 'Email'}
                </label>
                <input type="text" id="email" name="email" className={`form-control form-control-md ${emailError ? 'error-border' : ''}`} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-outline mb-2">
                <label className={`form-label ${passwordError ? 'error' : ''}`} htmlFor="password">
                  {passwordError || 'Password'}
                </label>
                <input type="password" id="password" name="pw" className={`form-control form-control-md ${passwordError ? 'error-border' : ''}`} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="col text-center m-">
                <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={loginLocalUser} value="Login" />
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

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../Utils/Axios.js';
import { LOGIN_USER } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';
import { validateEmail, validatePassword } from '../Utils/validations.js';

function Login() {
  const email = useRef('');
  const password = useRef('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useGlobalState();

  const handleLoginLocalUser = async (event) => {
    event.preventDefault();
    event.stopPropagation()

    const emailErr = validateEmail(email.current.value);
    const passwordErr = validatePassword(password.current.value,'Password');

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    } else {
      try {
        const response = await postRequest(LOGIN_USER, { email: email.current.value, pw: password.current.value });
        if (response.status === 200) {
          setUser(response.data.user);
          localStorage.setItem('loggedIn', true);
          navigate('/home');
        } else if (response.status === 400) {
          setError(response.data.error);
        }
      } catch (err) {
        setError('Log-in attempt failed due to incorrect email or password');
      }
    }
  };

  return (
    <section className="container-fluid vh-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-sm-8 d-flex justify-content-center align-items-center">
          <div className="card w-50" >
            <div className="card-body ">
              <h3 className="mb-4 text-center">Login</h3>
              {error && <p className="text-danger text-center">{error}</p>}
              <div className="form-outline mb-4">
                <label className={`form-label ${emailError ? 'error' : ''}`} htmlFor="email">
                  {emailError || 'Email'}
                </label>
                <input type="text" id="email" name="email" className={`form-control form-control-md ${emailError ? 'error-border' : ''}`} ref={email} />
              </div>
              <div className="form-outline mb-2">
                <label className={`form-label ${passwordError ? 'error' : ''}`} htmlFor="password">
                  {passwordError || 'Password'}
                </label>
                <input type="password" id="password" name="pw" className={`form-control form-control-md ${passwordError ? 'error-border' : ''}`} ref={password} />
              </div>
              <div className="col text-center m-">
                <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={handleLoginLocalUser} value="Login" />
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

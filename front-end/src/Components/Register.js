import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../Utils/Axios.js';
import { REGISTER_USER  } from '../Utils/apiEndpoints';
import { validateUsername, validateEmail, validatePassword } from '../Utils/validations'; // Import the validation functions

const Register = () => {

    const username = useRef('');
    const email = useRef('');
    const password = useRef('');
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState(''); // Add state for username error
    const [emailError, setEmailError] = useState(''); // Add state for email error
    const [passwordError, setPasswordError] = useState(''); // Add state for password error
    const navigate = useNavigate();

    const handleRegisterLocalUser = async (event) => {
        event.preventDefault();

        const emailErr = validateEmail(email.current.value);
        const passwordErr = validatePassword(password.current.value,'Password');
        const usernameErr = validateUsername(username.current.value);
        if (emailErr || passwordErr || usernameErr) {
            setEmailError(emailErr);
            setPasswordError(passwordErr);
            setUsernameError(usernameErr);
            return;
        }
        try {
            const response = await postRequest(REGISTER_USER , { uname: username.current.value, email: email.current.value, pw: password.current.value });
            if (response.status === 200) {
                navigate('/login'); // Redirect to Login component
            } else if (response.status === 400) {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <section className="container-fluid vh-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-sm-8 d-flex justify-content-center align-items-center">
                    <div className="card w-50 border">
                        <div className="card-body ">
                            <h3 className="mb-4 text-center">Register</h3>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <div className="form-outline mb-2">
                                <label className={`form-label ${usernameError ? 'error' : ''}`} htmlFor="username">
                                    {usernameError || 'Name'}
                                </label>
                                <input type="text" id="username" name="uname" className={`form-control form-control-md ${usernameError ? 'error-border' : ''}`} ref={username} />
                            </div>
                            <div className="form-outline mb-2">
                                <label className={`form-label ${emailError ? 'error' : ''}`} htmlFor="email">
                                    {emailError || 'Email'}
                                </label>
                                <input type="email" id="email" name="email" className={`form-control form-control-md ${emailError ? 'error-border' : ''}`} ref={email} />
                            </div>
                            <div className="form-outline mb-2">
                                <label className={`form-label ${passwordError ? 'error' : ''}`} htmlFor="password">
                                    {passwordError || 'Password'}
                                </label>
                                <input type="password" id="password" name="pw" className={`form-control form-control-md ${passwordError ? 'error-border' : ''}`} ref={password} />
                            </div>

                            <div className="col text-center m-">
                                <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={handleRegisterLocalUser} value="Register" />
                            </div>

                            <hr className="my-2" />
                            <div className="text-center">
                                Already have an account? <a href="/login" className="text-blue-500">Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;


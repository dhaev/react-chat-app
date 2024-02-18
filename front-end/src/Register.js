import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRequest } from './Axios.js';
import { validateUsername, validateEmail, validatePassword } from './validations'; // Import the validation functions

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState(''); // Add state for username error
    const [emailError, setEmailError] = useState(''); // Add state for email error
    const [passwordError, setPasswordError] = useState(''); // Add state for password error
    const navigate = useNavigate();

    // const registerGoogleUser = async (event) => {
    //     event.preventDefault();
    //     try {
    //         const response = await getRequest('/auth/google', null);
    //         if (response.status === 200) {
    //             setUser(response.data.user);
    //             navigate('/login'); // Redirect to Login component
    //         } else if (response.status === 400) {
    //             setError(response.data.error);
    //         }
    //     } catch (err) {
    //         setError('Error registering user');
    //     }
    // };

    const registerLocalUser = async (event) => {
        event.preventDefault();


        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        const usernameErr = validateUsername(username);
        console.log((emailErr || passwordErr))
        if (emailErr || passwordErr || usernameErr) {
            setEmailError(emailErr);
            setPasswordError(passwordErr);
            setUsernameError(usernameErr);
            // setError('Please correct the errors before submitting.');
            return;
        }
        try {
            const response = await postRequest('/auth/register', { uname: username, email: email, pw: password });
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
                    <div className="card w-50" style={{ borderRadius: "1rem", minWidth: '360px' }}>
                        <div className="card-body ">
                            <h3 className="mb-4 text-center">Register</h3>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <div className="form-outline mb-2">
                                <label className={`form-label ${usernameError ? 'error' : ''}`} htmlFor="username">
                                    {usernameError || 'Name'}
                                </label>
                                <input type="text" id="username" name="uname" className={`form-control form-control-md ${usernameError ? 'error-border' : ''}`} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="form-outline mb-2">
                                <label className={`form-label ${emailError ? 'error' : ''}`} htmlFor="email">
                                    {emailError || 'Email'}
                                </label>
                                <input type="email" id="email" name="email" className={`form-control form-control-md ${emailError ? 'error-border' : ''}`} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-outline mb-2">
                                <label className={`form-label ${passwordError ? 'error' : ''}`} htmlFor="password">
                                    {passwordError || 'Password'}
                                </label>
                                <input type="password" id="password" name="pw" className={`form-control form-control-md ${passwordError ? 'error-border' : ''}`} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="col text-center m-">
                                <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={registerLocalUser} value="Register" />
                            </div>
                            <hr className="my-2" />
                            {/* <div className="text-center">
                                    or sign in with 
                                </div>
                                <div className="col form-outline text-center">
                                <button className="btn btn-sm align-self-center" type="submit" onClick={registerGoogleUser}>
                                    <img src="https://image.similarpng.com/very-thumbnail/2020/12/Flat-design-Google-logo-design-Vector-PNG.png" alt="Google logo" className="sign-in-logo" />
                                </button>
                                </div> */}

                            <div className=" text-center">
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

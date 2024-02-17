import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest, postRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

const Register = () => {
    const { setUser } = useGlobalState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
        try {
            const response = await postRequest('/auth/register', { uname: username, email: email, pw: password });
            if (response.status === 200) {
                navigate('/login'); // Redirect to Login component
            } else if (response.status === 400) {
                setError(response.data.message);
            }
        } catch (err) {
            err.response.data.error.msg ? setError(err.response.data.error.msg) : setError('Error registering user');
        }
    };

    return (
        <section className="container-fluid vh-100">

            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-sm-8 d-flex justify-content-center align-items-center">
                    <div className="card w-50" style={{ borderRadius: "1rem", minWidth: '360px' }}>
                        <div className="card-body ">

                            <h3 className="mb-4 text-center">Register</h3>

                            {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}

                            <div className="form-outline mb-2">
                                <label className="form-label" htmlFor="username">Name</label>
                                <input type="text" id="username" name="uname" required className="form-control form-control-md" onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className="form-outline mb-2">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" required className="form-control form-control-md" onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="form-outline mb-2">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input type="password" id="password" name="pw" required className="form-control form-control-md" onChange={(e) => setPassword(e.target.value)} />
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

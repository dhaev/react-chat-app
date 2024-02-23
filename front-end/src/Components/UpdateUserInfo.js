import React, { useRef, useState } from 'react';
import { putRequest } from '../Utils/Axios.js';
import { useGlobalState } from '../Provider/GlobalStateProvider.js';
import { validateUsername, validateEmail } from '../Utils/validations.js'; // Import the validation functions
import { UPDATE_USER_INFO } from '../Utils/apiEndpoints.js'
const UpdateUserInfo = () => {
    const { user, setUser } = useGlobalState();
    const username = useRef(user.displayName);
    const email = useRef(user.email);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState(''); // Add state for username error
    const [emailError, setEmailError] = useState(''); // Add state for email error


    const handleEditUserInfo = async (event) => {
        event.preventDefault();

        email.current.value = !email.current.value.trim() ? user.email : email.current.value.trim()
        username.current.value = !username.current.value.trim() ? user.displayName : username.current.value.trim()

        const emailErr = validateEmail(email.current.value);
        const usernameErr = validateUsername(username.current.value);


        if (usernameErr || emailErr) {
            setUsernameError(usernameErr);
            setEmailError(emailErr);
            return;
        }
        if (email.current.value.trim() === user.email && username.current.value.trim() === user.displayName) {
            username.current.value = ''
            email.current.value = ''
            return;
        }
        try {
            const response = await putRequest(UPDATE_USER_INFO, { uname: username.current.value, email: email.current.value });
            if (response.status === 200) {
                setUser({ ...user, displayName: username.current.value, email: email.current.value });
                username.current.value = ''
                email.current.value = ''
            } else if (response.status === 400) {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error && err.response.data.error.msg) {
                setError(err.response.data.error.msg);
            } else {
                setError('Error updating user');
            }
        }
    };

    return (
        <>
            {error && <p className="text-danger">{error}</p>}
            <div className="form-outline mb-2 d-flex flex-column">
                <label className={`form-label ${usernameError ? 'error' : ''}`} htmlFor="username">
                    {usernameError || 'Name'}
                </label>
                <input type="text" id="username" name="uname" className={`form-control form-control-md ${usernameError ? 'error-border' : ''}`} ref={username} placeholder={user.displayName} />
            </div>
            <div className="form-outline mb-2 col d-flex flex-column">
                <label className={`form-label ${emailError ? 'error' : ''}`} htmlFor="email">
                    {emailError || 'Email'}
                </label>
                <input type="email" id="email" name="email" className={`form-control form-control-md ${emailError ? 'error-border' : ''}`} ref={email} placeholder={user.email} />
            </div>

            <div className="col text-center ">
                <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={handleEditUserInfo} value="Save" />
            </div>
        </>
    )
};

export default UpdateUserInfo;
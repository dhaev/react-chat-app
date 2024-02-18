import React, { useState } from 'react';
import { putRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider.js';
import { validateUsername, validateEmail } from './validations'; // Import the validation functions

const UpdateProfile = () => {
    const { user, setUser } = useGlobalState();
    const [username, setUsername] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);
    const [error, setError] = useState('');
    const [imgError, setImgError] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [usernameError, setUsernameError] = useState(''); // Add state for username error
    const [emailError, setEmailError] = useState(''); // Add state for email error


    const editUserInfo = async (event) => {
        event.preventDefault();

        const emailErr = validateEmail(email);
        const usernameErr = validateUsername(username);

        if (usernameErr || emailErr) {
            setUsernameError(usernameErr);
            setEmailError(emailErr);
            // setError('Please correct the errors before submitting.');
            return;
        }
        try {
            const response = await putRequest('/home/updateUserInfo', { uname: username, email: email });
            if (response.status === 200) {
                setUser({ ...user, displayName: username, email: email });
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

    const updateUserImage = async (event) => {
        event.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('userId', user._id);

            try {
                // Send the form data with the PUT request
                const response = await putRequest('/home/updateUserImage', formData);
                if (response.status === 200) {
                    setUser({ ...user, image: response.data.image });
                    setSelectedFile('')
                    setImgError('')
                } else if (response.status === 400) {
                    setImgError(response.data.message);
                }
                // Handle the response as needed
            } catch (err) {
                setImgError('Failed to update user image');
            }
        } else {
            setImgError('No file selected');
        }
    };

    return (
        <section className="container-sm vh-100 d-flex p-2 justify-content-center align-items-center">
            <div className="col-9 d-flex p-2 justify-content-center align-items-center"> {/* Adjust the column size here */}
                <div className="card w-50 border-0" style={{ minWidth: '360px' }}>
                    <div className="card-body flex-column d-flex">
                        <div className="container-sm justify-content-center align-items-center">
                            <div className="d-flex justify-content-center align-items-center mb-3">
                                <img src={'http://192.168.2.19:5000/' + user.image} alt="" className="img-fluid edit-avatar" />
                            </div>
                            {imgError && <p className="text-danger text-center">{imgError}</p>}
                            <div className="input-group d-flex justify-content-center mb-5 ">
                                <input className="form-control-file form-control" type='file' name='image' onChange={(e) => setSelectedFile(e.target.files[0])} />
                                <button className="btn btn-primary btn-md ml-2" type="submit" onMouseDown={updateUserImage}>Save</button>
                            </div>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="form-outline mb-2 d-flex flex-column">
                            <label className={`form-label ${usernameError ? 'error' : ''}`} htmlFor="username">
                                {usernameError || 'Name'}
                            </label>
                            <input type="text" id="username" name="uname" className={`form-control form-control-md ${usernameError ? 'error-border' : ''}`} onChange={(e) => setUsername(e.target.value)} value={username} />
                        </div>
                        <div className="form-outline mb-2 col d-flex flex-column">
                            <label className={`form-label ${emailError ? 'error' : ''}`} htmlFor="email">
                                {emailError || 'Email'}
                            </label>
                            <input type="email" id="email" name="email" className={`form-control form-control-md ${emailError ? 'error-border' : ''}`} onChange={(e) => setEmail(e.target.value)} value={email} />
                        </div>

                        <div className="col text-center ">
                            <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={editUserInfo} value="Save" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdateProfile;

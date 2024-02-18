import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { putRequest } from './Axios.js';
import { validatePassword } from './validations'; // Import the validation function

const UpdatePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState(''); // Add state for old password error
    const [newPasswordError, setNewPasswordError] = useState(''); // Add state for new password error


    const updatePassword = async (event) => {
        event.preventDefault();

        const oldPasswordErr = validatePassword(oldPassword,'Old password')
        const newPasswordErr = validatePassword(newPassword, 'New password')
        if (oldPasswordErr || newPasswordErr) {
            setOldPasswordError(oldPasswordErr);
            setNewPasswordError(newPasswordErr);
            // setError('Please correct the errors before submitting.');
            return;
        }
        try {
            // const response =
            const response = await putRequest('/home/updateUserInfo', { newPassword, oldPassword });
            if (response.status === 200) {
                navigate('/login'); // Redirect to Login component
            }else{
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to update password');
        }
    };

    return (
        <section className="container-sm vh-100 d-flex p-2 justify-content-center align-items-center">
            <div className="col-9 d-flex p-2 justify-content-center align-items-center"> {/* Adjust the column size here */}
                <div className="card w-50 border-0" style={{ minWidth: '360px' }}>
                    <div className="card-body flex-column d-flex">
                        {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}
                        <div className="form-outline mb-2 ">
                            <label className={`form-label ${oldPasswordError ? 'error' : ''}`} htmlFor="oldpassword">
                                {oldPasswordError || 'Old Password'}
                            </label>
                            <input type="password" id="oldpassword" name="oldPassword" className={`form-control form-control-md ${oldPasswordError ? 'error-border' : ''}`} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                        <div className="form-outline mb-2">
                            <label className={`form-label ${newPasswordError ? 'error' : ''}`} htmlFor="newpassword">
                                {newPasswordError || 'New Password'}
                            </label>
                            <input type="password" id="newpassword" name="newpassword" className={`form-control form-control-md ${newPasswordError ? 'error-border' : ''}`} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <div className="col text-center m-">
                            <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={updatePassword} value="Save" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdatePassword;

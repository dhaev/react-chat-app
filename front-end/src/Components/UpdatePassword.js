// React related imports
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Third-party libraries
import { putRequest } from '../Utils/Axios.js';
import { UPDATE_USER_PASSWORD } from '../Utils/apiEndpoints';
import { validatePassword } from '../Utils/validations.js';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const oldPassword = useRef('');
    const newPassword = useRef('');
    const [error, setError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');

    const handleUpdatePassword = async (event) => {
        event.preventDefault();

        const oldPasswordErr = validatePassword(oldPassword.current.value, 'Old password')
        const newPasswordErr = validatePassword(newPassword.current.value, 'New password')
        if (oldPasswordErr || newPasswordErr) {
            setOldPasswordError(oldPasswordErr);
            setNewPasswordError(newPasswordErr);
            return;
        }
        try {
            const response = await putRequest(UPDATE_USER_PASSWORD, { newPassword: newPassword.current.value, oldPassword: oldPassword.current.value });
            if (response.status === 200) {
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to update password');
        }
    };

    return (
        <section className="container-sm vh-100 d-flex p-2 justify-content-center align-items-center">
            <div className="col-9 d-flex p-2 justify-content-center align-items-center">
                <div className="card w-50 border-0" >
                    <div className="card-body flex-column d-flex">
                        {error && <p className="text-danger text-center">{error}</p>}
                        <div className="form-outline mb-2 ">
                            <label className={`form-label ${oldPasswordError ? 'error' : ''}`} htmlFor="oldpassword">
                                {oldPasswordError || 'Old Password'}
                            </label>
                            <input type="password" id="oldpassword" name="oldPassword" className={`form-control form-control-md ${oldPasswordError ? 'error-border' : ''}`} ref={oldPassword} />
                        </div>
                        <div className="form-outline mb-2">
                            <label className={`form-label ${newPasswordError ? 'error' : ''}`} htmlFor="newpassword">
                                {newPasswordError || 'New Password'}
                            </label>
                            <input type="password" id="newpassword" name="newpassword" className={`form-control form-control-md ${newPasswordError ? 'error-border' : ''}`} ref={newPassword} />
                        </div>

                        <div className="col text-center m-">
                            <input className="btn btn-primary btn-md form-control form-control-md " type="submit" onClick={handleUpdatePassword} value="Save" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdatePassword;

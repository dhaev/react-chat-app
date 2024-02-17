import React, { useState } from 'react';
import { putRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider.js';

const UpdatePassword = () => {
    const { user } = useGlobalState();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

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

    const updatePassword= async (event) => {
        event.preventDefault();
        try {
            // const response =
             await putRequest('/home/updateUserInfo', { newPassword, oldPassword });
            // if (response.status === 200) {
            //     navigate('/login'); // Redirect to Login component
            // }else if(response.status === 400){
            //     setError(response.data.message);
            // }
        } catch (err) {
            err.response.data.error.msg ? setError(err.response.data.error.msg) : setError('Error registering user');
        }
    };


    return (
<section className="container-sm vh-100 d-flex p-2 justify-content-center align-items-center">

        <div className="col-9 d-flex p-2 justify-content-center align-items-center"> {/* Adjust the column size here */}
            <div className="card w-50 border-0" style={{ minWidth: '360px'}}>
                <div className="card-body flex-column d-flex">                   

                    {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}

                    <div className="form-outline mb-2 ">
                                <label className="form-label" htmlFor="oldpassword">Old Password</label>
                                <input type="password" id="oldpassword" name="oldPassword" required className="form-control form-control-md" onChange={(e) => setOldPassword(e.target.value)} />
                            </div>
                            <div className="form-outline mb-2">
                                <label className="form-label" htmlFor="newpassword">New Password</label>
                                <input type="password" id="newpassword" name="newpassword" required className="form-control form-control-md" onChange={(e) => setNewPassword(e.target.value)} />
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

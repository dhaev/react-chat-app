import React, { useState } from 'react';
import { putRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider.js';

const UpdateProfile = () => {
    const { user, setUser } = useGlobalState();
    const [username, setUsername] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState('');

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

    // Utility function to handle errors in async/await
    const handleAsyncErrors = (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        };

    const editUserInfo = handleAsyncErrors(async (event) => {
        event.preventDefault();

        // Trim the username and email to remove leading/trailing white spaces
        let trimmedUsername = username.trim();
        let trimmedEmail = email.trim();

        // Set default values if trimmed username or email are empty strings
        if (trimmedUsername === "") trimmedUsername = user.displayName;
        if (trimmedEmail === "") trimmedEmail = user.email;

        // Check if default values are also empty, then return an error
        if (trimmedUsername === "" || trimmedEmail === "") {
            setError('Username and email cannot be empty');
            return;
        }

        try {
            const response = await putRequest('/home/updateUserInfo', { userId: user._id, uname: trimmedUsername, email: trimmedEmail });
            if (response.status === 200) {
                setUser({ ...user, displayName: trimmedUsername, email: trimmedEmail });
            } else if (response.status === 400) {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error && err.response.data.error.msg) {
                setError(err.response.data.error.msg);
            } else {
                setError('Error registering user');
            }
        }
    });

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
                } else if (response.status === 400) {
                    setError(response.data.message);
                }
                // Handle the response as needed
            } catch (err) {
                err.response.data.error.msg ? setError(err.response.data.error.msg) : setError('Error updating user image');
            }
        } else {
            setError('No file selected');
        }
    };

    return (
        
        <section className="container-sm vh-100 d-flex p-2 justify-content-center align-items-center">
            
            <div className="col-9 d-flex p-2 justify-content-center align-items-center"> {/* Adjust the column size here */}
                
                <div className="card w-50 border-0" >
                    
                    <div className="card-body flex-column d-flex">
                        
                        <div className="container-sm justify-content-center align-items-center">
                            
                            <div className="d-flex justify-content-center align-items-center mb-3">
                                <img src={'http://192.168.2.19:5000/' + user.image} alt="" className="img-fluid edit-avatar" />
                            </div>

                            <div className="input-group d-flex justify-content-center mb-5 mt-1">
                                <input className="form-control-file form-control" type='file' name='image' onChange={(e) => setSelectedFile(e.target.files[0])} />
                                <button className="btn btn-primary btn-md ml-2" type="submit" onMouseDown={updateUserImage}>Save</button>
                            </div>


                        </div>
                        {error && <p className="text-danger">{error}</p>} {/* Display error message */}

                        <div className="form-outline mb-2 d-flex  flex-column ">
                            <label className="form-label" htmlFor="username">Name</label>
                            <input type="text" id="username" name="uname" required className="form-control form-control-md" onChange={(e) => setUsername(e.target.value)} value={username} />
                        </div>

                        <div className="form-outline mb-2 col d-flex flex-column">
                            <label className="form-label " htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required className="form-control form-control-md " onChange={(e) => setEmail(e.target.value)} value={email} />
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

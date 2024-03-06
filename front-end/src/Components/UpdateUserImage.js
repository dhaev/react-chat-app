import React, { useRef, useState } from 'react';
import { putRequest } from '../Utils/Axios.js';
import { useGlobalState } from '../Provider/GlobalStateProvider.js';

const UpdateUserImage = () => {
    const { user, setUser } = useGlobalState();
    const [imgError, setImgError] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const refImage = useRef();



    const handleUpdateUserImage = async (event) => {
        event.preventDefault();

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('userId', user._id);

            try {
                const response = await putRequest('/home/updateUserImage', formData);
                if (response.status === 200) {
                    setUser({ ...user, image: response.data.image });
                    setSelectedFile('')
                    refImage.current.value = '';
                } else if (response.status === 400) {
                    setImgError(response.data.message);
                }
            } catch (err) {
                setImgError('Failed to update user image');
            }
        } else {
            setImgError('No file selected');
        }

    }
    return (
        <div className="container-sm justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center mb-3">
                <img src={'http://localhost:5000/' + user.image} alt="" className="img-fluid edit-avatar" />
            </div>
            {imgError && <p className="text-danger text-center">{imgError}</p>}
            <div className="input-group d-flex justify-content-center mb-5 ">
                <input className="form-control-file form-control" type='file' name='image' ref={refImage} onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button className="btn btn-primary btn-md ml-2" type="submit" onMouseDown={handleUpdateUserImage}>Save</button>
            </div>
        </div>
    )
};

export default UpdateUserImage;
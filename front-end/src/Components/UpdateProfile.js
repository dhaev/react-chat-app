import UpdateUserImage from './UpdateUserImage'
import UpdateUserInfo from './UpdateUserInfo'
const UpdateProfile = () => {
    

    return (
        <section className="container-sm vh-100 d-flex p-2 justify-content-center align-items-center">
            <div className="col-9 d-flex p-2 justify-content-center align-items-center">
                <div className="card w-50 border-0" >
                    <div className="card-body flex-column d-flex">
                        <UpdateUserImage />
                        <UpdateUserInfo />                        
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdateProfile;

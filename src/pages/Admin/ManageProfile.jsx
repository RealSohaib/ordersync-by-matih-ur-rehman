// ManageProfile.js
import Layout from "./Layout";
import { useEffect, useState } from "react";
import Modal from '../../components/Modle';
import axios from 'axios';
import UserProfile from '../../components/profile'; // Import the new UserProfile component
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const ManageProfile = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState({});
    const [toggler, setToggler] = useState({
        editUser: false,
        deleteConfirmation: false,
    });

    useEffect(() => {
        const userCookie = cookies.get('user');
        if (userCookie) {
            setUser(userCookie);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const removeCookies = () => {
        cookies.remove(['user']);
        navigate("/login");
    };

    const makeChanges = async () => {
        try {
            await axios.put(`${url}/changepassword/${user._id}`, edit); // Send edited data
            setUser((prevUser) => ({ ...prevUser, ...edit })); // Update user state
            setToggler({ ...toggler, editUser: false });
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleEdit = (user) => {
        setEdit(user);
        setToggler((prevState) => ({ ...prevState, editUser: true }));
    };

    return (
        <Layout>
            <div className='flex-col items-center justify-center w-full h-full border-2 border-black '>
                <div className="w-full flex justify-between rounded-xl items-center py-3 px-3 mb-1 shadow-lg bg-white">
                    <h1 className="font-bold text-4xl">Dashboard</h1>
                    <button
                        className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-matte-red transition-all hover:bg-red-800 rounded-lg h-[60px]"
                        onClick={removeCookies}
                    >
                        Logout
                    </button>
                </div>

<div className="my-[3rem] flex-col items-center justify-center">

                <UserProfile user={user} onEdit={handleEdit} />
</div>

                <Modal
                    isOpen={toggler.editUser}
                    onClose={() => setToggler({ ...toggler, editUser: false })}
                    title={"Edit User Credentials"}
                    btnTitle={"Edit User"}
                    onClick={makeChanges} // Submit changes on button click
                >
                    <div>
                        <div className="flex flex-col items-start gap-y-3">
                            <label htmlFor="username" className="text-sm font-medium cursor-pointer">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={edit.username || ""}
                                onChange={(e) => setEdit({ ...edit, username: e.target.value })}
                                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                                placeholder="username"
                            />
                        </div>
                        <div className="flex flex-col items-start gap-y-3">
                            <label htmlFor="password" className="text-sm font-medium cursor-pointer">
                                Password
                            </label>
                            <input
                                id="password"
                                type="text"
                                value={edit.password || ""}
                                onChange={(e) => setEdit({ ...edit, password: e.target.value })}
                                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                                placeholder="password"
                            />
                        </div>
                        <div className="flex flex-col items-start gap-y-3">
                            <label htmlFor="duty" className="text-sm font-medium cursor-pointer">
                                Duty
                            </label>
                            <input
                                id="duty"
                                type="text"
                                value={edit.duty || ""}
                                onChange={(e) => setEdit({ ...edit, duty: e.target.value })}
                                className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
                                placeholder="duty"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
};

export default ManageProfile;

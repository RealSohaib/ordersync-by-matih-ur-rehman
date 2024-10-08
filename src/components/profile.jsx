// UserProfile.js
import { FaEdit } from 'react-icons/fa';
import Avatar from '@mui/material/Avatar';

const UserProfile = ({ user, onEdit }) => {
    return (
        <div className='flex flex-col items-center justify-center
          container rounded-lg  '>
            <div className='
             flex flex-col bg-white hover:transition-all hover:shadow-lg items-center justify-center border-2 borde-black rounded-lg px-4 py-2'>
            <Avatar
                variant="circle"
                src={user?.profile || ""}
                alt={user?.profile || "Profile Image"}
                sx={{ width: 100, height: 100 }}
                className='mb-4' // Space between avatar and user info
            />
            <div className='flex flex-col items-start w-full'>
                {['username', 'password', 'role', 'salary', 'duty'].map((field) => (
                    <div key={field} className='flex justify-between items-center w-full mb-2'>
                        <h1 className='text-lg font-semibold'>
                            {field.charAt(0).toUpperCase() + field.slice(1)}: {user[field]}
                        </h1>
                        <button
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            onClick={() => onEdit(user)}
                        >
                            <FaEdit />
                        </button>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

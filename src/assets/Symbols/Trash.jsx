import { FaTimes, FaTrash } from 'react-icons/fa';

const Trash = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <div className='text-2xl flex flex-cols items-center justify-center'>
        <FaTimes className='relative left-[1.20rem] text-white text-sm' />
        <FaTrash className='text-red-1' />
      </div>
    </button>
  );
};

export default Trash;

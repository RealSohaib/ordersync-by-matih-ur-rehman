import {  FaEdit } from 'react-icons/fa';

const Edit=({onClick})=>{
    return(
       <button onClick={onClick}>
      <div  className='text-green-400 text-2xl'>
        <FaEdit/>
      </div>
       </button>
  )
  }

export default Edit

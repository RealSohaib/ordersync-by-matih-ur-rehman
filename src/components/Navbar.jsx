
// import { useState } from "react";
// import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the toggle button

// export function Navbar({ children }) {
//   const [toggle, setToggle] = useState(false);

//   const ToggleBtn = () => {
//     setToggle(!toggle);
//   };

//   return (
//     <>
//       <div className={`fixed bg-black text-white ${toggle ? 'h-full w-full' : 'h-full w-full'}`}>
        
//           <button onClick={ToggleBtn} className="text-white text-2xl">
//             {toggle ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>
//         <div className={`${toggle ? 'block' : 'hidden'} md:block`}>
            
//               {children}
//         </div>
//     </>
// </div>
// </>
// );
// }
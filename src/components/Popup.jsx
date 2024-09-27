
const Popup = ({ children, className, onClick,Cross}) => {
    return (
        <div className={`fixed inset-0 
        w-full
        flex items-center justify-center z-50 ${className}`}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-xl container mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="relative bg-black border-2 border-black rounded-lg p-4 sm:p-6">
                   {Cross?
                   <button
                   onClick={onClick}
                   className="absolute top-2 right-2  translate-x-3 -translate-y-2.5  rounded-lg text-lg sm:text-xl font-bold bg-white transition-all hover:bg-matte-red hover:text-white text-red-500 px-4 py-2 sm:px-6 sm:py-3">
                   X
               </button>
               :
               <></>
               }
                    
                    <div className="w-full bg-white border-2 border-black p-4 rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;

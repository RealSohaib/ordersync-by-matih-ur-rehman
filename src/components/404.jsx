
const Error = () => {
    function GoBack(){
        window.history.back()
    }
  return (
    <div className='flex flex-col items-center text-center justify-center mt-5 gap-4'>
        <h1 className={`flex items-center text-center justify-center font-bold text-6xl`}>404</h1>
        <button onClick={GoBack} className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">Go Back</button>
    </div>
  )
}

export default Error

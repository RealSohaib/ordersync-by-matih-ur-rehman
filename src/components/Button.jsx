export default function Button({children,className,href,red}){
    const SimpleBtn=()=>{
        return(<>
        <button  className={`inline-flex items-center justify-center px-8 
        py-4 font-sans font-semibold border-white border-2  
        tracking-wide text-white 
         rounded-lg h-[60px]  ${red?'bg-red-500':'bg-black'} ${className}`}>
                  {children? children :'Sample Button'}
                </button>
        </>)
    }
    const LinkBtn=()=>{
        return(<>
        <a href={href} className={`${className}inline-flex items-center justify-center px-8 
        py-4 font-sans font-semibold border-white border-2  
        tracking-wide text-white ${red?'bg-red-500':'bg-black'}
        bg-red-500 rounded-lg h-[60px] ${className}`}>
 {children? children :'Sample Ancor button'}
                </a>
        </>)
    }
    return(href?LinkBtn:SimpleBtn)
}
export default function SearchBar({ children, className }) 
{
    return(<>
    <div className={`w-full bg-matte-black ${className} flex items-center justify-center`}>
      {children}
    </div>
    </>
  );
}
  
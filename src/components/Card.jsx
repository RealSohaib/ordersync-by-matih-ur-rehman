
export default function OrderCard({ className, image, name, category, price, description, children }) {
  return (
    <div className={`
      ${className}
      transition-all
      hover:shadow-xl
      relative w-full max-w-xs mx-auto bg-white shadow-lg 
      rounded-lg overflow-hidden flex flex-col
    `}>
      {/* Image */}
      <img 
        src={image || '../assets/bg-img.jpg'} 
        alt={name || 'Default Name'} 
        className="w-full h-40 object-cover"
      />
      
      {/* Card Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Name */}
        <h1 className="text-xl sm:text-2xl font-bold">{name || 'Default Name'}</h1>
        
        {/* Category */}
        <h2 className="text-lg sm:text-xl text-gray-600">{category || 'Default Category'}</h2>
        
        {/* Description */}
        <p className="text-base sm:text-lg text-gray-800">{description || 'Default Description'}</p>
        
        {/* Price */}
        <p className="text-xl sm:text-2xl font-semibold">{price || '$0.00'}</p>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

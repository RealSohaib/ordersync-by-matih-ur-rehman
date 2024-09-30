const Card = ({ image, name, category, price, description, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <img 
        src={image || '/placeholder.svg?height=160&width=320'} 
        alt={name} 
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{category}</p>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        <p className="text-lg font-semibold mb-4">${price.toFixed(2)}</p>
        <div className="flex justify-between">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
export default Card;
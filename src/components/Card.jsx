import PropTypes from 'prop-types';
const Card = ({ image, name, category, descreption, price, children }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={image} alt={name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="mt-2 text-sm">{descreption}</p>
      <p className="mt-2 text-lg font-bold">${price.toFixed(2)}</p>
      <div className="mt-4 flex justify-between">{children}</div>
    </div>
  </div>
);

Card.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  descreption: PropTypes.string,
  price: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};
export default Card
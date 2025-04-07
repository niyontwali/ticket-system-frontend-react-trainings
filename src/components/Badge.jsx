import PropTypes from 'prop-types';

const Badge = ({ type, value }) => {
  const variants = {
    status: {
      open: "bg-blue-100 text-blue-800",
      "in_progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
    },
    priority: {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    }
  };

  const variantClasses = variants[type]?.[value] || "bg-gray-100 text-gray-800";

  const displayText = type === 'status' 
    ? value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variantClasses}`}>
      {displayText}
    </span>
  );
};

Badge.propTypes = {
  type: PropTypes.oneOf(['status', 'priority']).isRequired,
  value: PropTypes.string.isRequired
};

export default Badge;
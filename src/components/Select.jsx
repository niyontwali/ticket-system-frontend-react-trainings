import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <select
        className={`appearance-none bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-8 py-2 text-base focus:outline-none focus-visible:ring focus-visible:ring-offset-1 focus-visible:ring-primary/20  w-full ${Icon ? "pl-10" : "pl-3"
          }`}
        value={value}
        onChange={onChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown size="16" className='text-gray-500'/>
      </div>
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string
};

export default Select;
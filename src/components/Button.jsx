import { Loader2 } from "lucide-react";
import React from "react";

const Button = ({
  type = "button",
  variant = "primary",
  size = "default",
  content,
  icon,
  iconPosition = "left",
  onClick,
  isLoading = false,
  loadingText,
  disabled = false,
  className = "",
  ...props
}) => {
  // Define variant styles - fixed missing hover states and using proper Tailwind classes
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-gray-200 text-gray-600 hover:bg-gray-300",
    outline: "border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-100",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    link: "bg-transparent text-primary underline-offset-4 hover:underline",
    muted: "bg-gray-100 text-gray-700 hover:bg-gray-200"
  };

  // Define size styles - fixed to use proper Tailwind utility classes
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3 text-base",
    icon: "h-10 w-10 p-2"
  };

  // Safety check: Ensure the selected variant and size exist, fall back to defaults if not
  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const sizeStyle = sizeStyles[size] || sizeStyles.default;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-primary/20 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantStyle} ${sizeStyle} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2" size="16" />
          {loadingText || content}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {content}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
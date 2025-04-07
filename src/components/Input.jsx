import React from "react";

const Input = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  label,
  error,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className="grid gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`flex h-10 w-full rounded-md border ${error ? "border-danger focus-visible:ring-danger/20 " : "border-input focus-visible:ring-primary/20"} 
            bg-background ${Icon ? "pl-10" : "pl-3"} pr-3 py-2 text-sm text-foreground
            ring-offset-background focus-visible:outline-none focus-visible:ring 
           focus-visible:ring-offset-1
            placeholder:text-muted-foreground disabled:opacity-50
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};

export default Input;
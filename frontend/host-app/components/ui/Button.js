import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      disabled = false,
      type = "button",
      onClick,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      warning:
        "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
      info: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
      outline:
        "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
    };

    const sizeStyles = {
      small: "py-1 px-3 text-xs",
      medium: "py-2 px-4 text-sm",
      large: "py-3 px-6 text-base",
    };

    const widthStyles = fullWidth ? "w-full" : "";
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    const buttonClasses = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${widthStyles} 
    ${disabledStyles} 
    ${className}
  `;

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

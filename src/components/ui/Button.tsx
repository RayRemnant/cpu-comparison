import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
    outline:
      "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-md",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyle}
    ${className}
  `.trim();

  return (
    <button {...props} className={combinedClassName}>
      {Icon && iconPosition === "left" && (
        <Icon className="-ml-1 mr-2 h-5 w-5" />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className="-mr-1 ml-2 h-5 w-5" />
      )}
    </button>
  );
};

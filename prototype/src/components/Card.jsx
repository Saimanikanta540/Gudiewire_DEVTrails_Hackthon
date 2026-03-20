export function Card({ children, className = "", variant = "default" }) {
  const baseStyles =
    "rounded-lg p-6 transition-all duration-300 hover:shadow-lg";
  const variantStyles = {
    default: "bg-white shadow-md borders border-gray-100",
    elevated: "bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg border border-blue-100",
    warning: "bg-orange-50 border border-orange-200",
    success: "bg-green-50 border border-green-200",
    interactive: "bg-white shadow-md border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-300",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

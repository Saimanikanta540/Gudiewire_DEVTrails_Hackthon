export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:scale-95",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning:
      "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

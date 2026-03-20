import { AlertCircle, Check, Info, X } from "lucide-react";
import { useState } from "react";

export function AlertBanner({ type = "info", title, message, onClose, persistent = false }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const typeStyles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-600",
      icon_component: Info,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "text-green-600",
      icon_component: Check,
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-800",
      icon: "text-orange-600",
      icon_component: AlertCircle,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-600",
      icon_component: AlertCircle,
    },
  };

  const style = typeStyles[type];
  const IconComponent = style.icon_component;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4 flex items-start gap-3 animate-slideIn`}>
      <IconComponent className={`w-5 h-5 MT-0.5 flex-shrink-0 ${style.icon}`} />
      <div className="flex-1">
        {title && <p className={`font-semibold ${style.text} mb-1`}>{title}</p>}
        {message && <p className={`${style.text} text-sm`}>{message}</p>}
      </div>
      {!persistent && (
        <button
          onClick={handleClose}
          className={`${style.icon} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

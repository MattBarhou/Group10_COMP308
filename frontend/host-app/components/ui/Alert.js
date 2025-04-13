import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

export default function Alert({
  type = "info",
  title,
  message,
  dismissible = false,
  onDismiss,
  children,
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  const styles = {
    info: {
      background: "bg-blue-100 dark:bg-blue-900",
      border: "border-blue-500",
      text: "text-blue-800 dark:text-blue-200",
      icon: (
        <FaInfoCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      ),
    },
    success: {
      background: "bg-green-100 dark:bg-green-900",
      border: "border-green-500",
      text: "text-green-800 dark:text-green-200",
      icon: (
        <FaCheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      ),
    },
    warning: {
      background: "bg-yellow-100 dark:bg-yellow-900",
      border: "border-yellow-500",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: (
        <FaExclamationTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      ),
    },
    error: {
      background: "bg-red-100 dark:bg-red-900",
      border: "border-red-500",
      text: "text-red-800 dark:text-red-200",
      icon: (
        <FaExclamationCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      ),
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.background} border-l-4 ${style.border} p-4 rounded-md`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="ml-3 flex-grow">
          {title && (
            <h3 className={`text-sm font-medium ${style.text}`}>{title}</h3>
          )}
          <div className={`text-sm ${style.text} ${title ? "mt-2" : ""}`}>
            {message || children}
          </div>
        </div>
        {dismissible && (
          <div className="pl-3">
            <button
              type="button"
              className={`inline-flex items-center justify-center h-6 w-6 rounded-md ${style.text} hover:bg-opacity-20 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

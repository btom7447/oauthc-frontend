import toast, { ToastOptions } from "react-hot-toast";

const defaultOptions: ToastOptions = {
  position: "top-right",
};

/**
 * Generic toast
 */
export const showToast = (message: string, options?: ToastOptions) => {
  return toast(message, { ...defaultOptions, ...options });
};

/**
 * Success toast
 */
export const showSuccess = (message: string) => {
  return toast.success(message, defaultOptions);
};

/**
 * Error toast
 */
export const showError = (message: string) => {
  return toast.error(message, defaultOptions);
};

/**
 * Info / neutral toast
 */
export const showInfo = (message: string) => {
  return toast(message, {
    ...defaultOptions,
    icon: "ℹ️",
  });
};

/**
 * Coming soon helper (optional convenience wrapper)
 */
export const showComingSoon = (label?: string) => {
  return toast(`${label ? label + " " : ""}is coming soon 🚧`, {
    ...defaultOptions,
    icon: "🚧",
  });
};

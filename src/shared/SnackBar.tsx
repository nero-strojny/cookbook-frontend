interface SnackbarProps {
  message: string | null;
  type: 'success' | 'error' |  null;
  isVisible: boolean;
}

export const Snackbar = ({ message, type, isVisible }: SnackbarProps) => {
  if (!message || !isVisible) return null;

  let bgColor = 'bg-blue-500'; // Default to info
  if (type === 'success') {
    bgColor = 'bg-successGreen';
  } else if (type === 'error') {
    bgColor = 'bg-errorRed';
  }
  return (
    <div
      className={`fixed z-50 top-24 left-1/2 transform -translate-x-1/2 p-2 text-white font-bold rounded-lg shadow-md transition-all duration-300 ${bgColor}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {message}
    </div>
  );
};

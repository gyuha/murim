interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white shadow-xl z-50"
      style={{ background: '#141a1d' }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

import { useToastStore } from '@/store/toastStore';

export function GlobalToast() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  // Usually Spotify only shows one active toast at the bottom, or stacks them
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded bg-white px-3 py-2 text-sm font-medium text-black shadow-lg shadow-black/50 transition-all duration-300 ease-in-out"
        >
          {toast.icon === 'liked-songs' && (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-indigo-700 via-violet-500 to-cyan-300">
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 fill-current text-white"
                aria-hidden="true"
              >
                <path d="M12 21c-.3 0-.6-.1-.9-.4C5.7 15.7 2 12.4 2 8.5 2 5.5 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.5 22 8.5c0 3.9-3.7 7.2-9.1 12.1-.3.3-.6.4-.9.4z" />
              </svg>
            </div>
          )}
          <span>{toast.message}</span>
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                removeToast(toast.id);
              }}
              className="ml-2 font-bold text-emerald-800 hover:text-emerald-700 transition"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

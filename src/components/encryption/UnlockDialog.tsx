'use client';

import { useState } from 'react';
import { useEncryption } from './EncryptionProvider';

interface UnlockDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function UnlockDialog({ isOpen, onClose, onSuccess }: UnlockDialogProps) {
  const { unlock } = useEncryption();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await unlock(password);
      setPassword('');
      onSuccess?.();
    } catch (err) {
      setError('Incorrect password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Unlock Encrypted Content
        </h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Enter your password to decrypt your posts.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="unlock-password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="unlock-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 rounded-md bg-[var(--accent-color)] px-4 py-2 text-white hover:bg-[var(--accent-color-hover)] disabled:opacity-50"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Unlocking...' : 'Unlock'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/auth/forgot-password"
            className="text-sm text-[var(--accent-color)] hover:underline"
          >
            Forgot password? Use recovery key
          </a>
        </div>
      </div>
    </div>
  );
}

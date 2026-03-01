'use client';

import { useState } from 'react';

interface RecoveryKeyDialogProps {
  isOpen: boolean;
  recoveryKey: string;
  onClose: () => void;
}

export function RecoveryKeyDialog({
  isOpen,
  recoveryKey,
  onClose,
}: RecoveryKeyDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = recoveryKey;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (hasConfirmed) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Save Your Recovery Key
        </h2>

        <div className="mb-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Important
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Save this recovery key somewhere safe. If you forget your
                password, this is the only way to recover your encrypted data.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Recovery Key
          </label>
          <div className="flex gap-2">
            <code className="flex-1 break-all rounded-md bg-gray-100 p-3 font-mono text-sm dark:bg-gray-700 dark:text-white">
              {recoveryKey}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {hasCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasConfirmed}
              onChange={(e) => setHasConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I have saved my recovery key in a safe place
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleClose}
          disabled={!hasConfirmed}
          className="w-full rounded-md bg-[var(--accent-color)] px-4 py-2 text-white hover:bg-[var(--accent-color-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

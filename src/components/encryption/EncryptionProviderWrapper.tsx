'use client';

import { useEffect, useState } from 'react';
import { EncryptionProvider } from './EncryptionProvider';
import type { EncryptionParams } from '@/lib/crypto';

interface EncryptionProviderWrapperProps {
  children: React.ReactNode;
  initialParams?: EncryptionParams | null;
}

/**
 * Wrapper component that provides EncryptionProvider with params
 * Params are passed from server component or fetched on mount
 */
export function EncryptionProviderWrapper({
  children,
  initialParams = null,
}: EncryptionProviderWrapperProps) {
  const [encryptionParams, setEncryptionParams] = useState<EncryptionParams | null>(initialParams);

  // If no initial params provided, the component will work without encryption
  // Params will be set when user logs in (via LoginForm/SignUpForm)

  return (
    <EncryptionProvider encryptionParams={encryptionParams}>
      {children}
    </EncryptionProvider>
  );
}

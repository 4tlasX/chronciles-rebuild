'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { encryptionService } from '@/lib/crypto';
import type {
  EncryptedPostData,
  EncryptedPost,
  DecryptedPost,
  EncryptionParams,
} from '@/lib/crypto';

interface EncryptionContextValue {
  // State
  isUnlocked: boolean;
  encryptionEnabled: boolean;

  // Key management
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  setMasterKey: (key: CryptoKey) => void;

  // Content operations
  encryptPost: (
    content: string,
    metadata: Record<string, unknown>
  ) => Promise<EncryptedPostData>;
  decryptPost: (post: EncryptedPost) => Promise<DecryptedPost>;
  decryptPosts: (posts: EncryptedPost[]) => Promise<DecryptedPost[]>;
}

const EncryptionContext = createContext<EncryptionContextValue | null>(null);

interface EncryptionProviderProps {
  children: ReactNode;
  encryptionParams?: EncryptionParams | null;
}

export function EncryptionProvider({
  children,
  encryptionParams,
}: EncryptionProviderProps) {
  const [masterKey, setMasterKeyState] = useState<CryptoKey | null>(null);

  const isUnlocked = masterKey !== null;
  const encryptionEnabled = encryptionParams?.encryptionEnabled ?? false;

  const unlock = useCallback(
    async (password: string) => {
      if (!encryptionParams) {
        throw new Error('No encryption params available');
      }

      const mk = await encryptionService.unwrapMasterKey(
        password,
        encryptionParams.kekSalt,
        encryptionParams.encryptedMasterKey,
        encryptionParams.kekWrapIv,
        encryptionParams.kekIterations
      );

      setMasterKeyState(mk);
    },
    [encryptionParams]
  );

  const lock = useCallback(() => {
    setMasterKeyState(null);
  }, []);

  const setMasterKey = useCallback((key: CryptoKey) => {
    setMasterKeyState(key);
  }, []);

  const encryptPost = useCallback(
    async (
      content: string,
      metadata: Record<string, unknown>
    ): Promise<EncryptedPostData> => {
      if (!masterKey) {
        throw new Error('Encryption not unlocked');
      }
      return encryptionService.encryptPost(masterKey, content, metadata);
    },
    [masterKey]
  );

  const decryptPost = useCallback(
    async (post: EncryptedPost): Promise<DecryptedPost> => {
      if (!masterKey) {
        throw new Error('Encryption not unlocked');
      }
      return encryptionService.decryptPost(masterKey, post);
    },
    [masterKey]
  );

  const decryptPosts = useCallback(
    async (posts: EncryptedPost[]): Promise<DecryptedPost[]> => {
      if (!masterKey) {
        throw new Error('Encryption not unlocked');
      }
      return encryptionService.decryptPosts(masterKey, posts);
    },
    [masterKey]
  );

  return (
    <EncryptionContext.Provider
      value={{
        isUnlocked,
        encryptionEnabled,
        unlock,
        lock,
        setMasterKey,
        encryptPost,
        decryptPost,
        decryptPosts,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption(): EncryptionContextValue {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}

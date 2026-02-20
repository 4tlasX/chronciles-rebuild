'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, validatePassword, validateUsername, validateEmail } from '@/lib/auth';
import { generateSchemaName, createTenantSchema } from '@/lib/db';

const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour
const SESSION_COOKIE_NAME = 'chronicles_session';

export interface AuthResult {
  success?: boolean;
  error?: string;
  data?: {
    userSchema: string;
    userName: string;
    userEmail: string;
  };
}

/**
 * Sets the session cookie (HTTP-only)
 */
async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

/**
 * Clears the session cookie
 */
async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Gets the session token from cookies
 */
async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Creates a new session for an account
 */
async function createSession(accountId: number): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await prisma.session.create({
    data: {
      accountId,
      expiresAt,
    },
  });

  return { token: session.token, expiresAt };
}

/**
 * Extends session expiration (sliding window)
 * Called on each successful session validation to keep active users logged in
 */
async function extendSession(token: string): Promise<Date> {
  const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.update({
    where: { token },
    data: { expiresAt: newExpiresAt },
  });

  return newExpiresAt;
}

/**
 * Deletes all sessions for an account
 */
async function deleteAllSessions(accountId: number): Promise<void> {
  await prisma.session.deleteMany({
    where: { accountId },
  });
}

/**
 * Deletes a specific session by token
 */
async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}

/**
 * Cleans up expired sessions from the database.
 * Should be called periodically (e.g., via cron job or on certain actions).
 * Returns the number of deleted sessions.
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}

/**
 * Register a new user account
 */
export async function registerUserAction(formData: FormData): Promise<AuthResult> {
  const username = (formData.get('username') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  // Validate inputs
  const usernameValidation = validateUsername(username || '');
  if (!usernameValidation.valid) {
    return { error: usernameValidation.errors[0] };
  }

  const emailValidation = validateEmail(email || '');
  if (!emailValidation.valid) {
    return { error: emailValidation.errors[0] };
  }

  const passwordValidation = validatePassword(password || '');
  if (!passwordValidation.valid) {
    return { error: passwordValidation.errors[0] };
  }

  // Check for existing user
  const existingUser = await prisma.account.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return { error: 'An account with this email already exists' };
    }
    return { error: 'This username is already taken' };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Generate tenant schema
  const schemaName = await generateSchemaName();

  // Create account
  const account = await prisma.account.create({
    data: {
      username,
      email,
      passwordHash,
      tenantSchemaName: schemaName,
    },
  });

  // Create tenant schema
  await createTenantSchema(schemaName);

  // Create session and set cookie
  const { token, expiresAt } = await createSession(account.id);
  await setSessionCookie(token, expiresAt);

  return {
    success: true,
    data: {
      userSchema: account.tenantSchemaName,
      userName: account.username,
      userEmail: account.email,
    },
  };
}

/**
 * Login an existing user
 */
export async function loginUserAction(formData: FormData): Promise<AuthResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Find user by email
  const account = await prisma.account.findUnique({
    where: { email },
  });

  if (!account) {
    // Generic message to prevent email enumeration
    return { error: 'Invalid email or password' };
  }

  // Verify password
  const isValid = await verifyPassword(password, account.passwordHash);

  if (!isValid) {
    // Delete all existing sessions on failed login attempt
    await deleteAllSessions(account.id);
    await clearSessionCookie();
    return { error: 'Invalid email or password' };
  }

  // Delete any existing sessions (single session policy)
  await deleteAllSessions(account.id);

  // Create new session and set cookie
  const { token, expiresAt } = await createSession(account.id);
  await setSessionCookie(token, expiresAt);

  return {
    success: true,
    data: {
      userSchema: account.tenantSchemaName,
      userName: account.username,
      userEmail: account.email,
    },
  };
}

/**
 * Logout a user - deletes session and clears cookie
 */
export async function logoutAction(): Promise<AuthResult> {
  const token = await getSessionToken();

  if (token) {
    await deleteSession(token);
  }

  await clearSessionCookie();
  return { success: true };
}

/**
 * Validate the current session from cookie.
 * Uses "double-blind" validation: reads token from cookie, looks up session,
 * then gets user data from the session's associated account.
 * Implements sliding window expiration - extends session on each validation.
 */
export async function validateSessionAction(): Promise<{
  valid: boolean;
  data?: {
    userSchema: string;
    userName: string;
    userEmail: string;
  };
}> {
  const token = await getSessionToken();

  if (!token) {
    return { valid: false };
  }

  // Double-blind validation: look up session by token (from cookie),
  // then get user data from the associated account
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      account: {
        select: {
          tenantSchemaName: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!session) {
    await clearSessionCookie();
    return { valid: false };
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await deleteSession(token);
    await clearSessionCookie();
    return { valid: false };
  }

  // Sliding window: extend session expiration on each successful validation
  const newExpiresAt = await extendSession(token);
  await setSessionCookie(token, newExpiresAt);

  return {
    valid: true,
    data: {
      userSchema: session.account.tenantSchemaName,
      userName: session.account.username,
      userEmail: session.account.email,
    },
  };
}

/**
 * Get current session data (for use in components)
 */
export async function getSessionAction(): Promise<{
  userSchema: string;
  userName: string;
  userEmail: string;
} | null> {
  const result = await validateSessionAction();
  return result.valid && result.data ? result.data : null;
}

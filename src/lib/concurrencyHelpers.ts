/**
 * Concurrency Helpers
 * Utilities to handle race conditions and concurrent operations safely
 */

/**
 * Retry an async operation with exponential backoff
 * Useful for handling temporary conflicts or network issues
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 100
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;

      // Don't retry on duplicate key errors - these are permanent
      if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
        throw error;
      }

      // Don't retry on validation errors
      if (error instanceof Error && error.name === 'ValidationError') {
        throw error;
      }

      // If we've used all retries, throw the error
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
      console.log(`⏳ Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Sleep helper function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an error is a MongoDB duplicate key error
 */
export function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: number; name?: string };
    return err.code === 11000 || err.name === 'MongoServerError';
  }
  return false;
}

/**
 * Extract field name from duplicate key error
 */
export function getDuplicateField(error: unknown): string | null {
  if (!isDuplicateKeyError(error)) return null;

  const err = error as { keyPattern?: Record<string, unknown> };
  const keyPattern = err.keyPattern || {};
  const field = Object.keys(keyPattern)[0];
  return field || null;
}

/**
 * Get user-friendly message for duplicate key error
 */
export function getDuplicateErrorMessage(error: unknown): string {
  const field = getDuplicateField(error);

  if (field === 'teamName' || field?.includes('teamName')) {
    return "❌ This team name was just taken by another user. Please choose a different name.";
  } else if (field?.includes('indexNumber')) {
    return "❌ This index number was just registered by another team. Please use a different index number.";
  } else if (field?.includes('email')) {
    return "❌ This email was just registered by another team. Please use a different email address.";
  } else if (field === 'sessionId') {
    return "❌ Session conflict detected. Please refresh the page and try again.";
  }

  return "❌ Duplicate data detected. Please try again with different information.";
}

/**
 * Atomic increment with retry
 * Useful for counting team registrations safely
 */
export async function atomicIncrement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  filter: Record<string, unknown>,
  field: string,
  maxRetries: number = 3
): Promise<number> {
  return retryWithBackoff(async () => {
    const result = await model.findOneAndUpdate(
      filter,
      { $inc: { [field]: 1 } },
      { new: true, upsert: true }
    );
    return result[field];
  }, maxRetries);
}

/**
 * Check uniqueness with lock
 * Prevents race conditions when checking if a value already exists
 */
export async function checkUniqueWithLock(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  field: string,
  value: string,
  excludeId?: string
): Promise<boolean> {
  const query: Record<string, unknown> = { [field]: value };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const exists = await model.findOne(query);
  return !exists;
}

/**
 * Rate limiting helper
 * Prevents too many requests from a single session
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true; // Request allowed
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

// Global rate limiter instance (10 requests per minute per session)
export const globalRateLimiter = new RateLimiter(10, 60000);

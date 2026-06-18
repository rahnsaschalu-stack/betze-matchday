/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (password.length < 8) {
    issues.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain an uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain a lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    issues.push('Password must contain a number');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Sanitize text for display
 */
export function sanitizeText(text: string, maxLength: number = 500): string {
  return text.trim().slice(0, maxLength);
}

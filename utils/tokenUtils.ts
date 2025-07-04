import { jwtDecode } from 'jwt-decode';
import { logger } from './logger';

export interface DecodedToken {
  email: string;
  id: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

/**
 * Validates if a string is a valid JWT token format
 */
export function isValidJWTFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // JWT should have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  // Each part should be base64 encoded (basic check)
  try {
    for (const part of parts) {
      if (!part || part.length === 0) {
        return false;
      }
      // Try to decode each part to ensure it's valid base64
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token) as DecodedToken;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    logger.error('Error checking token expiration', error);
    return true; // Assume expired if we can't decode
  }
}

/**
 * Safely decodes a JWT token with validation
 */
export function safeDecodeToken(token: string): DecodedToken | null {
  try {
    logger.debug('Starting token decode process', { tokenLength: token?.length });

    // First validate the token format
    if (!isValidJWTFormat(token)) {
      logger.warn('Invalid JWT token format');
      return null;
    }
    logger.debug('Token format validation passed');

    // Check if token is expired
    if (isTokenExpired(token)) {
      logger.warn('JWT token is expired');
      return null;
    }
    logger.debug('Token expiration check passed');

    // Decode the token
    const decoded = jwtDecode(token) as DecodedToken;
    logger.debug('Token decoded successfully', {
      hasId: !!decoded.id,
      hasEmail: !!decoded.email,
      hasRole: !!decoded.role,
      hasName: !!decoded.name,
      role: decoded.role
    });

    // Validate required fields
    if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
      logger.warn('JWT token missing required fields', {
        id: !!decoded.id,
        email: !!decoded.email,
        role: !!decoded.role,
        name: !!decoded.name,
        decoded: decoded
      });
      return null;
    }

    // Validate role
    if (decoded.role !== 'ADMIN' && decoded.role !== 'RM') {
      logger.warn('JWT token has invalid role', decoded.role);
      return null;
    }

    logger.auth('Successfully decoded JWT token', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    });

    return decoded;
  } catch (error) {
    logger.error('Error decoding JWT token', error);
    return null;
  }
}

/**
 * Validates a token and returns whether it's valid and usable
 */
export function validateToken(token: string | null): {
  isValid: boolean;
  user: DecodedToken | null;
  reason?: string;
} {
  logger.debug('validateToken called', { hasToken: !!token, tokenType: typeof token });

  if (!token) {
    logger.debug('Token validation failed: No token provided');
    return { isValid: false, user: null, reason: 'No token provided' };
  }

  if (typeof token !== 'string') {
    logger.debug('Token validation failed: Token is not a string', typeof token);
    return { isValid: false, user: null, reason: 'Token is not a string' };
  }

  if (!isValidJWTFormat(token)) {
    logger.debug('Token validation failed: Invalid JWT format');
    return { isValid: false, user: null, reason: 'Invalid JWT format' };
  }

  if (isTokenExpired(token)) {
    logger.debug('Token validation failed: Token is expired');
    return { isValid: false, user: null, reason: 'Token is expired' };
  }

  const user = safeDecodeToken(token);
  if (!user) {
    logger.debug('Token validation failed: Failed to decode token');
    return { isValid: false, user: null, reason: 'Failed to decode token' };
  }

  logger.debug('Token validation successful', { userId: user.id, role: user.role });
  return { isValid: true, user };
}

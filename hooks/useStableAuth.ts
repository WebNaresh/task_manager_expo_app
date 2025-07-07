import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/utils/storage';
import { alternativeStorage } from '@/utils/alternativeStorage';
import { logger } from '@/utils/logger';
import { validateToken, DecodedToken } from '@/utils/tokenUtils';

/**
 * A more stable authentication hook that doesn't rely on React Query
 * for critical authentication state management
 */
export function useStableAuth() {
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: DecodedToken | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    token: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loadAuthState = useCallback(async () => {
    try {
      logger.auth('Loading auth state from storage');
      // Don't set loading to true if we're already loading to prevent UI flicker
      setAuthState(prev => prev.isLoading ? prev : { ...prev, isLoading: true });

      let token: string | null = null;

      // Try primary storage first
      try {
        token = await storage.getItem('token');
        if (token) {
          logger.auth('Token loaded from primary storage');
        }
      } catch (error) {
        logger.warn('Primary storage failed, trying alternative', error);
      }

      // Try alternative storage if primary failed
      if (!token) {
        try {
          token = await alternativeStorage.getItem('token');
          if (token) {
            logger.auth('Token loaded from alternative storage');
          }
        } catch (error) {
          logger.warn('Alternative storage also failed', error);
        }
      }

      if (!token) {
        logger.auth('No token found in any storage');
        setAuthState({
          token: null,
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        logger.auth('useStableAuth: Auth state updated - no token found', {
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      // Validate token
      const validation = validateToken(token);
      if (!validation.isValid) {
        logger.auth('Invalid token found', validation.reason);
        // Clear invalid token
        try {
          await storage.removeItem('token');
          await alternativeStorage.removeItem('token');
        } catch (error) {
          logger.warn('Failed to clear invalid token', error);
        }

        setAuthState({
          token: null,
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      logger.auth('Valid token and user loaded', {
        userId: validation.user?.id,
        role: validation.user?.role,
      });

      setAuthState({
        token,
        user: validation.user,
        isLoading: false,
        isAuthenticated: true,
      });

      logger.auth('useStableAuth: Auth state updated with valid user', {
        userId: validation.user?.id,
        role: validation.user?.role,
        isLoading: false,
      });

    } catch (error) {
      logger.error('Error loading auth state', error);
      setAuthState({
        token: null,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const setToken = useCallback(async (newToken: string) => {
    try {
      logger.auth('Setting new token in stable auth');

      // Store in both storage systems
      await Promise.all([
        storage.setItem('token', newToken),
        alternativeStorage.setItem('token', newToken),
      ]);

      // Validate and update state
      const validation = validateToken(newToken);
      if (validation.isValid) {
        setAuthState({
          token: newToken,
          user: validation.user,
          isLoading: false,
          isAuthenticated: true,
        });
        logger.auth('Token set successfully in stable auth');
      } else {
        logger.error('Invalid token provided to setToken');
      }
    } catch (error) {
      logger.error('Error setting token in stable auth', error);
    }
  }, []);

  const clearAuth = useCallback(async () => {
    try {
      logger.auth('Clearing auth state');

      // Clear from both storage systems
      await Promise.all([
        storage.removeItem('token'),
        alternativeStorage.removeItem('token'),
      ]);

      setAuthState({
        token: null,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      logger.auth('Auth state cleared');
    } catch (error) {
      logger.error('Error clearing auth state', error);
    }
  }, []);

  const refreshAuth = useCallback(() => {
    loadAuthState();
  }, [loadAuthState]);

  // Load auth state on mount - run immediately
  useEffect(() => {
    logger.auth('useStableAuth: Component mounted, loading auth state');
    loadAuthState();
  }, []); // Empty dependency array to run only once on mount

  return {
    ...authState,
    setToken,
    clearAuth,
    refreshAuth,
  };
}

export default useStableAuth;

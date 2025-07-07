import { useQuery } from '@tanstack/react-query';
import { storage } from '@/utils/storage';
import { alternativeStorage } from '@/utils/alternativeStorage';
import { logger } from '@/utils/logger';
import { validateToken, DecodedToken } from '@/utils/tokenUtils';

const useAuth = () => {
    const { data: token, isFetching, error, refetch } = useQuery({
        queryKey: ["token"],
        queryFn: async () => {
            try {
                logger.auth('Fetching token from storage');

                let storedToken: string | null = null;

                // Try primary storage first
                try {
                    const isStorageAvailable = await storage.isAvailable();
                    if (isStorageAvailable) {
                        storedToken = await storage.getItem("token");
                        if (storedToken) {
                            logger.auth('Token retrieved from primary storage');
                        }
                    }
                } catch (error) {
                    logger.warn('Primary storage failed, trying alternative', error);
                }

                // Try alternative storage if primary failed
                if (!storedToken) {
                    try {
                        storedToken = await alternativeStorage.getItem("token");
                        if (storedToken) {
                            logger.auth('Token retrieved from alternative storage');
                        }
                    } catch (error) {
                        logger.warn('Alternative storage also failed', error);
                    }
                }

                if (!storedToken) {
                    logger.auth('No token found in any storage');
                    return null;
                }

                // Validate the token before returning it
                const validation = validateToken(storedToken);
                if (!validation.isValid) {
                    logger.auth('Invalid token found in storage', validation.reason);
                    // Remove invalid token from both storages
                    try {
                        await storage.removeItem("token");
                        await alternativeStorage.removeItem("token");
                    } catch (error) {
                        logger.warn('Failed to remove invalid token', error);
                    }
                    return null;
                }

                logger.auth('Valid token retrieved from storage');
                return storedToken;
            } catch (error) {
                logger.error('Error fetching token from storage', error);
                return null;
            }
        },
        initialData: null,
        staleTime: Infinity, // Never consider stale to prevent refetching during navigation
        gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache longer
        refetchOnWindowFocus: false, // Disable to prevent interference
        refetchOnMount: false, // Disable to prevent interference during navigation
        refetchOnReconnect: false, // Disable to prevent interference
        retry: 1, // Minimal retries
        retryDelay: 1000, // Simple delay
    });

    // Safely decode the user from the token
    const user: DecodedToken | null = token ? (() => {
        logger.debug('Attempting to validate token for user decode', { hasToken: !!token });
        const validation = validateToken(token);
        logger.debug('Token validation result', {
            isValid: validation.isValid,
            reason: validation.reason,
            hasUser: !!validation.user
        });
        return validation.isValid ? validation.user : null;
    })() : null;

    // If we have an error or invalid token, log it
    if (error) {
        logger.error('useAuth query error', error);
    }

    if (token && !user) {
        logger.warn('Token exists but user could not be decoded', {
            tokenLength: token?.length,
            tokenStart: token?.substring(0, 20)
        });
    }

    logger.debug('useAuth hook result', {
        hasToken: !!token,
        hasUser: !!user,
        userRole: user?.role,
        isFetching,
        hasError: !!error
    });

    return {
        token,
        user,
        isFetching,
        error,
        refetch,
        isAuthenticated: !!token && !!user,
        isLoading: isFetching
    };
};

export default useAuth;

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
        staleTime: 5 * 60 * 1000, // 5 minutes - longer to prevent interference during login
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false, // Disable to prevent interference during login
        refetchOnMount: false, // Disable to prevent interference during login
        refetchOnReconnect: true, // Keep for network recovery
        retry: 2, // Reduce retries to prevent delays
        retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000), // Faster retries
    });

    // Safely decode the user from the token
    const user: DecodedToken | null = token ? (() => {
        const validation = validateToken(token);
        return validation.isValid ? validation.user : null;
    })() : null;

    // If we have an error or invalid token, log it
    if (error) {
        logger.error('useAuth query error', error);
    }

    if (token && !user) {
        logger.warn('Token exists but user could not be decoded');
    }

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

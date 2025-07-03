import { useQuery } from '@tanstack/react-query';
import { storage } from '@/utils/storage';
import { logger } from '@/utils/logger';
import { validateToken, DecodedToken } from '@/utils/tokenUtils';

const useAuth = () => {
    const { data: token, isFetching, error, refetch } = useQuery({
        queryKey: ["token"],
        queryFn: async () => {
            try {
                logger.auth('Fetching token from storage');

                // Check if AsyncStorage is available
                const isStorageAvailable = await storage.isAvailable();
                if (!isStorageAvailable) {
                    logger.error('AsyncStorage is not available');
                    return null;
                }

                const storedToken = await storage.getItem("token");

                if (!storedToken) {
                    logger.auth('No token found in storage');
                    return null;
                }

                // Validate the token before returning it
                const validation = validateToken(storedToken);
                if (!validation.isValid) {
                    logger.auth('Invalid token found in storage', validation.reason);
                    // Remove invalid token
                    await storage.removeItem("token");
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
        staleTime: 2 * 60 * 1000, // 2 minutes (reduced for better production reliability)
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true, // Enable for production reliability
        refetchOnMount: true, // Enable for production reliability
        refetchOnReconnect: true, // Enable for production reliability
        retry: 3, // Retry failed requests
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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

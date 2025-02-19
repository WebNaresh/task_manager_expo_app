import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const { data: token, isFetching } = useQuery({
        queryKey: ["token"],
        queryFn: async () => {
            const storedToken = await AsyncStorage.getItem("token");
            return storedToken ? storedToken : null;
        },
        initialData: null,
    });

    const user = token ? jwtDecode(token) as {
        email: string;
        id: string;
        role: string;
        name: string;
        iat: number;
        exp: number;

    } : null;

    return { token, user, isFetching };
};

export default useAuth;
// user: {"email": "john.doe@example.com
// ", "exp": 1771540346, "iat": 1739982746, "id": "cm6ul19rm00
// 00c1log0p5s29r", "role": "ADMIN"}
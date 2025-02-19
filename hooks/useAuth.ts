import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

type Props = {}

const useAuth = async (props: Props) => {
    const { data: token, isFetching } = useQuery({
        queryKey: ["token"],
        queryFn: async () => {
            const storedToken = await AsyncStorage.getItem("token");
            return storedToken ? storedToken : null;
        },
        initialData: null,
    });


    let user = token ? jwtDecode(token) : null
    if (user) {
        user = user
    }

    return { token, user, isFetching }
}

export default useAuth
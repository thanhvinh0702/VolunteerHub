import { useMutation } from "@tanstack/react-query";
import { registerAuthUser } from "../services/authService";
// import { createUserProfile } from '../services/userService' // TODO: Uncomment when UserService is ready

const useSignUp = () => {
    return useMutation({
        mutationFn: async (data) => {
            // 1. Gọi AuthService
            const authUser = await registerAuthUser(data);

            // 2. Gọi UserService
            //const userProfile = await createUserProfile(data);

            return { authUser };
        },
        onSuccess: (data) => {
            console.log("Sign up successful:", data);

            // 3. Redirect sang OAuth2 login
            window.location.href =
                `${import.meta.env.VITE_API_URL}/oauth2/authorize` +
                `?response_type=${import.meta.env.VITE_OAUTH_RESPONSE_TYPE}` +
                `&client_id=${import.meta.env.VITE_OAUTH_CLIENT_ID}` +
                `&scope=${import.meta.env.VITE_OAUTH_SCOPE}` +
                `&redirect_uri=${import.meta.env.VITE_OAUTH_REDIRECT_URI}`;
        },
        onError: (error) => {
            console.error("Sign up failed:", error.response?.data || error.message);
            alert("Sign up failed: " + (error.response?.data?.message || error.message));
        },
    });
};

export default useSignUp;

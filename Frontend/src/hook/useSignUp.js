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
                "http://localhost:7070/oauth2/authorize" +
                "?response_type=code" +
                "&client_id=7fcdbb6c-fc1d-4921-a52d-0466557b6132" +
                "&scope=openid" +
                "&redirect_uri=http://localhost:3000/login/oauth2/code/volunteerhub";
        },
        onError: (error) => {
            console.error("Sign up failed:", error.response?.data || error.message);
            alert("Sign up failed: " + (error.response?.data?.message || error.message));
        },
    });
};

export default useSignUp;

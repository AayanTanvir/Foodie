import axios from 'axios';
import { logout } from './Utils'

const baseURL = 'http://127.0.0.1:8000';

const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        let authTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (authTokens) {
            config.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry && error.response.data?.code === 'token_not_valid') {
            originalRequest._retry = true;

            const tokensStr = localStorage.getItem("authTokens");
            if (!tokensStr) {
                console.error("No auth tokens found");
                logout();
                return Promise.reject(error);
            }

            const tokens = JSON.parse(tokensStr);
            
            console.log("refresh token being sent:", tokens.refresh);
            console.log("typeof refresh:", typeof tokens.refresh); 
            try {
                const response = await axios.post(`${baseURL}/token/refresh/`,
                    { refresh: tokens.refresh },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
                localStorage.setItem("authTokens", JSON.stringify(response.data));

                axiosClient.defaults.headers.Authorization = `Bearer ${response.data.access}`;
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return axiosClient(originalRequest);
                
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                logout();
                return Promise.reject(refreshError);
            }
                
        }

        const non_field_errors = error.response?.data?.non_field_errors;
        const detail = error.response?.data?.detail;
        const code = error.response?.data?.code;
        const data = error.response?.data;
        console.error(detail, code, non_field_errors || data || error.message);
        return Promise.reject(error);
    }
    
    
);

export default axiosClient

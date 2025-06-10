import axios from 'axios';
import { logout } from './Utils'
import { jwtDecode } from 'jwt-decode';

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

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
}

const onRefreshed = (token) => {
    refreshSubscribers.forEach(cb => cb(token))
    refreshSubscribers = [];
}

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 && 
            !originalRequest._retry && 
            error.response.data?.code === 'token_not_valid' && 
            error.response.data?.detail !== "Token is blacklisted"
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token) => {
                        try {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        } catch (err) {
                            reject(err)
                        }
                    })
                })
            }

            isRefreshing = true;
            
            const tokensStr = localStorage.getItem("authTokens");
            if (!tokensStr) {
                logout();
                return Promise.reject(error);
            }

            const tokens = JSON.parse(tokensStr);

            try {
                const response = await axios.post(`${baseURL}/token/refresh/`,{ 
                    refresh: tokens.refresh
                });
                
                const access = jwtDecode(response.data.access);
                const newAuthTokens = {
                    refresh: tokens.refresh,
                    access: response.data.access,
                }

                localStorage.setItem("authTokens", JSON.stringify(newAuthTokens));
                localStorage.setItem("accessTokenExp", access.exp);

                axiosClient.defaults.headers.Authorization = `Bearer ${response.data.access}`;

                onRefreshed(access)
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return axiosClient(originalRequest);
                
            } catch (refreshError) {
                isRefreshing = false;
                logout();
                console.error(refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
    
    
);

export default axiosClient

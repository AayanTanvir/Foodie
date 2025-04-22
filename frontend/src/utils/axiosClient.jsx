import axios from 'axios';


const baseURL = 'http://127.0.0.1:8000';
let authTokens = JSON.parse(localStorage.getItem('authTokens')) || null;

const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
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
    (error) => {
        console.error(error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient

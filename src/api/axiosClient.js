import axios from 'axios';

const baseURL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `bearer ${token}`;
        }
        return config;
    }
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.status === 401) {
            //localStorage.removeItem('accessToken');
            console.log(error);
        }
        return Promise.reject(error);
    }
);

export { baseURL }

export default axiosClient;
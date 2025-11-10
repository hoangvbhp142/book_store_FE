import axiosClient from '../api/axiosClient';
import { baseURL } from '../api/axiosClient';

const authBase = baseURL + "/auth"

const authApi = {
    otp: (data) => axiosClient.post(`${authBase}/otp`, data),
    register: (data) => axiosClient.post(`${authBase}/register`, data),
    login: (data) => axiosClient.post(`${authBase}/user/login`, data),
    refresh: (data) => axiosClient.post(`${authBase}/user/refresh`, data),
    logout: (data) => axiosClient.post(`${authBase}/user/logout`, data),
};

export default authApi;
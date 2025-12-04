import axiosClient from '../api/axiosClient';
import { baseURL } from '../api/axiosClient';
import { update } from '../stores/userSlice';

const authBase = "/auth"

const authApi = {
    otp: (data) => axiosClient.post(`${authBase}/otp`, data),
    register: (data) => axiosClient.post(`${authBase}/register`, data),
    login: (data) => axiosClient.post(`${authBase}/user/login`, data),
    refresh: (data) => axiosClient.post(`${authBase}/user/refresh`, data),
    logout: (data) => axiosClient.post(`${authBase}/user/logout`, data),

    updateProfile: (data) => axiosClient.put(`/user`, data),
};

export default authApi;
import axiosClient from "./axiosClient";
const endpoint = '/admin/users';

const userApi = {
    getAll: (params) => axiosClient.get(`${endpoint}/list`, { params }),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
}

export default userApi;
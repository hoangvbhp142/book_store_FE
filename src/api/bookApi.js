import axiosClient from "./axiosClient";

const endpoint = '/admin/book'

const bookApi = {
    getAll: (params, isAdmin = false) => {
        const url = isAdmin ? endpoint : '/book'
        return axiosClient.get(url, { params });
    },
    getById: (id, isAdmin = false) => {
        const url = isAdmin ? endpoint : '/book'
        return axiosClient.get(`${url}/${id}`);
    },
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    delete: (id) => axiosClient.delete(`${endpoint}/${id}`),
}

export default bookApi;
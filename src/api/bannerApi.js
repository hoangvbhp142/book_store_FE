import axiosClient from "./axiosClient";

const endpoint = '/admin-banner';

const bannerApi = {
    getAll: (params) => axiosClient.get(endpoint, { params: params }),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    delete: (id) => axiosClient.delete(`${endpoint}/${id}`),
}

export default bannerApi;
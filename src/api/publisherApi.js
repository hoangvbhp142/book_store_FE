import axiosClient from "./axiosClient";

const endpoint = '/admin/publisher';

const publisherApi = {
    getAll: (params) => axiosClient.get(endpoint, {params}),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    remove: (id) => axiosClient.delete(`${endpoint}/${id}`)
}

export default publisherApi;
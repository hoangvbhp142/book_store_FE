import axiosClient, { baseURL } from "./axiosClient";

const endpoint = `/address`;

const addressApi = {
    getAll: () => axiosClient.get(endpoint),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    remove: (id) => axiosClient.delete(`${endpoint}/${id}`),
};

export default addressApi;

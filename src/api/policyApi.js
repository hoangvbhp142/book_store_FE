import axiosClient from "./axiosClient";

const endpoint = "/admin/policy";

const policyApi = {
    getAll: () => axiosClient.get(endpoint),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    remove: (id) => axiosClient.delete(`${endpoint}/${id}`),
};

export default policyApi;
import axiosClient from "./axiosClient";


const endpoint = `/admin/category`;

const categoryApi = {
    getAll: (params) => axiosClient.get(endpoint, { params }),
    create: (data) => axiosClient.post(`${endpoint}`, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    remove: (id) => axiosClient.delete(`${endpoint}/${id}`)
}

export default categoryApi;
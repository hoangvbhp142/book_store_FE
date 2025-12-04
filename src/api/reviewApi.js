import axiosClient from "./axiosClient";

const endpoint = "/review";

const reviewApi = {
    getAll: (params) => axiosClient.get(endpoint, { params }),
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    delete: (id) => axiosClient.delete(`${endpoint}/${id}`)
}

export default reviewApi;
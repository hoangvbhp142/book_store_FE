import axiosClient from './axiosClient'

const endpoint = '/admin/author'

const authorApi = {
    getAll: (params) => axiosClient.get(endpoint, { params }),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    create: (data) => axiosClient.post(`${endpoint}`, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data)
}

export default authorApi;
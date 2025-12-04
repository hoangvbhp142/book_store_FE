import axiosClient from "./axiosClient";


const endpoint = `/admin/category`;

const categoryApi = {
    getAll: (params, isAdmin = false) => {
        const url = isAdmin ? endpoint : "/category";
        return axiosClient.get(url, { params });
    },
    create: (data) => axiosClient.post(`${endpoint}`, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    remove: (id) => axiosClient.delete(`${endpoint}/${id}`)
}

export default categoryApi;
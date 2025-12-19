import axiosClient from "./axiosClient";

const endpoint = '/admin/rental-return';

const adminRentalApi = {
    getAllReturns: (params) => axiosClient.get(endpoint, { params }),
    getReturnById: (id) => axiosClient.get(`${endpoint}/${id}`),
    approveReturn: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    getAllRentalItems: (params) => axiosClient.get('/admin/rental-item', { params }),
}

export default adminRentalApi;
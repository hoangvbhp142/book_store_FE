import axiosClient from "./axiosClient";

const endpoint = "/admin-order";

const adminOrderApi = {
    getAllOrders: (params) => axiosClient.get(endpoint, { params }),
    getOrderDetails: (id) => axiosClient.get(`${endpoint}/${id}`),
    updateOrder: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
};
export default adminOrderApi;
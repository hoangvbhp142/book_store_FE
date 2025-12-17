import axiosClient from "./axiosClient";

const endpoint = '/order';

const orderApi = {
    getOrders: (params) => axiosClient.get(endpoint, { params }),
    getOrderById: (id) => axiosClient.get(`${endpoint}/${id}`),
    createOrder: (data) => axiosClient.post("/create-order/cart", data),
    updateOrderStatus: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
}

export default orderApi;
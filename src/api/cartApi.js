import axiosClient from "./axiosClient";

const endpoint = '/cart';

const cartApi = {
    getCart: () => axiosClient.get(endpoint),
    addToCart: (data) => axiosClient.post(endpoint, data),
    updateCartItem: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data),
    removeCartItem: (id) => axiosClient.delete(`${endpoint}/${id}`),
}

export default cartApi;
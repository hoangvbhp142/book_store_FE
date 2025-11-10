import axiosClient from "./axiosClient";

const cartApi = {
    getCart: (id) => axiosClient.get(`/carts/user/${id}`),
    addToCart: (data) => axiosClient.post("/carts", data),
    updateCartItem: (id, data) => axiosClient.put(`/carts/${id}`, data),
    removeCartItem: (id) => axiosClient.delete(`/carts/${id}`),
}

export default cartApi;
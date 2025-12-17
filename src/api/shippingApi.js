import { data } from "react-router-dom";
import axiosClient from "./axiosClient";

const endpoint = "/admin/shipping";

const shippingApi = {
    create: (data) => axiosClient.post(endpoint, data),
    update: (id, data) => axiosClient.patch(`${endpoint}/${id}`, data)
}

export default shippingApi;
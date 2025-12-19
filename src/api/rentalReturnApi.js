import { getById } from "../stores/userSlice";
import axiosClient from "./axiosClient";

const endpoint = "/rental-return";

const rentalReturnApi = {
    getAll: (params) => axiosClient.get(endpoint, { params }),
    getById: (id) => axiosClient.get(`${endpoint}/${id}`),
    createRentalRequest: (data) => axiosClient.post(endpoint, data)
}

export default rentalReturnApi;
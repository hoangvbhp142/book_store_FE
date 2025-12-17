import axiosClient from "./axiosClient";

const endpoint = "/rental-return";

const rentalReturnApi = {
    createRentalRequest: (data) => axiosClient.post(endpoint, data)
}

export default rentalReturnApi;
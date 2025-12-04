import axiosClient from './axiosClient';

const endpoint = '/analysis';

const analysisApi = {
    getUserNumber: () => axiosClient.get(`${endpoint}/user`),
    getBookNumber: () => axiosClient.get(`${endpoint}/book`),
    getOrderNumber: () => axiosClient.get(`${endpoint}/order`),
    getRevenue: () => axiosClient.get(`${endpoint}/revenue-month`),
    getTopPurchase: () => axiosClient.get(`${endpoint}/top10-purchase`),
    getTopRental: () => axiosClient.get(`${endpoint}/top10-rental`),
    getTopBook: () => axiosClient.get(`${endpoint}/top10`),
}

export default analysisApi;
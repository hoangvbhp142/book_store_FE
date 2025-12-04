import axiosClient from './axiosClient'

const endpoint = "/chat/ask"
const chatApi = {
    chat: (data) => axiosClient.post(endpoint, data)
}

export default chatApi;
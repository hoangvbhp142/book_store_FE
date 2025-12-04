import axiosClient from "./axiosClient";

const endpoint = '/upload'

const imageApi = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    multipleUpload: (files) => {
        const formData = new FormData();
        files.array.forEach(file => {
            formData.append('files', file);
        });
        return axiosClient.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export default imageApi;
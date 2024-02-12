import axios from 'axios';

export const apiClient = axios.create({

    baseURL: 'http://192.168.2.19:5000/', // replace with base URL
    withCredentials: true,
});

export async function getRequest(endpoint, params) {
    console.log("sending request")
    try {
        const response = await apiClient.get(endpoint, { params: params });
        return response;
    } catch (error) {
        console.error(error);
        console.log(error);
        throw error;
    }
}

export async function postRequest(endpoint, data) {
    try {
        const response = await apiClient.post(endpoint, data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteRequest(endpoint, data) {
    try {
        const response = await apiClient.delete(endpoint, { data: data });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function putRequest(endpoint, data) {
    try {
        const response = await apiClient.put(endpoint, data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
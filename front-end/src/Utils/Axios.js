import axios from 'axios';

export const apiClient = axios.create({

    baseURL: "https://web-chat-0nqx.onrender.com/", // replace with base URL
    withCredentials: true,
});

export async function getRequest(endpoint, params) {
    try {
        const response = await apiClient.get(endpoint, { params: params });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function postRequest(endpoint, data) {
    try {
        const response = await apiClient.post(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function deleteRequest(endpoint, data) {
    try {
        const response = await apiClient.delete(endpoint, { data: data });
        return response;
    } catch (error) {
        throw error;
    }
}

export async function putRequest(endpoint, data) {
    try {
        const response = await apiClient.put(endpoint, data);
        return response;
    } catch (error) {
        throw error;
    }
}
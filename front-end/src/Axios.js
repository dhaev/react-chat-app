import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'http://192.168.2.19:5000/', // replace with your API base URL
    baseURL: 'http://192.168.2.19:5000/', // replace with your API base URL
    withCredentials: true,
});

export async function getRequest(endpoint, params) {
    // Your existing code here
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
    // Your existing code here
    try {
        const response = await apiClient.post(endpoint, data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteRequest(endpoint, data) {
    // Your existing code here
    try {
        const response = await apiClient.delete(endpoint, { data: data });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function putRequest(endpoint, data) {
    // Your existing code here
    try {
        const response = await apiClient.put(endpoint, data);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
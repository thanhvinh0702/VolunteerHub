import axiosClient from "./axiosClient";
const REGISTRATION_BASE_URL = "/api/v1/registrations";

export const registerEventList = async (params) => {
    try {
        const response = await axiosClient.get(`${REGISTRATION_BASE_URL}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching registered events:", error);
        throw error;
    }
};

export const checkUserParticipation = async (eventId) => {
    try {
        const response = await axiosClient.get(`${REGISTRATION_BASE_URL}/event/${eventId}/isParticipate`);
        return response.data;
    } catch (error) {
        console.error("Error checking user participation:", error);
        throw error;
    }
};

export const listUserOfAnEvent = async (eventId, params) => {
    try {
        const response = await axiosClient.get(`${REGISTRATION_BASE_URL}/registrations/${eventId}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching number of registrations:", error);
        throw error;
    }
};

export const numberOfEventRegistrations = async (eventId) => {
    try {
        const response = await axiosClient.get(`${REGISTRATION_BASE_URL}/event/${eventId}/current-registration`);
        return response.data;
    } catch (error) {
        console.error("Error fetching number of registrations:", error);
        throw error;
    }
};

export const registerForEvent = async (eventId) => {
    try {
        const response = await axiosClient.post(`${REGISTRATION_BASE_URL}/events/${eventId}/`);
        return response.data;
    } catch (error) {
        console.error("Error registering for event:", error);
        throw error;
    }
};
export const unregisterFromEvent = async (eventId) => {
    try {
        const response = await axiosClient.delete(`${REGISTRATION_BASE_URL}/events/${eventId}/`);
        return response.data;
    } catch (error) {
        console.error("Error unregistering from event:", error);
        throw error;
    }
};

export const approveRegistration = async (eventId) => {
    try {
        const response = await axiosClient.post(`${REGISTRATION_BASE_URL}/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error approving registration for event:", error);
        throw error;
    }
};

export const constUserIdList = async (eventId) => {
    try {
        const response = await axiosClient.get(`${REGISTRATION_BASE_URL}/events/${eventId}/participant-ids`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user IDs for event:", error);
        throw error;
    }
};
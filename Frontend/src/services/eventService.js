import axiosClient from "./axiosClient";

const EVENT_BASE_URL = "/api/v1/events";

export const getEvents = async (params = {}) => {
    const response = await axiosClient.get(EVENT_BASE_URL, { params });
    return response;
};

export const getEventById = async (eventId) => {
    if (!eventId) {
        throw new Error("eventId is required to fetch event details");
    }
    const response = await axiosClient.get(`${EVENT_BASE_URL}/${eventId}`);
    return response;
};

export const createEvent = async (payload) => {
    const response = await axiosClient.post(EVENT_BASE_URL, payload);
    return response;
};

export const updateEvent = async (eventId, payload) => {
    if (!eventId) {
        throw new Error("eventId is required to update an event");
    }
    const response = await axiosClient.put(`${EVENT_BASE_URL}/${eventId}`, payload);
    return response;
};

export const deleteEvent = async (eventId) => {
    if (!eventId) {
        throw new Error("eventId is required to delete an event");
    }
    const response = await axiosClient.delete(`${EVENT_BASE_URL}/${eventId}`);
    return response;
};

export const approveEvent = async (eventId) => {
    if (!eventId) {
        throw new Error("eventId is required to approve an event");
    }
    const response = await axiosClient.post(`${EVENT_BASE_URL}/${eventId}/approve`);
    return response;
};

export const rejectEvent = async (eventId) => {
    if (!eventId) {
        throw new Error("eventId is required to reject an event");
    }
    const response = await axiosClient.post(`${EVENT_BASE_URL}/${eventId}/ban`);
    return response;
}
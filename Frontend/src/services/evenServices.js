// this demo to create backbone of web

import { api } from "../utils/api";

export const eventService = {
    getAll: () => api.get("/events"),
    create: (data) => api.post("/events", data),
    update: (id, data) => api.put(`/events/${id}`, data),
    remove: (id) => api.del(`/events/${id}`),
};

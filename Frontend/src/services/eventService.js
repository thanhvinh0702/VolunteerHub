import axiosClient from "./axiosClient";

const EVENT_BASE_URL = "api/v1/events";
const EVENT_AGGREGATED_BASE_URL = "api/v1/aggregated/events";


export const getEvents = async (params = {}) => {
    console.log("params", params);
    const response = await axiosClient.get(EVENT_AGGREGATED_BASE_URL, { params });
    console.log('Events API response:', response);

    // Handle paginated response structure from API

    if (response.content !== undefined) {
        return {
            data: response.content,
            meta: {
                totalPages: response.totalPages || 0,
                totalElements: response.totalElements || 0,
                currentPage: response.number || 0,
                pageSize: response.size || params.pageSize || 10
            }
        };
    }

    // Fallback for simple array response
    const data = Array.isArray(response) ? response : (response.data || []);


    return {
        data: data,
        meta: {
            totalPages: 1,
            totalElements: data.length,
            currentPage: 0,
            pageSize: data.length
        }
    };
};

export const getOwnedEvents = async (params = {}) => {
    const response = await axiosClient.get(`${EVENT_BASE_URL}/owned`, { params });
    console.log('Owned Events API response:', response);

    // Handle paginated response structure
    if (response.data && response.meta) {
        return {
            data: response.data,
            meta: response.meta
        };
    }

    // Fallback for simple array response
    const data = Array.isArray(response) ? response : (response.data || []);
    console.log('Processed owned data:', data);

    return {
        data: data,
        meta: {
            totalPages: 1,
            totalElements: data.length
        }
    };
};

export const getEventById = async (eventId) => {
    if (!eventId) {
        throw new Error("eventId is required to fetch event details");
    }
    const response = await axiosClient.get(`${EVENT_BASE_URL}/${eventId}`);
    return response;
};

export const createEvent = async (payload) => {
    console.log("Creating event with payload:", payload);
    const response = await axiosClient.post(EVENT_BASE_URL, payload);
    return response;
};

export const updateEvent = async (eventId, payload) => {
    if (!eventId) {
        throw new Error("eventId is required to update an event");
    }
    // If caller already built FormData, send it as-is
    if (payload instanceof FormData) {
        const response = await axiosClient.put(`${EVENT_BASE_URL}/${eventId}`, payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    }

    // Otherwise build FormData similar to createEvent: eventRequest JSON + optional imageFile
    const formData = new FormData();

    // Allow callers to pass either a flat payload or an object with eventRequest
    const { imageFile, eventRequest, ...rest } = payload || {};
    const body = eventRequest || rest || {};

    formData.append(
        "eventRequest",
        new Blob([JSON.stringify(body)], { type: "application/json" })
    );

    if (imageFile) {
        const fileToSend = Array.isArray(imageFile)
            ? imageFile[0]
            : imageFile?.[0] || imageFile;
        if (fileToSend) {
            formData.append("imageFile", fileToSend);
        }
    }

    const response = await axiosClient.put(`${EVENT_BASE_URL}/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
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
    const response = await axiosClient.put(`${EVENT_BASE_URL}/${eventId}/approve`);
    return response;
};

export const rejectEvent = async (eventId) => {
    if (!eventId) {
        throw new Error("eventId is required to reject an event");
    }
    const response = await axiosClient.post(`${EVENT_BASE_URL}/${eventId}/ban`);
    return response;
}

export const searchEventByName = async (params = {}) => {
    const { keyword, pageNum = 0, pageSize = 6 } = params;
    const response = await axiosClient.get(`${EVENT_BASE_URL}/search`, {
        params: { keyword, pageNum, pageSize }
    });
    console.log('Search API response:', response);

    // API trả về: { content, totalElements, totalPages, number, size }
    // Transform thành format thống nhất với getEvents
    if (response.content !== undefined) {
        return {
            data: response.content,
            meta: {
                totalPages: response.totalPages || 0,
                totalElements: response.totalElements || 0,
                currentPage: response.number || 0,
                pageSize: response.size || pageSize
            }
        };
    }

    return {
        data: [],
        meta: { totalPages: 0, totalElements: 0, currentPage: 0, pageSize }
    };
};
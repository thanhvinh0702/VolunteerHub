import axiosClient from "./axiosClient";

const CommunityService = {
    // ==================== POST APIs ====================
    getAllPosts: (eventId, pageNum, pageSize) => {
        const params = {};
        if (pageNum !== undefined) params.pageNum = pageNum;
        if (pageSize !== undefined) params.pageSize = pageSize;

        return axiosClient.get(`/api/v1/events/${eventId}/posts`, { params });
    },


    getPostById: (eventId, postId) => {
        return axiosClient.get(`/api/v1/events/${eventId}/posts/${postId}`);
    },


    createPost: (eventId, postData) => {
        return axiosClient.post(`/api/v1/events/${eventId}/posts`, postData);
    },


    updatePost: (eventId, postId, postData) => {
        return axiosClient.put(`/api/v1/events/${eventId}/posts/${postId}`, postData);
    },


    deletePost: (eventId, postId) => {
        return axiosClient.delete(`/api/v1/events/${eventId}/posts/${postId}`);
    },

    // ==================== COMMENT APIs ====================

    getAllComments: (eventId, postId, pageNum, pageSize) => {
        const params = {};
        if (pageNum !== undefined) params.pageNum = pageNum;
        if (pageSize !== undefined) params.pageSize = pageSize;

        return axiosClient.get(`/api/v1/events/${eventId}/posts/${postId}/comments`, { params });
    },


    createComment: (eventId, postId, commentData) => {
        return axiosClient.post(`/api/v1/events/${eventId}/posts/${postId}/comments`, commentData);
    },


    updateComment: (eventId, postId, commentId, commentData) => {
        return axiosClient.put(`/api/v1/events/${eventId}/posts/${postId}/comments/${commentId}`, commentData);
    },

    deleteComment: (eventId, postId, commentId) => {
        return axiosClient.delete(`/api/v1/events/${eventId}/posts/${postId}/comments/${commentId}`);
    },

    // ==================== REACTION APIs ====================
    getAllReactions: (eventId, postId, pageNum, pageSize) => {
        const params = {};
        if (pageNum !== undefined) params.pageNum = pageNum;
        if (pageSize !== undefined) params.pageSize = pageSize;

        return axiosClient.get(`/api/v1/events/${eventId}/posts/${postId}/reactions`, { params });
    },

    createReaction: (eventId, postId, reactionData) => {
        return axiosClient.post(`/api/v1/events/${eventId}/posts/${postId}/reactions`, reactionData);
    },

    updateReaction: (eventId, postId, reactionId, reactionData) => {
        return axiosClient.put(`/api/v1/events/${eventId}/posts/${postId}/reactions/${reactionId}`, reactionData);
    },

    deleteReaction: (eventId, postId, reactionId) => {
        return axiosClient.delete(`/api/v1/events/${eventId}/posts/${postId}/reactions/${reactionId}`);
    },
};

export default CommunityService;

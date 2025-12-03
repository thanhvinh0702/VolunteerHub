import axiosClient from "./axiosClient";

const CommunityService = {
    // ==================== POST APIs ====================

    /**
     * Lấy tất cả bài đăng của một event
     * @param {number} eventId - ID của event
     * @param {number} pageNum - Số trang (optional)
     * @param {number} pageSize - Kích thước trang (optional)
     * @returns {Promise<Array>} Danh sách bài đăng
     */
    getAllPosts: (eventId, pageNum, pageSize) => {
        const params = {};
        if (pageNum !== undefined) params.pageNum = pageNum;
        if (pageSize !== undefined) params.pageSize = pageSize;

        return axiosClient.get(`/api/v1/events/${eventId}/posts`, { params });
    },

    /**
     * Lấy chi tiết một bài đăng
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @returns {Promise<Object>} Chi tiết bài đăng
     */
    getPostById: (eventId, postId) => {
        return axiosClient.get(`/api/v1/events/${eventId}/posts/${postId}`);
    },

    /**
     * Tạo bài đăng mới
     * @param {number} eventId - ID của event
     * @param {Object} postData - Dữ liệu bài đăng { content, imageUrls? }
     * @returns {Promise<Object>} Bài đăng đã tạo
     */
    createPost: (eventId, postData) => {
        return axiosClient.post(`/api/v1/events/${eventId}/posts`, postData);
    },

    /**
     * Cập nhật bài đăng
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {Object} postData - Dữ liệu cập nhật { content?, imageUrls? }
     * @returns {Promise<Object>} Bài đăng đã cập nhật
     */
    updatePost: (eventId, postId, postData) => {
        return axiosClient.put(`/api/v1/events/${eventId}/posts/${postId}`, postData);
    },

    /**
     * Xóa bài đăng
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @returns {Promise<Object>} Bài đăng đã xóa
     */
    deletePost: (eventId, postId) => {
        return axiosClient.delete(`/api/v1/events/${eventId}/posts/${postId}`);
    },

    // ==================== COMMENT APIs ====================

    /**
     * Lấy tất cả bình luận của một bài đăng
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {number} pageNum - Số trang (optional)
     * @param {number} pageSize - Kích thước trang (optional)
     * @returns {Promise<Array>} Danh sách bình luận
     */
    getAllComments: (eventId, postId, pageNum, pageSize) => {
        const params = {};
        if (pageNum !== undefined) params.pageNum = pageNum;
        if (pageSize !== undefined) params.pageSize = pageSize;

        return axiosClient.get(`/api/v1/events/${eventId}/posts/${postId}/comments`, { params });
    },

    /**
     * Tạo bình luận mới
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {Object} commentData - Dữ liệu bình luận { content, parentId? }
     * @returns {Promise<Object>} Bình luận đã tạo
     */
    createComment: (eventId, postId, commentData) => {
        return axiosClient.post(`/api/v1/events/${eventId}/posts/${postId}/comments`, commentData);
    },

    /**
     * Cập nhật bình luận
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {number} commentId - ID của bình luận
     * @param {Object} commentData - Dữ liệu cập nhật { content }
     * @returns {Promise<Object>} Bình luận đã cập nhật
     */
    updateComment: (eventId, postId, commentId, commentData) => {
        return axiosClient.put(`/api/v1/events/${eventId}/posts/${postId}/comments/${commentId}`, commentData);
    },

    /**
     * Xóa bình luận
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {number} commentId - ID của bình luận
     * @returns {Promise<Object>} Bình luận đã xóa
     */
    deleteComment: (eventId, postId, commentId) => {
        return axiosClient.delete(`/api/v1/events/${eventId}/posts/${postId}/comments/${commentId}`);
    },

    // ==================== REACTION APIs ====================

    /**
     * Lấy tất cả reactions của một bài đăng
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {number} pageNum - Số trang (optional)
     * @param {number} pageSize - Kích thước trang (optional)
     * @returns {Promise<Array>} Danh sách reactions
     */
    getAllReactions: (eventId, postId, pageNum, pageSize) => {
        const params = {};
        if (pageNum !== undefined) params.pageNum = pageNum;
        if (pageSize !== undefined) params.pageSize = pageSize;

        return axiosClient.get(`/api/v1/events/${eventId}/posts/${postId}/reactions`, { params });
    },

    /**
     * Thêm reaction vào bài đăng
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {Object} reactionData - Dữ liệu reaction { type: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY' }
     * @returns {Promise<Object>} Reaction đã tạo
     */
    createReaction: (eventId, postId, reactionData) => {
        return axiosClient.post(`/api/v1/events/${eventId}/posts/${postId}/reactions`, reactionData);
    },

    /**
     * Cập nhật reaction
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {number} reactionId - ID của reaction
     * @param {Object} reactionData - Dữ liệu cập nhật { type: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY' }
     * @returns {Promise<Object>} Reaction đã cập nhật
     */
    updateReaction: (eventId, postId, reactionId, reactionData) => {
        return axiosClient.put(`/api/v1/events/${eventId}/posts/${postId}/reactions/${reactionId}`, reactionData);
    },

    /**
     * Xóa reaction
     * @param {number} eventId - ID của event
     * @param {number} postId - ID của bài đăng
     * @param {number} reactionId - ID của reaction
     * @returns {Promise<Object>} Reaction đã xóa
     */
    deleteReaction: (eventId, postId, reactionId) => {
        return axiosClient.delete(`/api/v1/events/${eventId}/posts/${postId}/reactions/${reactionId}`);
    },
};

export default CommunityService;

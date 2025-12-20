import axiosClient from "./axiosClient";

const AnalysisService = {
    // ==================== MANAGER ANALYTICS ====================

    // Analytic tỉ lệ apply (manager)
    getApplicationRate: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/application-rate");
            return response;
        } catch (error) {
            console.error("Error fetching application rate:", error);
            throw error;
        }
    },

    // Analytic tỉ lệ approved (manager)
    getApprovalRate: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/approval-rate");
            return response;
        } catch (error) {
            console.error("Error fetching approval rate:", error);
            throw error;
        }
    },

    // Count events mới (user)
    getMyParticipatedEvents: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/my-stats/participated-events");
            return response;
        } catch (error) {
            console.error("Error fetching participated events:", error);
            throw error;
        }
    },

    // ==================== ADMIN ANALYTICS ====================

    // Số users (admin ms dc xem)
    getTotalUsers: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/total-users");
            return response;
        } catch (error) {
            console.error("Error fetching total users:", error);
            throw error;
        }
    },

    // Số managers (admin ms dc xem)
    getTotalManagers: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/total-managers");
            return response;
        } catch (error) {
            console.error("Error fetching total managers:", error);
            throw error;
        }
    },

    // Số event mới manager
    getTotalEvents: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/total_events");
            return response;
        } catch (error) {
            console.error("Error fetching total events:", error);
            throw error;
        }
    },

    // Số active event mới manager
    getTotalActiveEvents: async () => {
        try {
            const response = await axiosClient.get("/api/v1/analytics/total-active-events");
            return response;
        } catch (error) {
            console.error("Error fetching total active events:", error);
            throw error;
        }
    },
};

export default AnalysisService;


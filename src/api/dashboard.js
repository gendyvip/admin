import axiosInstance from "./axios";

export const dashboardService = {
    getFintechInsights: async () => {
        try {
            const response = await axiosInstance.get("/main-dashboard-insights/fintech");
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(
                    error.response.data?.message || "Failed to fetch dashboard insights"
                );
            } else if (error.request) {
                throw new Error("Server is not responding. Please try again later.");
            } else {
                throw error;
            }
        }
    },
};

export default dashboardService; 
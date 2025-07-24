import axiosInstance from "./axios";

export async function fetchWaitingUsers() {
  const response = await axiosInstance.get("/user/user-waiting", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data.data;
}

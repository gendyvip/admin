import axiosInstance from "./axios";

export async function fetchAcceptedUsersWithAI() {
  const response = await axiosInstance.get(
    "/user/get-all-users-accepted-with-ai",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // نعيد فقط الجزء المفيد من الرد
  return response.data.data.data;
}

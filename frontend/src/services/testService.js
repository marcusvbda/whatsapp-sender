import axios from "@/libs/axios";

export const testApiConnection = async () => {
  const response = await axios.get("/");
  return response.data
};

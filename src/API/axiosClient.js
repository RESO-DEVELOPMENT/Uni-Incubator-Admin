import axios from "axios";
import { stringify } from "qs";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  paramsSerializer: {
    serialize: stringify,
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.status.toString().match("(2[\\d]{2})")) {
      response.success = true;
    }
    return response;
  },
  (error) => {
    console.log("Axios Client: ", error);
    const customError = {
      message: error.response?.data?.message || "An error occurred.",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;

import axios from "axios";
import { stringify } from "qs";

const axiosClientV2 = axios.create({
  baseURL: process.env.REACT_APP_API_V2_URL,
  paramsSerializer: {
    serialize: stringify,
  },
});

axiosClientV2.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClientV2.interceptors.response.use(
  (response) => {
    if (response.status.toString().match("(2[\\d]{2})")) {
      response.success = true;
    }
    return response;
  },
  (error) => {
    console.log("Axios Client: ", error);
  }
);

export default axiosClientV2;

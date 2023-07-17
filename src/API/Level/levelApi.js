import axiosClient from "../axiosClient";

const levelApi = {
  get: (params) => {
    const url = "levels";
    return axiosClient.get(url, { params: params });
  },

  addLevel: (params) => {
    const url = "levels";
    return axiosClient.post(url, params);
  },

  updateLevel: (params) => {
    const url = "levels";
    return axiosClient.put(url, params);
  },
};

export default levelApi;

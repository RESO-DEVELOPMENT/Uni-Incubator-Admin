import axiosClient from "../axiosClient";

const systemApi = {
  get: () => {
    const url = "system/statistic";
    return axiosClient.get(url);
  },

  getConfig: () => {
    const url = "system/cfg";
    return axiosClient.get(url);
  },
};

export default systemApi;

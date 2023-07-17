import axiosClient from "../axiosClient";

const salaryApi = {
  getAll: () => {
    const url = "salarycycle";
    return axiosClient.get(url);
  },

  get: (params) => {
    const url = "salarycycle";
    return axiosClient.get(url, {
      params: params,
    });
  },

  getMostRecent: () => {
    const url = "salarycycle";
    return axiosClient.get(url, {
      params: {
        page: 1,
        "page-size": 1,
        OrderBy: "dateDesc",
      },
    });
  },

  getRecentLevelUp: (salaryCycleId) => {
    const url = `salarycycle/${salaryCycleId}/members-level-up`;
    return axiosClient.get(url);
  },

  getById: (scId) => {
    const url = `salarycycle/${scId}`;
    return axiosClient.get(url);
  },

  createCycle: (params) => {
    const url = "salarycycle";
    return axiosClient.post(url, params);
  },

  updateCycleStatus: (params) => {
    const url = "salarycycle/status";
    return axiosClient.put(url, params);
  },
};

export default salaryApi;

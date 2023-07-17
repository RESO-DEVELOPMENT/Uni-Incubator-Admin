import axiosClient from "../axiosClient";

const sponsorApi = {
  get: (params) => {
    const url = "sponsor";
    return axiosClient.get(url, {
      params: params,
    });
  },

  create: (sponsor) => {
    const url = "sponsor";
    return axiosClient.post(url, sponsor);
  },

  getById: (id) => {
    const url = `sponsor/${id}`;
    return axiosClient.get(url);
  },

  update: (sponsor) => {
    const url = "sponsor";
    return axiosClient.patch(url, sponsor);
  },

  getAllProjects: (sponsorId) => {
    const url = `sponsor/${sponsorId}/projects`;
    return axiosClient.get(url, {
      page: 1,
    });
  },
};

export default sponsorApi;

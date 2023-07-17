import axiosClient from "../axiosClient";

const userApi = {
  add: (user) => {
    const url = "users";
    return axiosClient.post(url, user);
  },

  changePassword: (params) => {
    const url = "users/me/password";
    return axiosClient.put(url, params);
  },

  requestChangePassword: (params) => {
    const url = "users/password/request-reset";
    return axiosClient.post(url, params);
  },

  resetPassword: (params) => {
    const url = "users/password/reset";
    return axiosClient.post(url, params);
  },
};

export default userApi;

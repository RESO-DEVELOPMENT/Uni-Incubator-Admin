import axiosClient from "../axiosClient";

const authApi = {
  loginGoogle: (token) => {
    const url = "users/login-google";
    return axiosClient.post(url, {
      token: token,
    });
  },

  loginAccount: (data) => {
    const url = "users/login";
    return axiosClient.post(url, {
      emailAddress: data.emailAddress,
      password: data.password,
    });
  },
};

export default authApi;

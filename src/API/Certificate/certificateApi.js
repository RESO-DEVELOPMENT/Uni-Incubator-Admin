import axiosClient from "../axiosClient";

const certificateApi = {
  getSelfCertificate: () => {
    const url = "certificate/me/link";
    return axiosClient.get(url);
  },
};

export default certificateApi;

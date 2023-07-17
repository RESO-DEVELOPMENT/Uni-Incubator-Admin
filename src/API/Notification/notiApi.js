import axiosClient from "../axiosClient";

const notiApi = {
  setToRead: (notificationId) => {
    const url = `notification/${notificationId}/read`;
    return axiosClient.post(url);
  },
};

export default notiApi;

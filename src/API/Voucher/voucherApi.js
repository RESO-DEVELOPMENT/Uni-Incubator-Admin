import axiosClient from "../axiosClient";

const voucherApi = {
  get: (params) => {
    const url = "vouchers";
    return axiosClient.get(url, { params: params });
  },

  createVoucher: (params) => {
    const url = "vouchers";
    return axiosClient.post(url, params);
  },

  updateVoucher: (params) => {
    const url = "vouchers";
    return axiosClient.patch(url, params);
  },
  getById: (id) => {
    const url = `vouchers/${id}`;
    return axiosClient.get(url);
  },
};

export default voucherApi;

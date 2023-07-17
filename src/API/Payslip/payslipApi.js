import axiosClient from "../axiosClient";

const payslipApi = {
  getStatistic: (params) => {
    const url = "payslip/total";
    return axiosClient.get(url, { params: params });
  },

  get: (params) => {
    const url = "payslip";
    return axiosClient.get(url, { params: params });
  },

  getPayslipItems: (params) => {
    const url = "payslipitems";
    return axiosClient.get(url, { params: params });
  },

  getPayslipItemInfo: (params) => {
    const url = "payslipitems/total";
    return axiosClient.get(url, { params: params });
  }
};

export default payslipApi;

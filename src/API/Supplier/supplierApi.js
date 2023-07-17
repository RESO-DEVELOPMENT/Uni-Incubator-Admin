import axiosClient from "../axiosClient";

const supplierApi = {
  get: (params) => {
    const url = "supplier";
    return axiosClient.get(url, { params: params });
  },

  createSupplier: (params) => {
    const url = "supplier";
    return axiosClient.post(url, params);
  },

  updateSupplier: (params) => {
    const url = "supplier";
    return axiosClient.patch(url, params);
  },

  getSupplierById: (id) => {
    const url = `supplier/${id}`;
    return axiosClient.get(url);
  },
};

export default supplierApi;

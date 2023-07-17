import axiosClient from "../axiosClient";
import axiosClientV2 from "../axiosClientV2";

const memberApi = {
  getMe: () => {
    const url = "members/me";
    return axiosClient.get(url);
  },

  get: (params) => {
    const url = "members";
    return axiosClient.get(url, {
      params: params,
    });
  },

  getById: (userId) => {
    const url = `members/${userId}`;
    return axiosClient.get(url);
  },

  getMemberProjects: (memberId) => {
    const url = `members/${memberId}/projects`;
    return axiosClient.get(url);
  },

  getMemberProjectCount: (memberId) => {
    const url = `members/${memberId}/projects/count`;
    return axiosClient.get(url);
  },

  getSelfAchievement: () => {
    const url = "members/me/achievements";
    return axiosClient.get(url);
  },

  getSelfPayslip: (params) => {
    const url = "members/me/payslips";
    return axiosClientV2.get(url, {
      params: params,
    });
  },
  getSelfTasks: (params) => {
    const url = "members/me/tasks";
    return axiosClient.get(url, {
      params: params,
    });
  },
  getMemberTasks: (memberId, params) => {
    const url = `members/${memberId}/tasks`;
    return axiosClient.get(url, {
      params: params,
    });
  },

  getSelfProjects: (params) => {
    const url = "members/me/projects";
    return axiosClient.get(url, {
      params: params,
    });
  },

  updateSelf: (params) => {
    const url = "members/me";
    return axiosClient.patch(url, params);
  },
  getSelfWallet: () => {
    const url = "members/me/wallets";
    return axiosClient.get(url);
  },
  getSelfCycle: (params) => {
    const url = "members/me/salarycycle";
    return axiosClient.get(url, {
      params: params,
    });
  },
  getMemberAchievement: (memberId) => {
    const url = `members/${memberId}/achievements`;
    return axiosClient.get(url);
  },
  getMemberWallet: (memberId) => {
    const url = `members/${memberId}/wallets`;
    return axiosClient.get(url);
  },
  getMemberPayslips: (memberId, params) => {
    const url = `members/${memberId}/payslips`;
    return axiosClient.get(url, {
      params: params,
    });
  },
  getSelftVoucher: (params) => {
    const url = "members/me/vouchers";
    return axiosClient.get(url, {
      params: params,
    });
  },
  getSelfTransaction: (params) => {
    const url = "members/me/transactions";
    return axiosClient.get(url, {
      params: params,
    });
  },
  updateMemberStatus: (params) => {
    const url = "members/status";
    return axiosClient.put(url, params);
  },
  getSelfNoti: (params) => {
    const url = "members/me/notifications";
    return axiosClient.get(url, {
      params: params,
    });
  },
};

export default memberApi;

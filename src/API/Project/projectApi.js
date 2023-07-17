import axiosClient from "../axiosClient";

const projectApi = {
  get: (params) => {
    const url = "projects";
    return axiosClient.get(url, {
      params: params,
    });
  },

  getById: (projectId) => {
    const url = `projects/${projectId}`;
    return axiosClient.get(url);
  },

  create: (project) => {
    const url = "projects";
    return axiosClient.post(url, project);
  },

  createProjectFile: (projectId, file) => {
    const url = `projects/${projectId}/files/final-report`;
    return axiosClient.post(url, file);
  },

  getProjectWallet: (projectId) => {
    const url = `projects/${projectId}/wallet`;
    return axiosClient.get(url);
  },

  getProjectMembers: (projectId) => {
    const url = `projects/${projectId}/members`;
    return axiosClient.get(url);
  },

  getProjectSponsor: (projectId, params) => {
    const url = `projects/${projectId}/sponsors`;
    return axiosClient.get(url, {
      params: params,
    });
  },

  getProjectPayslip: (projectId, params) => {
    const url = `projects/${projectId}/payslips`;
    return axiosClient.get(url, { params: params });
  },

  getPayslipInfo: (projectId, params) => {
    const url = `projects/${projectId}/payslips/total`;
    return axiosClient.get(url, { params: params });
  },

  getSponsorTransaction: (params) => {
    const url = "projects/sponsors/transactions";
    return axiosClient.get(url, { params: params });
  },

  getSponsoredProject: (params) => {
    const url = "projects/withtotalsponsoredstatus";
    return axiosClient.get(url, {
      params: params,
    });
  },
  getProjectTransaction: (projectId, params) => {
    const url = `projects/${projectId}/transactions`;
    return axiosClient.get(url, {
      params: params,
    });
  },
  getProjectReports: (projectId, params) => {
    const url = `projects/${projectId}/reports`;
    return axiosClient.get(url, {
      params: params,
    });
  },
  getProjectMilestones: (projectId, params) => {
    const url = `projects/${projectId}/milestones`;
    return axiosClient.get(url, {
      params: params,
    });
  },
  getProjectReportCount: () => {
    const url = "projects/reports";
    return axiosClient.get(url, {
      page: 1,
      "page-size": 1,
    });
  },
  getProjectJoinRequest: (projectId, params) => {
    const url = `projects/${projectId}/members/requests`;
    return axiosClient.get(url, {
      params: params,
    });
  },
  updateJoinRequest: (params) => {
    const url = "projects/members/requests";
    return axiosClient.put(url, params);
  },
  getAllReports: (params) => {
    const url = "projects/reports";
    return axiosClient.get(url, {
      params: params,
    });
  },
  getBonusPaySlip: (projectId, params) => {
    const url = `projects/${projectId}/bonus`;
    return axiosClient.get(url, {
      params: params,
    });
  },
  getReportById: (reportId) => {
    const url = `projects/reports/${reportId}`;
    return axiosClient.get(url);
  },
  getAllProjectBonusReport: (projectId) => {
    const url = `projects/${projectId}/bonusreports`;
    return axiosClient.get(url);
  },
  getEstimatePointForReport: (reportId) => {
    const url = `projects/reports/${reportId}/estimate`;
    return axiosClient.post(url);
  },
  createJoinRequest: (projectId, params) => {
    const url = `projects/${projectId}/members/requests`;
    return axiosClient.post(url, params);
  },
  addMilestone: (projectId, params) => {
    const url = `projects/${projectId}/milestones`;
    return axiosClient.post(url, params);
  },
  getSponsorTransactions: (projectSponsorId) => {
    const url = `projects/sponsors/${projectSponsorId}/transactions`;
    return axiosClient.get(url);
  },
  sponsorDepositToProject: (params) => {
    const url = "projects/sponsors/deposit";
    return axiosClient.post(url, params);
  },
  addSponsorToProject: (projectId, params) => {
    const url = `projects/${projectId}/sponsors`;
    return axiosClient.post(url, params);
  },
  createReport: (projectId, params) => {
    const url = `projects/${projectId}/reports`;
    return axiosClient.post(url, params);
  },
  updateReport: (params) => {
    const url = `projects/reports`;
    return axiosClient.put(url, params);
  },
  estimateDraftReport: (params) => {
    const url = "projects/reports/estimate";
    return axiosClient.post(url, params);
  },
  updateReportStatus: (params) => {
    const url = "projects/reports/status";
    return axiosClient.put(url, params);
  },
  updateProject: (params) => {
    const url = "projects/admin";
    return axiosClient.patch(url, params);
  },
  updateProjectStatus: (params) => {
    const url = "projects/status";
    return axiosClient.put(url, params);
  },
  depositToProject: (projectId, amount) => {
    const url = `projects/${projectId}/wallet`;
    return axiosClient.post(url, {
      amount: amount,
    });
  },
  getProjecMemberId: (projectMemberId) => {
    const url = `projects/members/${projectMemberId}`;
    return axiosClient.get(url);
  },
  updateMemberAttributes: (params) => {
    const url = "projects/members";
    return axiosClient.put(url, params);
  },
  updateMemberStatus: (params) => {
    const url = "projects/members/status";
    return axiosClient.put(url, params);
  },
  updateMileStone: (params) => {
    const url = `projects/milestones`;
    return axiosClient.put(url, params);
  },
  deleteMilestone: (msId) => {
    const url = `projects/milestones/${msId}`;
    return axiosClient.delete(url);
  },
  changeProjectPm: (projectId, params) => {
    const url = `projects/${projectId}/members/pm`;
    return axiosClient.post(url, params);
  },
  getProjectEndRequest: (projectId, params) => {
    const url = `projects/${projectId}/end-requests`;
    return axiosClient.get(url, params);
  },
  createProjectEndRequest: (projectId, params) => {
    const url = `projects/${projectId}/end-requests`;
    return axiosClient.post(url, params);
  },
  updateEndRequestStatus: (params) => {
    const url = `projects/end-requests`;
    return axiosClient.put(url, params);
  },
  getReportTemplate: (params) => {
    const url = `projects/reports/template`;
    return axiosClient.get(url, {
      params: params,
      responseType: "blob",
    });
  },
};

export default projectApi;

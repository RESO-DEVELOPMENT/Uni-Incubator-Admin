import { useState } from "react";
import salaryApi from "../../../API/Salary/salaryApi";
import projectApi from "../../../API/Project/projectApi";
import ToastError from "../../../Components/Alert/ToastError";
import { toDate } from "../../../Ultilities/Date";
import { useEffect } from "react";
import SelectSimple from "../../../Components/Select/SelectSimple";
import { GiTwoCoins } from "react-icons/gi";
import ProjectReportsTable from "../../../Components/Table/ProjectReportsTable";

const ProjectReports = (props) => {
  const [cycles, setCycles] = useState([{ label: "Tất cả", value: "" }]);
  const [currentCycle, setCurrentCycles] = useState("");

  const [reports, setReports] = useState([]);
  const [statistic, setStatistic] = useState({
    payslipsCount: 0,
    totalP1: 0,
    totalP2: 0,
    totalP3: 0,
    totalXP: 0,
    totalBonus: 0,
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const getCurrentCycle = async (option) => {
    setPage(-1);
    setCurrentCycles(option.value);
  };

  const getPage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const getAllCycles = async () => {
      try {
        const response = await salaryApi.getAll();
        if (response.success) {
          const cycleList = response.data.message;
          const options = [];
          cycleList.forEach((cycle) => {
            options.push({
              value: cycle.salaryCycleId,
              label: `${toDate(cycle.createdAt)} - ${toDate(cycle.endedAt)}`,
            });
          });
          setCycles([{ label: "Tất cả", value: "" }, ...options]);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    getAllCycles();
  }, [props.projectId]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getPayslipStatistic = async () => {
      try {
        const response = await projectApi.getPayslipInfo(props.projectId, {
          SalaryCycleId: currentCycle,
          status: "paid",
        });
        if (response.success) {
          setStatistic(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    const getProjectReports = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getAllReports({
          ProjectId: props.projectId,
          page: page,
          "page-size": pageSize,
          SalaryCycleId: currentCycle,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setReports(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getProjectReports();
    getPayslipStatistic();
  }, [currentCycle, props.projectId, page, pageSize]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-10 mb-10">
        <div>
          <div className="font-bold text-xl mb-2">Báo cáo dự án</div>
          <div className="text-sm text-orange-600 font-bold">
            Số báo cáo: {reports.length}
          </div>
        </div>
        <div>
          <div className="font-bold mb-1">Tổng point công việc</div>
          <div className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
            <div className="tracking-wider">
              {(
                statistic.totalP1 +
                statistic.totalP2 +
                statistic.totalP3
              ).toLocaleString()}
            </div>
            <div>
              <GiTwoCoins />
            </div>
          </div>
          <div className="text-sm text-black/60 font-bold">Trong chu kỳ</div>
        </div>
        <div>
          <div className="font-bold mb-1">Tổng point thưởng</div>
          <div className="text-2xl font-bold text-green flex items-center gap-1">
            <div className="tracking-wider">
              {statistic.totalBonus.toLocaleString()}
            </div>
            <div>
              <GiTwoCoins />
            </div>
          </div>
          <div className="text-sm text-black/60 font-bold">
            Cho nhân viên hoàn thành tốt
          </div>
        </div>
        <div className="min-w-64">
          <SelectSimple
            label="Kỳ lương"
            options={cycles}
            onChange={getCurrentCycle}
          />
        </div>
      </div>
      <div>
        <ProjectReportsTable
          reports={reports}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          currentPage={currentPage}
          getPage={getPage}
          isManager={props.isManager}
          currentMember={props.currentMember}
          isMember={props.isMember}
        />
      </div>
    </div>
  );
};

export default ProjectReports;

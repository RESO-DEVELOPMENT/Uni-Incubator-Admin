import { useEffect } from "react";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { AiFillEdit } from "react-icons/ai";
import { GiTwoCoins } from "react-icons/gi";
import projectApi from "../../../API/Project/projectApi";
import salaryApi from "../../../API/Salary/salaryApi";
import ToastError from "../../../Components/Alert/ToastError";
import SelectSimple from "../../../Components/Select/SelectSimple";
import PayslipTable from "../../../Components/Table/PayslipTable";
import { toDate } from "../../../Ultilities/Date";

const ProjectMemberPayslips = (props) => {
  const [cycles, setCycles] = useState([{ label: "Tất cả", value: "" }]);
  const [statistic, setStatistic] = useState({
    payslipsCount: 0,
    totalP1: 0,
    totalP2: 0,
    totalP3: 0,
    totalXP: 0,
    totalBonus: 0,
  });
  const [payslips, setPayslips] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [currentCycle, setCurrentCycles] = useState("");

  const [loading, setLoading] = useState(false);

  const getCurrentCycle = async (option) => {
    setPage(-1);
    setCurrentCycles(option.value);
  };

  const getPage = (page) => {
    setCurrentPage(page);
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
  }, []);

  useEffect(() => {
    const getPayslipStatistic = async () => {
      try {
        const response = await projectApi.getPayslipInfo(props.projectId, {
          SalaryCycleId: currentCycle,
        });
        if (response.success) {
          setStatistic(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    getPayslipStatistic();
  }, [currentCycle, props.projectId]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getPayslips = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getProjectPayslip(props.projectId, {
          SalaryCycleId: currentCycle,
          page: page,
          "page-size": pageSize,
          OrderBy: "dateDesc",
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setPayslips(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getPayslips();
  }, [currentCycle, page, pageSize, props.projectId]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="mb-10">
          <div className="flex items-center gap-2 font-bold">
            <div className="text-xl">Phiếu lương của thành viên tham gia</div>
            <div className="text-green rounded-full bg-green/10 p-2">
              <AiFillEdit />
            </div>
          </div>
          <div className="text-orange-600 font-bold">
            Số phiếu lương: {statistic.payslipsCount}
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
      <div className="grid grid-cols-4 gap-2 mb-10">
        <div className="flex justify-center items-center gap-5 font-bold leading-8">
          <div>
            <div>Tổng P2</div>
            <div className="text-xl text-purple tracking-wider">
              {statistic.totalP2.toLocaleString()}
            </div>
            <div className="text-black/50 text-sm">Lương theo năng lực</div>
          </div>
          <div>
            <CircularProgressbar
              className="w-14 h-14 font-bold"
              value={statistic.totalP2 > 0 ? statistic.totalP2.toFixed(1) : 0}
              maxValue={
                statistic.totalP1 +
                  statistic.totalP2 +
                  statistic.totalP3 +
                  statistic.totalBonus >
                0
                  ? statistic.totalP1 +
                    statistic.totalP2 +
                    statistic.totalP3 +
                    statistic.totalBonus
                  : 100
              }
              text={`${
                statistic.totalP2 > 0
                  ? (
                      (statistic.totalP2 /
                        (statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus)) *
                      100
                    ).toFixed(1)
                  : 0
              }%`}
              styles={{
                path: {
                  stroke: "#30BC97",
                },
                text: {
                  fill: "#30BC97",
                  fontWeight: `bold`,
                },
              }}
              strokeWidth={15}
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-5 font-bold leading-8">
          <div>
            <div>Tổng P3</div>
            <div className="text-xl text-purple tracking-wider">
              {statistic.totalP3.toLocaleString()}
            </div>
            <div className="text-black/50 text-sm">Lương theo hiệu suất</div>
          </div>
          <div>
            <CircularProgressbar
              className="w-14 h-14 font-bold"
              value={statistic.totalP3 > 0 ? statistic.totalP3.toFixed(1) : 0}
              maxValue={
                statistic.totalP1 +
                  statistic.totalP2 +
                  statistic.totalP3 +
                  statistic.totalBonus >
                0
                  ? statistic.totalP1 +
                    statistic.totalP2 +
                    statistic.totalP3 +
                    statistic.totalBonus
                  : 100
              }
              text={`${
                statistic.totalP3 > 0
                  ? (
                      (statistic.totalP3 /
                        (statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus)) *
                      100
                    ).toFixed(1)
                  : 0
              }%`}
              styles={{
                path: {
                  stroke: "#30BC97",
                },
                text: {
                  fill: "#30BC97",
                  fontWeight: `bold`,
                },
              }}
              strokeWidth={15}
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-5 font-bold leading-8">
          <div>
            <div>Tổng thưởng</div>
            <div className="text-xl text-purple tracking-wider">
              {statistic.totalBonus.toLocaleString()}
            </div>
            <div className="text-black/50 text-sm">Lương thưởng</div>
          </div>
          <div>
            <CircularProgressbar
              className="w-14 h-14 font-bold"
              value={
                statistic.totalBonus > 0 ? statistic.totalBonus.toFixed(1) : 0
              }
              maxValue={
                statistic.totalP1 +
                  statistic.totalP2 +
                  statistic.totalP3 +
                  statistic.totalBonus >
                0
                  ? statistic.totalP1 +
                    statistic.totalP2 +
                    statistic.totalP3 +
                    statistic.totalBonus
                  : 100
              }
              text={`${
                statistic.totalBonus > 0
                  ? (
                      (statistic.totalBonus /
                        (statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus)) *
                      100
                    ).toFixed(1)
                  : 0
              }%`}
              styles={{
                path: {
                  stroke: "#30BC97",
                },
                text: {
                  fill: "#30BC97",
                  fontWeight: `bold`,
                },
              }}
              strokeWidth={15}
            />
          </div>
        </div>
        <div className="flex justify-center font-bold leading-8">
          <div>
            <div>Tổng point đã trả</div>
            <div className="flex items-center gap-2 text-xl">
              <div className="text-yellow-500 tracking-wider">
                {(
                  statistic.totalP1 +
                  statistic.totalP2 +
                  statistic.totalP3 +
                  statistic.totalBonus
                ).toFixed(1)}
              </div>
              <div className="text-yellow-500">
                <GiTwoCoins />
              </div>
            </div>
            <div className="text-black/50 text-sm">Tính trong chu kỳ</div>
          </div>
        </div>
      </div>
      <div>
        <PayslipTable
          p1={false}
          payslips={payslips}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          currentPage={currentPage}
          getPage={getPage}
          loading={loading}
          currentMember={props.currentMember}
        />
      </div>
    </div>
  );
};

export default ProjectMemberPayslips;

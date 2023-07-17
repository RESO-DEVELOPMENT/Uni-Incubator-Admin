import { useEffect } from "react";
import { TopBar } from "../../Pages/Layout/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import ToastError from "../../Components/Alert/ToastError";
import projectApi from "../../API/Project/projectApi";
import { useState } from "react";
import salaryApi from "../../API/Salary/salaryApi";
import { toDate } from "../../Ultilities/Date";
import {
  textToColor,
  textToColorReport,
  toVNReport,
} from "../../Ultilities/String";
import { find, forOwn, groupBy, isEmpty, mapValues, size, sumBy } from "lodash";
import { GiTwoCoins } from "react-icons/gi";
import Button from "../../Components/Button/Button";
import Loading from "../../Components/Loading/Loading";
import ToastSuccess from "../../Components/Alert/ToastSuccess";
import ButtonCancel from "../../Components/Button/ButtonCancel";
import { IoMdAdd } from "react-icons/io";
import DepositModal from "./Components/DepositModal";
import { BiErrorCircle } from "react-icons/bi";
import TaskSummarizeTable from "../../Components/Table/TaskSummarizeTable";
import TaskDetailModal from "./Components/TaskDetailModal";

const ReportDetailForAdmin = () => {
  let { reportId } = useParams();

  const [report, setReport] = useState({});
  const [project, setProject] = useState({});
  const [cycle, setCycle] = useState({});
  const [wallets, setWallets] = useState([]);

  const [estimatePoint, setEstimatePoint] = useState({});

  const [tasks, setTasks] = useState([]);

  const [disabled, setDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const [reload, setReload] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [sumTasks, setSumTasks] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);

  const navigate = useNavigate();

  const goToMemberTask = (member) => {
    setSelectedMember(member);
    setOpenDetail(true);
  };

  const closeDetailModal = () => {
    setOpenDetail(false);
    setSelectedMember("");
    setSelectedTasks([]);
  };

  const updateReportStatus = async (status) => {
    setLoading(true);
    try {
      const response = await projectApi.updateReportStatus({
        reportId: reportId,
        status: status,
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getSelectedMemberTask = () => {
      if (isEmpty(selectedMember)) {
        return;
      }

      const tasksByUserEmail = groupBy(tasks, "memberEmail");
      const memberTasks = [];
      tasksByUserEmail[selectedMember]?.forEach((task) => {
        const mainIndex = tasks.indexOf(task);
        memberTasks.push({
          ...task,
          mainIndex: mainIndex,
        });
      });
      setSelectedTasks(memberTasks);
    };

    getSelectedMemberTask();
  }, [selectedMember, tasks]);

  useEffect(() => {
    const tasksByUserEmail = groupBy(tasks, "memberEmail");
    const taskHourByUserEmail = mapValues(tasksByUserEmail, (tasks) => {
      return {
        totalTask: size(tasks),
        totalTaskHour: sumBy(tasks, "taskHour"),
        totalTaskRealHour: sumBy(tasks, "taskRealHour"),
        totalTaskPoint: sumBy(tasks, "taskPoint"),
        totalBonusPoint: sumBy(tasks, "taskBonus"),
      };
    });
    const newSumTasks = [];
    forOwn(taskHourByUserEmail, (value, key) => {
      newSumTasks.push({
        member: key,
        task: value,
      });
    });
    setSumTasks(newSumTasks);
  }, [tasks]);

  useEffect(() => {
    const getReportById = async () => {
      setLoading(true);
      try {
        const reRes = await projectApi.getReportById(reportId);
        if (reRes.success) {
          setReport(reRes.data.message);
          setTasks(reRes.data.message.tasks);
          const proRes = await projectApi.getById(reRes.data.message.projectId);
          if (proRes.success) {
            setProject(proRes.data.message);
          }
          const walRes = await projectApi.getProjectWallet(
            reRes.data.message.projectId
          );
          if (walRes.success) {
            setWallets(walRes.data.message);
          }
          const cyRes = await salaryApi.getById(
            reRes.data.message.salaryCycleId
          );
          if (cyRes.success) {
            setCycle(cyRes.data.message);
          }
          const esRes = await projectApi.getEstimatePointForReport(reportId);
          if (esRes.success) {
            const data = {
              totalTaskPoint: esRes.data.message.totalTaskPoint,
              totalBonusPoint: esRes.data.message.totalBonusPoint,
              totalP2: esRes.data.message.totalP2,
              totalP3: esRes.data.message.totalP3,
            };
            setEstimatePoint(data);

            if (!isEmpty(walRes.data.message)) {
              if (
                find(walRes.data.message, { walletTag: "main" }).amount >=
                  data.totalTaskPoint &&
                find(walRes.data.message, { walletTag: "bonus" }).amount >=
                  data.totalBonusPoint
              ) {
                setDisabled(false);
              } else {
                setDisabled(true);
              }
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getReportById();
  }, [reportId, reload]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="grid grid-cols-2 mb-10">
            <div>
              <div className="text-xl font-bold mb-2">
                Báo cáo lương - thưởng của chu kỳ
              </div>
              <div className="text-xl font-bold text-green mb-2">
                [{project.projectName}]
              </div>
              <div className="text-primary mb-2">
                Kỳ lương:{" "}
                <span
                  className="font-bold"
                  style={{ color: textToColor(cycle.status) }}
                >
                  {toDate(cycle.startedAt)}
                </span>
              </div>
              <div className="text-primary">
                Trạng thái báo cáo:{" "}
                <span
                  className={`font-bold text-${textToColorReport(
                    report.status
                  )}`}
                >
                  {toVNReport(report.status)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="font-bold justify-self-end">
                <div className="flex items-center gap-2 mb-2">
                  <div>Quỹ dự án hiện có</div>
                  {report.status === "created" &&
                    project.projectStatus === "started" && (
                      <div
                        className="p-1 rounded-md cursor-pointer bg-green/20 text-green hover:shadow-md"
                        onClick={() => setOpenModal(true)}
                      >
                        <IoMdAdd />
                      </div>
                    )}
                </div>
                <div className="flex gap-2 items-center text-yellow-500 text-xl tracking-wider">
                  <div>
                    {!isEmpty(wallets)
                      ? find(wallets, {
                          walletTag: "main",
                        }).amount.toLocaleString()
                      : 0}
                  </div>
                  <div>
                    <GiTwoCoins />
                  </div>
                  {!isEmpty(wallets) &&
                    find(wallets, {
                      walletTag: "main",
                    }).amount < sumBy(tasks, "taskPoint") && (
                      <div className="text-red-500 flex items-center gap-1 overflow-hidden">
                        <BiErrorCircle className="peer text-xl" />
                        <div className="text-xs -translate-y-full opacity-0 ease-in-out duration-300 peer-hover:translate-y-0 peer-hover:opacity-100">
                          Không đủ point
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="font-bold justify-self-end">
                <div className="flex items-center gap-2 mb-2">
                  <div>Quỹ thưởng hiện có</div>
                  {report.status === "created" &&
                    project.projectStatus === "started" && (
                      <div
                        className="p-1 rounded-md cursor-pointer bg-green/20 text-green hover:shadow-md"
                        onClick={() =>
                          navigate(`/projects/${project.projectId}/sponsors`)
                        }
                      >
                        <IoMdAdd />
                      </div>
                    )}
                </div>
                <div className="flex gap-2 items-center text-green text-xl tracking-wider">
                  <div>
                    {!isEmpty(wallets)
                      ? find(wallets, {
                          walletTag: "bonus",
                        }).amount.toLocaleString()
                      : 0}
                  </div>
                  <div>
                    <GiTwoCoins />
                  </div>
                  {!isEmpty(wallets) &&
                    find(wallets, {
                      walletTag: "bonus",
                    }).amount < sumBy(tasks, "taskBonus") && (
                      <div className="text-red-500 flex items-center gap-1 overflow-hidden">
                        <BiErrorCircle className="peer text-xl" />
                        <div className="text-xs -translate-y-full opacity-0 ease-in-out duration-300 peer-hover:translate-y-0 peer-hover:opacity-100">
                          Không đủ point
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className={`grid grid-cols-5 gap-5 mb-10`}>
            <div className="font-bold">
              <div className="mb-2">Tổng point công việc</div>
              <div className="flex gap-2 items-center text-yellow-500 text-xl tracking-wider">
                <div>
                  {!isEmpty(estimatePoint)
                    ? estimatePoint.totalTaskPoint.toLocaleString()
                    : 0}
                </div>
                <div>
                  <GiTwoCoins />
                </div>
              </div>
            </div>
            <div className="font-bold">
              <div className="mb-2">Tổng point thưởng</div>
              <div className="flex gap-2 items-center text-green text-xl tracking-wider">
                <div>
                  {!isEmpty(estimatePoint)
                    ? estimatePoint.totalBonusPoint.toLocaleString()
                    : 0}
                </div>
                <div>
                  <GiTwoCoins />
                </div>
              </div>
            </div>
            <div className="font-bold">
              <div className="mb-2">Tổng point năng suất</div>
              <div className="flex gap-2 items-center text-yellow-500 text-xl tracking-wider">
                <div>
                  {!isEmpty(estimatePoint)
                    ? estimatePoint.totalP3.toLocaleString()
                    : 0}
                </div>
                <div>
                  <GiTwoCoins />
                </div>
              </div>
            </div>
            <div className="font-bold border-r border-slate-400">
              <div className="mb-2">Tổng point kỹ năng mềm</div>
              <div className="flex gap-2 items-center text-yellow-500 text-xl tracking-wider">
                <div>
                  {!isEmpty(estimatePoint)
                    ? estimatePoint.totalP2.toLocaleString()
                    : 0}
                </div>
                <div>
                  <GiTwoCoins />
                </div>
              </div>
            </div>
            <div className="font-bold">
              <div className="mb-2">Tổng point báo cáo</div>
              <div className="flex gap-2 items-center text-yellow-500 text-xl tracking-wider">
                <div>
                  {!isEmpty(estimatePoint)
                    ? (
                        estimatePoint.totalP2 +
                        estimatePoint.totalP3 +
                        estimatePoint.totalTaskPoint +
                        estimatePoint.totalBonusPoint
                      ).toLocaleString()
                    : 0}
                </div>
                <div>
                  <GiTwoCoins />
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="mb-10">
                <TaskSummarizeTable
                  tasks={sumTasks}
                  loading={loading}
                  goToMemberTask={goToMemberTask}
                />
              </div>
              {openDetail && (
                <TaskDetailModal
                  closeModal={closeDetailModal}
                  report={report}
                  tasks={selectedTasks}
                  allowEdit={false}
                />
              )}
              {!isEmpty(tasks) && report.status === "created" && (
                <div className="flex justify-between">
                  <div>
                    <ButtonCancel
                      type="trans"
                      text="Từ chối"
                      onClick={() => updateReportStatus("rejected")}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {disabled && (
                      <div
                        className="text-sm font-bold cursor-pointer text-red-500 hover:underline"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        Quỹ dự án không đủ!
                      </div>
                    )}
                    <div>
                      <Button
                        text="Duyệt báo cáo"
                        onClick={() => updateReportStatus("accepted")}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {openModal && (
        <DepositModal
          closeModal={() => setOpenModal(false)}
          projectId={project.projectId}
          reload={() => setReload(!reload)}
        />
      )}
    </div>
  );
};

export default ReportDetailForAdmin;

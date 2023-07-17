import { useEffect } from "react";
import { TopBar } from "../../Pages/Layout/TopBar";
import { useParams } from "react-router-dom";
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
import {
  find,
  forOwn,
  groupBy,
  isEmpty,
  isNil,
  map,
  mapValues,
  mergeWith,
  pullAt,
  size,
  some,
  sumBy,
  toNumber,
} from "lodash";
import { GiTwoCoins } from "react-icons/gi";
import readXlsxFile from "read-excel-file";
import FileInput from "../../Components/Input/FileInput";
import Button from "../../Components/Button/Button";
import Loading from "../../Components/Loading/Loading";
import ToastSuccess from "../../Components/Alert/ToastSuccess";
import validator from "validator";
import ConfirmModal from "./Components/ConfirmModal";
import TaskSummarizeTable from "../../Components/Table/TaskSummarizeTable";
import TaskDetailModal from "./Components/TaskDetailModal";
import { saveAs } from "file-saver";

const ReportDetail = () => {
  let { reportId } = useParams();

  const [report, setReport] = useState({});
  const [project, setProject] = useState({});
  const [cycle, setCycle] = useState({});
  const [wallets, setWallets] = useState([]);

  const [estimatePoint, setEstimatePoint] = useState({});

  const [fileName, setFileName] = useState("");

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState([
    {
      taskCode: "",
      memberEmail: "",
      taskName: "",
      taskHour: "",
      taskRealHour: "",
      taskPoint: "",
      taskBonus: "",
    },
  ]);

  const [edited, setEdited] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [reload, setReload] = useState(false);

  const [sumTasks, setSumTasks] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [exceed, setExceed] = useState(false);

  const getFile = async (e) => {
    try {
      setFileName(e.target.value);
      const file = e.target.files[0];
      readXlsxFile(file).then((rows) => {
        const taskList = [];
        const errorList = [];
        rows.forEach((item, index) => {
          if (index > 6 && !isNil(item[2])) {
            taskList.push({
              taskCode: item[0],
              taskName: item[1],
              memberEmail: item[2],
              taskPoint:
                isNil(item[3]) || isNaN(toNumber(+item[3])) ? 0 : item[3],
              taskHour:
                isNil(item[4]) || isNaN(toNumber(+item[4])) ? 0 : item[4],
              taskRealHour:
                isNil(item[5]) || isNaN(toNumber(+item[5])) ? 0 : item[5],
              taskEffort: isNil(item[6])
                ? 100
                : item[6] === "A"
                ? 100
                : item[6] === "B"
                ? 75
                : item[6] === "C"
                ? 50
                : 25,
              taskBonus:
                isNil(item[7]) || isNaN(toNumber(+item[7])) ? 0 : item[7],
              bonusReason: "N/A",
              taskDescription: "N/A",
            });
            errorList.push({
              taskCode: isNil(item[0]) ? "*" : "",
              taskName: isNil(item[1]) ? "*" : "",
              memberEmail:
                isNil(item[2]) || !validator.isEmail(item[2])
                  ? "!Email"
                  : isNil(
                      find(project.members, {
                        member: {
                          emailAddress: item[2],
                        },
                      })
                    )
                  ? "N/F"
                  : "",
              taskPoint:
                isNil(item[3]) || isNaN(toNumber(+item[3])) || +item[3] <= 0
                  ? "*"
                  : "",
              taskHour:
                isNil(item[4]) || isNaN(toNumber(+item[4])) || +item[4] <= 0
                  ? "*"
                  : "",
              taskRealHour:
                isNil(item[5]) || isNaN(toNumber(+item[5])) || +item[5] <= 0
                  ? "*"
                  : "",
              taskBonus: !isNaN(toNumber(+item[7])) && +item[7] < 0 ? "*" : "",
            });
          }
        });
        setError(errorList);
        setTasks(taskList);
        setEdited(true);
      });
    } catch (error) {
      ToastError({ text: "Lỗi khi đọc thông tin file" });
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await projectApi.getReportTemplate({
        ProjectId: project.projectId,
        SalaryCycleId: cycle.salaryCycleId,
      });
      if (response.success) {
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        saveAs(blob, "Report.xlsx");
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const removeFile = () => {
    setFileName("");
  };

  const addMoreRow = () => {
    setDisabled(true);
    setEdited(true);
    setTasks([
      ...tasks,
      {
        taskCode: `CNB-${selectedTasks.length + 1}`,
        memberEmail: selectedMember,
        taskName: "Công việc mới",
        taskHour: 10,
        taskRealHour: 10,
        taskPoint: 1000,
        taskBonus: 0,
        taskDescription: "N/A",
        bonusReason: "N/A",
      },
    ]);
    setError([
      ...error,
      {
        memberEmail: find(project.members, {
          member: {
            emailAddress: selectedMember,
          },
        })
          ? ""
          : "N/F",
        taskName: "",
        taskCode: "",
        taskHour: "",
        taskRealHour: "",
        taskPoint: "",
        taskBonus: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setEdited(true);
    const newTasks = [...tasks];
    pullAt(newTasks, index);
    setTasks(newTasks);
    const newErrors = [...error];
    pullAt(newErrors, index);
    setError([...newErrors]);
  };

  const splitBonus = () => {
    setEdited(true);
    const projectBonus = find(wallets, {
      walletTag: "bonus",
    }).amount;
    const reportBonus = sumBy(tasks, "taskBonus");
    if (projectBonus > reportBonus) {
      const pointToSplit = projectBonus - reportBonus;
      const baseAmount = Math.floor(pointToSplit / size(tasks));
      const newTasks = [];
      tasks.forEach((task) => {
        newTasks.push({
          ...task,
          taskBonus: +task.taskBonus + baseAmount,
        });
      });
      setTasks(newTasks);
    } else if (projectBonus < reportBonus && projectBonus > 0) {
      const baseAmount = Math.floor(projectBonus / size(tasks));
      const newTasks = [];
      tasks.forEach((task) => {
        newTasks.push({
          ...task,
          taskBonus: +task.taskBonus + baseAmount,
        });
      });
      setTasks(newTasks);
    }
  };

  const getChangeData = (e, rowIndex) => {
    const { name, value } = e.target;
    let newError = [];
    if (
      (name === "taskHour" || name === "taskRealHour") &&
      (isNaN(+value) || +value > 100)
    ) {
      return;
    }
    if (
      (name === "taskPoint" || name === "taskBonus") &&
      (isNaN(+value) || +value > 10000)
    ) {
      return;
    }
    if (
      name === "taskPoint" ||
      name === "taskBonus" ||
      name === "taskHour" ||
      name === "taskRealHour"
    ) {
      const newTasks = tasks.map((task, index) =>
        index === rowIndex ? { ...task, [name]: +value } : task
      );
      setTasks(newTasks);
      if ((name === "taskBonus" && value >= 0) || value > 0) {
        newError = error.map((error, index) =>
          index === rowIndex ? { ...error, [name]: "" } : error
        );
      } else {
        newError = error.map((error, index) =>
          index === rowIndex ? { ...error, [name]: "*" } : error
        );
      }
    } else {
      const newTasks = tasks.map((task, index) =>
        index === rowIndex ? { ...task, [name]: value } : task
      );
      setTasks(newTasks);
      if (name === "taskName") {
        if (!isEmpty(value.trim())) {
          newError = error.map((error, index) =>
            index === rowIndex ? { ...error, [name]: "" } : error
          );
        } else {
          newError = error.map((error, index) =>
            index === rowIndex ? { ...error, [name]: "*" } : error
          );
        }
      }
      if (name === "taskCode") {
        if (!isEmpty(value.trim())) {
          if (find(tasks, { taskCode: value })) {
            newError = error.map((error, index) =>
              index === rowIndex ? { ...error, [name]: "N/A" } : error
            );
          } else {
            newError = error.map((error, index) =>
              index === rowIndex ? { ...error, [name]: "" } : error
            );
          }
        } else {
          newError = error.map((error, index) =>
            index === rowIndex ? { ...error, [name]: "*" } : error
          );
        }
      }
      if (name === "memberEmail") {
        if (validator.isEmail(value) && !isEmpty(value.trim())) {
          if (
            !isNil(
              find(project.members, {
                member: {
                  emailAddress: value,
                },
              })
            )
          ) {
            newError = error.map((error, index) =>
              index === rowIndex ? { ...error, [name]: "" } : error
            );
          } else {
            newError = error.map((error, index) =>
              index === rowIndex ? { ...error, [name]: "N/F" } : error
            );
          }
        } else {
          newError = error.map((error, index) =>
            index === rowIndex ? { ...error, [name]: "!Email" } : error
          );
        }
      }
    }
    setError(newError);
    setEdited(true);
  };

  const getTaskEffort = (value, rowIndex) => {
    let newError = [];
    const newTasks = tasks.map((task, index) =>
      index === rowIndex ? { ...task, taskEffort: value } : task
    );
    setTasks(newTasks);
    setError(newError);
    setEdited(true);
  };

  const increasePoint = (name, rowIndex) => {
    const newTasks = tasks.map((task, index) =>
      index === rowIndex && +task[name] < 10000
        ? {
            ...task,
            [name]:
              +task[name] < 0
                ? 1
                : +task[name] + 100 > 10000
                ? 10000
                : +task[name] + 100,
          }
        : task
    );
    const newError = error.map((error, index) =>
      index === rowIndex ? { ...error, [name]: "" } : error
    );
    setError(newError);
    setTasks(newTasks);
    setEdited(true);
  };

  const increaseHour = (name, rowIndex) => {
    const newTasks = tasks.map((task, index) =>
      index === rowIndex && +task[name] < 100
        ? { ...task, [name]: +task[name] < 0 ? 1 : +task[name] + 1 }
        : task
    );
    const newError = error.map((error, index) =>
      index === rowIndex ? { ...error, [name]: "" } : error
    );
    setError(newError);
    setTasks(newTasks);
    setEdited(true);
  };

  const goToMemberTask = (member) => {
    setSelectedMember(member);
    setOpenDetail(true);
  };

  const closeDetailModal = () => {
    setOpenDetail(false);
    setSelectedMember("");
    setSelectedTasks([]);
  };

  const updateReport = async () => {
    if (!edited) {
      return;
    }
    setLoading(true);
    try {
      const response = await projectApi.updateReport({
        projectReportId: reportId,
        memberTasks: tasks,
      });
      if (response.success) {
        setEdited(false);
        ToastSuccess({ text: "Cập nhật thành công" });
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  const updateReportStatus = async () => {
    setLoading(true);
    try {
      if (edited) {
        await projectApi.updateReport({
          projectReportId: reportId,
          memberTasks: tasks,
        });
      }
      const response = await projectApi.updateReportStatus({
        reportId: reportId,
        status: "created",
      });
      if (response.success) {
        setOpenConfirm(true);
        setEdited(false);
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  useEffect(() => {
    const getEstimatePoint = async () => {
      try {
        const response = await projectApi.estimateDraftReport({
          projectId: project.projectId,
          salaryCycleId: cycle.salaryCycleId,
          memberTasks: tasks,
        });
        if (response.success) {
          const data = {
            totalTaskPoint: response.data.message.totalTaskPoint,
            totalBonusPoint: response.data.message.totalBonusPoint,
            totalP2: response.data.message.totalP2,
            totalP3: response.data.message.totalP3,
          };
          setEstimatePoint(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEmpty(tasks) && !isEmpty(project) && !isEmpty(cycle)) {
      getEstimatePoint();
    } else {
      setEstimatePoint({});
    }
  }, [tasks, cycle, project]);

  useEffect(() => {
    const tasksByUserEmail = groupBy(tasks, "memberEmail");
    const taskHourByUserEmail = mapValues(tasksByUserEmail, (memberTasks) => {
      return {
        totalTask: size(memberTasks),
        totalTaskHour: sumBy(memberTasks, "taskHour"),
        totalTaskRealHour: sumBy(memberTasks, "taskRealHour"),
        totalTaskPoint: sumBy(memberTasks, "taskPoint"),
        totalBonusPoint: sumBy(memberTasks, "taskBonus"),
        errors: map(memberTasks, (task) => error[tasks.indexOf(task)]),
      };
    });
    const newSumTasks = [];
    forOwn(taskHourByUserEmail, (value, key) => {
      if (key !== "null") {
        newSumTasks.push({
          member: key,
          task: value,
          error: mergeWith({}, ...value.errors, (objValue, srcValue) => {
            if (isEmpty(objValue) && isEmpty(srcValue)) {
              return "";
            } else {
              return objValue || srcValue;
            }
          }),
        });
      }
    });
    setSumTasks(newSumTasks);

    const haveError = find(error, (object) =>
      some(Object.values(object), (value) => !isEmpty(value))
    );
    if (haveError) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [error, tasks]);

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
    if (isEmpty(selectedTasks)) {
      setOpenDetail(false);
      setSelectedMember("");
    }
  }, [selectedTasks]);

  useEffect(() => {
    const getReportById = async () => {
      setLoading(true);
      try {
        const reRes = await projectApi.getReportById(reportId);
        if (reRes.success) {
          setReport(reRes.data.message);
          setTasks(reRes.data.message.tasks);
          const errorList = [];
          for (let i = 0; i < reRes.data.message.tasks.length; i++) {
            errorList.push({
              memberEmail: "",
              taskName: "",
              taskHour: "",
              taskRealHour: "",
              taskPoint: "",
              taskBonus: "",
            });
          }
          setError(errorList);
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
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getReportById();
  }, [reportId, reload]);

  useEffect(() => {
    const checkForStoppedProject = () => {
      if (!isEmpty(wallets) && !isEmpty(estimatePoint) && !isEmpty(project)) {
        if (
          project.projectStatus === "stopped" &&
          (estimatePoint.totalP2 +
            estimatePoint.totalP3 +
            estimatePoint.totalTaskPoint >
            find(wallets, {
              walletTag: "main",
            }).amount ||
            estimatePoint.totalBonusPoint >
              find(wallets, {
                walletTag: "bonus",
              }).amount)
        ) {
          setExceed(true);
          setDisabled(true);
        } else {
          setExceed(false);
          setDisabled(false);
        }
      }
    };

    checkForStoppedProject();
  }, [wallets, project, estimatePoint]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="grid grid-cols-2">
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
                <div className="mb-2">Quỹ dự án hiện có</div>
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
                </div>
              </div>
              <div className="font-bold justify-self-end">
                <div className="mb-2">Quỹ thưởng hiện có</div>
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
                </div>
              </div>
            </div>
          </div>
          {report.status === "drafted" ? (
            <div className="flex justify-end mb-10">
              <div className="w-fit">
                <div className="mb-1">
                  <FileInput
                    placeholder="Ví dụ: taskReport.xlsx"
                    name="reportFile"
                    label="Tệp tin báo cáo"
                    value={fileName}
                    onChange={getFile}
                    removeFile={removeFile}
                  />
                </div>
                <div className="flex justify-end">
                  <div
                    className="text-green text-xs underline cursor-pointer"
                    onClick={exportToExcel}
                  >
                    Lấy mẫu dữ liệu
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-10"></div>
          )}
          <div className={`grid gap-5 grid-cols-5 mb-10`}>
            <div className="font-bold">
              <div className="mb-2">Tổng point sau hiệu suất</div>
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
                {!disabled &&
                  !isEmpty(tasks) &&
                  report.status === "drafted" && (
                    <div className="flex justify-end">
                      <div
                        className="text-green font-bold cursor-pointer hover:underline mb-1"
                        onClick={splitBonus}
                      >
                        Chia đều thưởng
                      </div>
                    </div>
                  )}
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
                  getChangeData={getChangeData}
                  getTaskEffort={getTaskEffort}
                  addMoreRow={addMoreRow}
                  removeRow={removeRow}
                  increasePoint={increasePoint}
                  increaseHour={increaseHour}
                  error={error}
                  allowEdit={true}
                />
              )}
              {!isEmpty(tasks) && report.status === "drafted" && (
                <div className="flex justify-between">
                  <div>
                    <Button
                      type="trans"
                      text="Lưu báo cáo"
                      onClick={updateReport}
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {disabled && (
                      <div className="text-sm font-bold text-red-500 cursor-pointer hover:underline">
                        {exceed ? "Point dự án không đủ!" : "Lỗi dữ liệu!"}
                      </div>
                    )}
                    <div>
                      <Button
                        text="Nộp báo cáo"
                        onClick={updateReportStatus}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {openConfirm && (
            <ConfirmModal
              project={project}
              cycle={cycle}
              closeModal={() => setOpenConfirm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;

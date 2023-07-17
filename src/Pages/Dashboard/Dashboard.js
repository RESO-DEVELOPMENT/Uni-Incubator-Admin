import Card from "../../Components/Card/Card";
import CardDate from "../../Components/Card/CardDate";
import EmployeeLevelTable from "../../Components/Table/EmployeeLevelTable";
import ProjectTable from "../../Components/Table/ProjectTable";
import CardFund from "../../Components/Card/CardFund";
import CardEmployee from "./../../Components/Card/CardEmployee";
import { useEffect, useState } from "react";
import { TopBar } from "./../Layout/TopBar";
import projectApi from "./../../API/Project/projectApi";
import Loading from "./../../Components/Loading/Loading";
import ToastError from "./../../Components/Alert/ToastError";
import salaryApi from "./../../API/Salary/salaryApi";
import systemApi from "../../API/Statistic/systemApi";
import walletApi from "../../API/Wallet/walletApi";
import { useSelector } from "react-redux";
import memberApi from "../../API/Member/memberApi";
import { find, findIndex, isEmpty, isNil } from "lodash";
import { onHubMessageReceived } from "../../Store/Middlewares/signalrConnection";
import JoinedProjectTable from "../../Components/Table/JoinedProjectTable";
import levelApi from "../../API/Level/levelApi";
import PayslipSimpleTable from "../../Components/Table/PayslipSimpleTable";

const Dashboard = () => {
  const currentMember = useSelector((state) => state.auth.member);

  const [totalProject, setTotalProject] = useState(0);
  const [totalMember, setTotalMember] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalSponsor, setTotalSponsor] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const [totalPayslip, setTotalPayslip] = useState(0);

  const [projects, setProjects] = useState([]);
  const [salaryCycle, setSalaryCycle] = useState({});
  const [members, setMembers] = useState([]);
  const [payslips, setPayslips] = useState([]);

  const [currentXp, setCurrenXp] = useState(0);
  const [nextlevel, setnextlevel] = useState({});

  const [projectLoading, setProjectLoading] = useState(false);
  const [statisticLoading, setStatisticLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [cycleLoading, setCycleLoading] = useState(false);

  const [reload, setReload] = useState(false);

  document.title = "Tổng quan | UniCare";

  useEffect(() => {
    onHubMessageReceived(() => {
      setReload(!reload);
    });
  }, [reload]);

  useEffect(() => {
    const getSalaryCycleAndUsers = async () => {
      setCycleLoading(true);
      setUserLoading(true);
      try {
        const response = await salaryApi.getMostRecent();
        if (response.success) {
          if (!isEmpty(response.data.message)) {
            const cycle = response.data.message[0];
            setSalaryCycle(cycle);
            if (currentMember.role === "ADMIN") {
              if (cycle.status === "paid") {
                const userRes = await salaryApi.getRecentLevelUp(
                  cycle.salaryCycleId
                );
                if (userRes.success) {
                  setMembers(userRes.data.message);
                }
              }
            } else if (currentMember.role === "USER") {
              const response = await memberApi.getSelfPayslip({
                page: 1,
                "page-size": 5,
                OrderBy: "dateDesc",
              });
              if (response.success) {
                const pagination = JSON.parse(response.headers.pagination);
                setTotalPayslip(pagination.totalItems);
                setPayslips(response.data.message);
              }
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setUserLoading(false);
      setCycleLoading(false);
    };

    const getPoints = async () => {
      try {
        if (currentMember.role === "ADMIN") {
          const response = await walletApi.getSystemWallet();
          if (response.success) {
            setTotalPoint(response.data.message.totalPoint);
          }
        } else if (currentMember.role === "USER") {
          const response = await memberApi.getSelfWallet();
          if (response.success) {
            setTotalPoint(response.data.message.totalPoint);
            setCurrenXp(response.data.message.totalXP);
            const leRes = await levelApi.get({
              OrderBy: "requiredXPAsc",
            });
            if (leRes.success) {
              const data = leRes.data.message;
              if (!isNil(currentMember.memberLevels)) {
                const currentXp = response.data.message.totalXP;
                const currentLevel = currentMember.memberLevels.level.levelName;

                const currentLevelIndex = findIndex(data, {
                  levelName: currentLevel,
                });

                const nextLevel = find(
                  data.slice(currentLevelIndex + 1),
                  (level) => level.xpNeeded > currentXp
                );
                setnextlevel(nextLevel);
              }
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getPoints();
    getSalaryCycleAndUsers();
  }, [currentMember, reload]);

  useEffect(() => {
    const getStatistic = async () => {
      setStatisticLoading(true);
      try {
        const response = await systemApi.get();
        if (response.success) {
          const statistic = response.data.message;
          setTotalMember(statistic.members.total);
          setTotalAdmin(statistic.members.admin);
          setTotalSponsor(statistic.sponsors.total);
          if (currentMember.role === "ADMIN") {
            setTotalProject(statistic.projects.total);
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setStatisticLoading(false);
    };

    const getProjects = async () => {
      setProjectLoading(true);
      try {
        if (currentMember.role === "ADMIN") {
          const response = await projectApi.get({
            page: 1,
            "page-size": 10,
            OrderBy: "dateDesc",
          });
          if (response.success) {
            setProjects(response.data.message);
          }
        } else if (currentMember.role === "USER") {
          const response = await memberApi.getSelfProjects({
            page: 1,
            "page-size": 10,
            OrderBy: "dateDesc",
          });
          if (response.success) {
            const pagination = JSON.parse(response.headers.pagination);
            setTotalProject(pagination.totalItems);
            setProjects(response.data.message);
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setProjectLoading(false);
    };

    getStatistic();
    getProjects();
  }, [currentMember.role]);

  return (
    <>
      <TopBar />
      <div className="flex justify-between px-5">
        <div className="grow px-5">
          <div className="flex justify-between mb-10">
            {statisticLoading ? (
              <Loading />
            ) : (
              <>
                {currentMember.role === "ADMIN" ? (
                  <>
                    <div>
                      <Card title="Tổng số dự án" description={totalProject} />
                    </div>
                    <div>
                      <Card title="Thành viên" description={totalMember} />
                    </div>
                    <div>
                      <Card title="Đơn vị tài trợ" description={totalSponsor} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Card
                        title="Cấp độ"
                        description={
                          !isNil(currentMember.memberLevels) && (
                            <>
                              <div
                                className="mb-2"
                                style={{
                                  color:
                                    currentMember.memberLevels.level.levelColor,
                                }}
                              >
                                {currentMember.memberLevels.level.levelName}
                              </div>
                              <div className="text-sm font-bold text-primary">
                                Hiện có{" "}
                                <span className="text-green">
                                  {currentXp}xp
                                </span>
                              </div>
                            </>
                          )
                        }
                      />
                    </div>
                    <div>
                      <Card
                        title="Cấp độ kế tiếp"
                        description={
                          !isNil(nextlevel) && (
                            <>
                              <div
                                className="mb-2"
                                style={{
                                  color: nextlevel.levelColor,
                                }}
                              >
                                {nextlevel.levelName}
                              </div>
                              <div className="text-primary font-bold text-sm">
                                Cần{" "}
                                <span className="text-green">
                                  {nextlevel?.xpNeeded - currentXp}xp
                                </span>{" "}
                                nữa
                              </div>
                            </>
                          )
                        }
                      />
                    </div>
                    <div>
                      <Card title="Đơn vị tài trợ" description={totalSponsor} />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="mb-10">
            {currentMember.role === "ADMIN" ? (
              <EmployeeLevelTable members={members} loading={userLoading} />
            ) : (
              <div className="rounded-lg shadow-md">
                <PayslipSimpleTable
                  payslips={payslips}
                  totalItems={totalPayslip}
                />
              </div>
            )}
          </div>
          <div className="mb-10">
            {currentMember.role === "ADMIN" ? (
              <ProjectTable projects={projects} loading={projectLoading} />
            ) : (
              <div className="rounded-lg shadow-md">
                <JoinedProjectTable
                  title="Dự án tham gia gần đây"
                  projects={projects}
                  loading={projectLoading}
                  disablePaginate={true}
                  totalItems={totalProject}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-64">
          <div className="mb-10">
            <CardDate
              title="Kỳ lương hiện tại"
              date={salaryCycle}
              loading={cycleLoading}
            />
          </div>
          <div className="mb-10">
            <CardFund title="Ngân sách" coin={totalPoint.toLocaleString()} />
          </div>
          <div className="mb-10">
            <CardEmployee
              title="Nhân sự"
              totalAdmin={totalAdmin}
              totalMember={totalMember - totalAdmin}
              loading={userLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

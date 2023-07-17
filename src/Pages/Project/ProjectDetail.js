import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { TopBar } from "../Layout/TopBar";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import ToastError from "./../../Components/Alert/ToastError";
import projectApi from "./../../API/Project/projectApi";
import { FaUserAlt } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { useSelector } from "react-redux";
import { find, isEmpty, last, split } from "lodash";
import ProjectMembers from "./Pages/ProjectMembers";
import {
  BsArrowBarRight,
  BsArrowRight,
  BsFillCalendar2RangeFill,
  BsNewspaper,
} from "react-icons/bs";
import { BiUser, BiTransfer } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { TbReport } from "react-icons/tb";
import Loading from "../../Components/Loading/Loading";
import ProjectMemberPayslips from "./Pages/ProjectMemberPayslips";
import { textToColor, toVN } from "../../Ultilities/String";
import ProjectSponsors from "./Pages/ProjectSponsors";
import ProjectTransactions from "./Pages/ProjectTransactions";
import ProjectReports from "./Pages/ProjectReports";
import ProjectMilestones from "./Pages/ProjectMilestones";
import { AiFillEdit, AiFillFile } from "react-icons/ai";
import ToastSuccess from "../../Components/Alert/ToastSuccess";
import { differenceInDays } from "date-fns";
import { onHubMessageReceived } from "../../Store/Middlewares/signalrConnection";

const ProjectDetail = () => {
  const currentMember = useSelector((state) => state.auth.member);
  const [isManager, setIsManager] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [project, setProject] = useState({});
  const [readMore, setReadMore] = useState(false);

  const [loading, setLoading] = useState(false);

  const [activeReload, setActiveReload] = useState(false);

  const [haveEndReq, setHaveEndReq] = useState(false);

  const activeClassName =
    "flex items-center gap-2 p-3 text-green border-b-2 border-green";

  const nonActiveClassName =
    "flex items-center gap-2 p-3 text-black/70 hover:text-green";

  const { projectId } = useParams();
  let { page } = useParams();

  const navigate = useNavigate();

  const getActiveReload = () => {
    setActiveReload(!activeReload);
  };

  const updateProjectStatus = async (status) => {
    try {
      const statusRes = await projectApi.updateProjectStatus({
        projectId: projectId,
        projectStatus: status,
      });
      if (statusRes.success) {
        ToastSuccess({ text: "Đã bắt đầu dự án" });
        setActiveReload(!activeReload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  useEffect(() => {
    onHubMessageReceived(() => {
      setActiveReload(!activeReload);
    });
  }, [activeReload]);

  useEffect(() => {
    const getProjectById = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getById(projectId);
        if (response.success) {
          const project = response.data.message;
          setProject(project);
          const memberOfThisProject = find(project.members, {
            member: { memberId: currentMember.memberId },
          });
          if (memberOfThisProject) {
            setIsMember(true);
            if (memberOfThisProject.role === "manager") {
              setIsManager(true);
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getProjectById();
  }, [projectId, currentMember.role, currentMember.memberId, activeReload]);

  useEffect(() => {
    const getEndReq = async () => {
      try {
        const response = await projectApi.getProjectEndRequest(projectId);
        if (response.success) {
          const data = response.data.message;
          if (!isEmpty(data) && find(data, { status: "created" })) {
            setHaveEndReq(true);
          } else {
            setHaveEndReq(false);
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    if (currentMember.role === "ADMIN") {
      getEndReq();
    }
  }, [projectId, currentMember.role, activeReload]);

  useEffect(() => {
    if (!page) {
      navigate(`/projects/${projectId}/members`, { replace: true });
    }
  }, [page, navigate, projectId]);

  return (
    <>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="grid grid-cols-4 mb-5 gap-7">
          <div className="bg-white rounded-lg shadow-md flex py-5 px-10 gap-16 font-bold col-span-3">
            <div className="relative h-fit">
              <CircularProgressbar
                className="w-44"
                value={
                  project.projectStatus === "ended" ||
                  project.projectStatus === "stopped" ||
                  project.projectStatus === "cancelled"
                    ? 100
                    : project.startedAt && project.endedAt
                    ? (
                        (differenceInDays(
                          new Date(),
                          new Date(project.startedAt)
                        ) /
                          differenceInDays(
                            new Date(project.endedAt),
                            new Date(project.startedAt)
                          )) *
                        100
                      ).toFixed()
                    : 0
                }
                maxValue={100}
                text={`${
                  project.projectStatus === "ended" ||
                  project.projectStatus === "stopped" ||
                  project.projectStatus === "cancelled"
                    ? 100
                    : project.startedAt && project.endedAt
                    ? (
                        (differenceInDays(
                          new Date(),
                          new Date(project.startedAt)
                        ) /
                          differenceInDays(
                            new Date(project.endedAt),
                            new Date(project.startedAt)
                          )) *
                        100
                      ).toFixed()
                    : 0
                }%`}
                styles={{
                  path: {
                    stroke: textToColor(project.projectStatus),
                  },
                  text: {
                    fill: textToColor(project.projectStatus),
                    fontWeight: `bold`,
                  },
                }}
              />
              <div
                className="absolute top-2/3 left-1/2 -translate-x-1/2 text-xs text-center"
                style={{ color: textToColor(project.projectStatus) }}
              >
                {toVN(project.projectStatus)}
              </div>
            </div>
            {loading ? (
              <div className="w-full">
                <div className="mb-3 bg-slate-200 rounded-md animate-pulse w-1/6 h-5"></div>
                <div className="mb-8 bg-slate-200 rounded-md animate-pulse w-1/2 h-8"></div>
                <div className="mb-5 bg-slate-200 rounded-md animate-pulse w-1/6 h-6"></div>
                <div className="bg-slate-200 rounded-md animate-pulse w-full h-6"></div>
              </div>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-6">
                  <div className="col-span-4">
                    <div>[{project.projectShortName}]</div>
                    <div className="text-2xl mb-8">{project.projectName}</div>
                  </div>
                  {currentMember.role === "ADMIN" &&
                    project.projectStatus !== "ended" &&
                    project.projectStatus !== "stopped" &&
                    project.projectStatus !== "cancelled" && (
                      <div
                        className="flex items-center h-fit gap-2 text-green font-bold cursor-pointer col-span-2 justify-end"
                        onClick={() =>
                          navigate(`/projects/${project.projectId}/edit`)
                        }
                      >
                        <div>
                          <AiFillEdit />
                        </div>
                        <div>Chỉnh sửa</div>
                        <div>
                          <BsArrowRight />
                        </div>
                      </div>
                    )}
                  {currentMember.role !== "ADMIN" &&
                    isManager &&
                    project.projectStatus === "created" && (
                      <div
                        onClick={() => updateProjectStatus("started")}
                        className="text-green text-sm cursor-pointer flex items-center gap-2 h-fit col-span-2 justify-end"
                      >
                        <div>Bắt đầu</div>
                        <div>
                          <BsArrowBarRight />
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex gap-2">
                  <div className="w-2/6">
                    {/* MANAGER */}
                    <div className="flex items-center gap-2 text-black/70 mb-3">
                      <div>
                        <FaUserAlt />
                      </div>
                      <div>Quản lý dự án: </div>
                    </div>
                    {/* FILE */}
                    <div className="flex items-center gap-2 text-black/70 mb-3">
                      <div>
                        <AiFillFile />
                      </div>
                      <div>Tệp tin dự án: </div>
                    </div>
                    {/* DESCRIPTION */}
                    <div className="flex items-center gap-2 text-black/70">
                      <div>
                        <GrNotes />
                      </div>
                      <div>Mô tả dự án: </div>
                    </div>
                  </div>
                  <div className="w-5/6">
                    <div className="mb-3 text-per-50">
                      {project.members?.map((member, index) => {
                        if (member.role.toUpperCase() === "MANAGER") {
                          return (
                            <div key={index}>{member.member.fullName}</div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                    <div className="mb-3 text-sm">
                      {!isEmpty(project.projectFiles) ? (
                        <div
                          className="hover:underline cursor-pointer text-primary font-normal"
                          onClick={() =>
                            window.open(
                              project.projectFiles[0].file.directUrl,
                              "_blank"
                            )
                          }
                        >
                          {last(
                            split(project.projectFiles[0].file.directUrl, "/")
                          )}
                        </div>
                      ) : (
                        <div className="font-normal text-primary">
                          Không có tệp tin
                        </div>
                      )}
                    </div>
                    <div className="font-normal text-slate-500 text-justify break-words">
                      {readMore ? (
                        <>
                          {project.projectLongDescription}{" "}
                          {project.projectLongDescription &&
                            project.projectLongDescription.length >= 100 && (
                              <span
                                className="hover:text-green cursor-pointer font-bold"
                                onClick={() => setReadMore(false)}
                              >
                                Thu gọn
                              </span>
                            )}
                        </>
                      ) : (
                        <>
                          {project.projectShortDescription}{" "}
                          {project.projectShortDescription &&
                            project.projectShortDescription.length >= 50 && (
                              <span
                                className="hover:text-green cursor-pointer font-bold"
                                onClick={() => setReadMore(true)}
                              >
                                Xem thêm
                              </span>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 h-fit">
            <div className="text-center font-bold text-2xl mb-3">
              Quỹ point dự kiến
            </div>
            {loading ? (
              <div>
                <Loading />
              </div>
            ) : (
              <>
                <div className="text-center text-green font-bold text-xl">
                  {project.budget && project.budget.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="flex gap-2 font-bold text-black/70 border-b border-slate-200">
            <div>
              <NavLink
                to={`/projects/${projectId}/members`}
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <BiUser />
                </div>
                <div>THÀNH VIÊN</div>
              </NavLink>
            </div>
            {(currentMember.role === "ADMIN" || isManager) && (
              <>
                <div>
                  <NavLink
                    to={`/projects/${projectId}/payslips`}
                    className={({ isActive }) =>
                      isActive ? activeClassName : nonActiveClassName
                    }
                  >
                    <div>
                      <BsNewspaper />
                    </div>
                    <div>PHIẾU LƯƠNG</div>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    to={`/projects/${projectId}/sponsors`}
                    className={({ isActive }) =>
                      isActive ? activeClassName : nonActiveClassName
                    }
                  >
                    <div>
                      <FiUsers />
                    </div>
                    <div>TÀI TRỢ</div>
                  </NavLink>
                </div>
                {!isManager && (
                  <div>
                    <NavLink
                      to={`/projects/${projectId}/transactions`}
                      className={({ isActive }) =>
                        isActive ? activeClassName : nonActiveClassName
                      }
                    >
                      <div>
                        <BiTransfer />
                      </div>
                      <div>BIẾN ĐỘNG POINT</div>
                    </NavLink>
                  </div>
                )}
                <div>
                  <NavLink
                    to={`/projects/${projectId}/reports`}
                    className={({ isActive }) =>
                      isActive ? activeClassName : nonActiveClassName
                    }
                  >
                    <div>
                      <TbReport />
                    </div>
                    <div>BÁO CÁO</div>
                  </NavLink>
                </div>
              </>
            )}
            <div className="relative">
              <NavLink
                to={`/projects/${projectId}/milestones`}
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
              >
                <div>
                  <BsFillCalendar2RangeFill />
                </div>
                <div>KẾ HOẠCH</div>
                {haveEndReq && (
                  <div className="absolute w-2 h-2 rounded-full bg-red-500 top-2 right-0"></div>
                )}
              </NavLink>
            </div>
          </div>
          <div className="py-5 px-10">
            {page === "members" ? (
              <ProjectMembers
                isManager={isManager}
                currentMember={currentMember}
                projectId={projectId}
                project={project}
                loading={loading}
                getActiveReload={getActiveReload}
              />
            ) : page === "payslips" ? (
              <ProjectMemberPayslips
                currentMember={currentMember}
                projectId={projectId}
                isManager={isManager}
              />
            ) : page === "sponsors" ? (
              <ProjectSponsors
                currentMember={currentMember}
                projectId={projectId}
                isManager={isManager}
                project={project}
              />
            ) : page === "transactions" ? (
              <ProjectTransactions
                currentMember={currentMember}
                projectId={projectId}
                isManager={isManager}
              />
            ) : page === "reports" ? (
              <ProjectReports
                currentMember={currentMember}
                projectId={projectId}
                isManager={isManager}
                isMember={isMember}
              />
            ) : page === "milestones" ? (
              <ProjectMilestones
                currentMember={currentMember}
                projectId={projectId}
                project={project}
                isManager={isManager}
                isMember={isMember}
                getActiveReload={getActiveReload}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;

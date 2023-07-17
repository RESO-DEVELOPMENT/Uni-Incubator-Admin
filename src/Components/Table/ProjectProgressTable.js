import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BsArrowRight } from "react-icons/bs";
import Paginate from "../Paginate/Paginate";
import { useNavigate } from "react-router-dom";
import Loading from "./../Loading/Loading";
import { isEmpty } from "lodash";
import { textToColor, toVN } from "../../Ultilities/String";
import { differenceInDays } from "date-fns";

const ProjectProgressTable = (props) => {
  const navigate = useNavigate();

  const getPage = (page) => {
    props.getPage(page);
  };

  return (
    <div className="bg-white p-5 pb-1 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-bold text-2xl">Tiến độ dự án</div>
        <div
          className="font-bold text-sm text-green cursor-pointer"
          onClick={() => navigate("/projects/discover")}
        >
          Xem tất cả
        </div>
      </div>
      <div className="mt-8">
        {props.loading ? (
          <Loading />
        ) : (
          <>
            {!isEmpty(props.projects) ? (
              props.projects.map((project, index) => {
                return (
                  <div
                    key={project.projectId}
                    className="flex rounded-lg border items-center justify-between border-slate-300 p-5 font-bold mb-2"
                  >
                    <div className="flex items-center gap-4">
                      <CircularProgressbar
                        className="w-11 h-11 font-bold"
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
                      <div>
                        <div className="text-sm">{project.projectName}</div>
                        <div
                          className={`text-sm ${
                            project.projectStatus === "created"
                              ? "text-per-25"
                              : project.projectStatus === "started"
                              ? "text-per-50"
                              : project.projectStatus === "ended"
                              ? "text-green"
                              : "text-red-500"
                          }`}
                        >
                          {toVN(project.projectStatus)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="flex -space-x-4">
                        {project.members.map((member, index) => {
                          if (index < 5) {
                            return (
                              <img
                                key={index}
                                className="w-8 h-8 rounded-full"
                                src={
                                  member.member.imageUrl
                                    ? member.member.imageUrl
                                    : `https://ui-avatars.com/api/?name=${member.member.fullName}&length=1`
                                }
                                alt="a"
                              />
                            );
                          } else if (index === 5) {
                            return (
                              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-normal text-white">
                                {`+${project.members.length - 5}`}
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                      <div className="text-xs rounded-md bg-orange-200 py-1 px-2 flex items-start justify-center font-normal w-24">
                        {project.projectStatus === "ended" ||
                        project.projectStatus === "stopped" ||
                        project.projectStatus === "cancelled"
                          ? "Đã kết thúc"
                          : project.startedAt && !project.endedAt
                          ? differenceInDays(
                              new Date(),
                              new Date(project.startedAt)
                            ) > 0
                            ? `${differenceInDays(
                                new Date(),
                                new Date(project.startedAt)
                              )} ngày trước`
                            : `Gần đây`
                          : project.startedAt && project.endedAt
                          ? `Còn ${
                              differenceInDays(
                                new Date(project.endedAt),
                                new Date(project.startedAt)
                              ) -
                              differenceInDays(
                                new Date(),
                                new Date(project.startedAt)
                              )
                            } ngày`
                          : "Chưa bắt đầu"}
                      </div>
                      <div
                        className="cursor-pointer text-green rounded-full p-2 hover:bg-green/20"
                        onClick={() =>
                          navigate(`/projects/${project.projectId}`)
                        }
                      >
                        <BsArrowRight />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="font-bold text-center text-lg">
                Không có dự án
              </div>
            )}
          </>
        )}
      </div>
      {!props.loading && props.projects.length > 0 ? (
        <div className="my-5">
          <Paginate
            page={props.page}
            pageSize={props.pageSize}
            totalPages={props.totalPages}
            currentPage={props.currentPage}
            getPage={getPage}
          />
        </div>
      ) : (
        <div className="pb-5"></div>
      )}
    </div>
  );
};

export default ProjectProgressTable;

import { isEmpty } from "lodash";
import { CircularProgressbar } from "react-circular-progressbar";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toDate } from "../../Ultilities/Date";
import Loading from "../Loading/Loading";
import Paginate from "../Paginate/Paginate";
import { differenceInDays } from "date-fns";
import { textToColor, toVN } from "../../Ultilities/String";

const JoinedProjectTable = (props) => {
  const navigate = useNavigate();

  const getPage = (page) => {
    props.getPage(page);
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200">
      <div className="font-bold mb-3">
        <div className="mb-2 flex justify-between items-center">
          <div className="text-xl">{props.title}</div>
          {props.disablePaginate && (
            <div
              className="font-bold text-green hover:underline cursor-pointer text-sm"
              onClick={() => navigate("/profile")}
            >
              Xem tất cả
            </div>
          )}
        </div>
        <div className="text-orange-700 text-sm">
          Số dự án: {props.totalItems}
        </div>
      </div>
      {props.loading ? (
        <div className="my-5">
          <Loading />
        </div>
      ) : (
        <>
          {!isEmpty(props.projects) ? (
            <table className="table-auto w-full font-bold border-separate border-spacing-y-3">
              <thead>
                <tr className="text-black/70 text-center">
                  <th className="w-1/5">Thông tin dự án</th>
                  <th className="w-1/5">Ngày khởi tạo</th>
                  <th className="w-1/5">Ngày bắt đầu</th>
                  <th className="w-1/5">Vai trò</th>
                  <th className="w-1/5">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {props.projects.map((project) => {
                  return (
                    <tr key={project.projectId}>
                      <td>
                        <div className="grid grid-cols-6 gap-2">
                          <div className="col-span-2">
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
                                  stroke:
                                    project.projectStatus === "created"
                                      ? "#FF5D9E"
                                      : project.projectStatus === "started"
                                      ? "#5B48CC"
                                      : project.projectStatus === "ended"
                                      ? "#30BC97"
                                      : "rgb(239 68 68)",
                                },
                                text: {
                                  fill:
                                    project.projectStatus === "created"
                                      ? "#FF5D9E"
                                      : project.projectStatus === "started"
                                      ? "#5B48CC"
                                      : project.projectStatus === "ended"
                                      ? "#30BC97"
                                      : "rgb(239 68 68)",
                                  fontWeight: `bold`,
                                },
                              }}
                            />
                          </div>
                          <div className="col-span-4">
                            <div
                              className="cursor-pointer hover:underline truncate"
                              onClick={() =>
                                navigate(`/projects/${project.projectId}`)
                              }
                            >
                              {project.projectName}
                            </div>
                            <div className="text-xs text-primary">
                              {project.projectShortName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-center text-primary">
                          {toDate(project.createdAt)}
                        </div>
                      </td>
                      <td className="font-normal text-center">
                        {project.startedAt ? (
                          <div className="text-center text-primary font-bold">
                            {toDate(project.startedAt)}
                          </div>
                        ) : (
                          <div className="text-sm">
                            <span className="py-1 px-3 rounded-lg bg-red-100 text-red-600">
                              Chưa bắt đầu
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="text-center font-normal">
                        <span className="py-1 px-3 bg-orange-100 rounded-lg">
                          {toVN(project.role)}
                        </span>
                      </td>
                      <td>
                        <div
                          className="text-center"
                          style={{ color: textToColor(project.projectStatus) }}
                        >
                          {toVN(project.projectStatus)}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <div
                            className="cursor-pointer w-fit text-green rounded-full p-1 hover:bg-green/20"
                            onClick={() =>
                              navigate(`/projects/${project.projectId}`)
                            }
                          >
                            <BsArrowRight />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="mt-5 text-center font-bold">Không có dự án nào</div>
          )}
        </>
      )}
      {!props.disablePaginate && !props.loading && !isEmpty(props.projects) && (
        <div className="my-5">
          <Paginate
            page={props.page}
            pageSize={props.pageSize}
            totalPages={props.totalPages}
            currentPage={props.currentPage}
            getPage={getPage}
          />
        </div>
      )}
    </div>
  );
};

export default JoinedProjectTable;

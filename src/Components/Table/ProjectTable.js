import Button from "../Button/Button";
import Loading from "../Loading/Loading";
import { toDate } from "./../../Ultilities/Date";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import { toVN } from "../../Ultilities/String";

const ProjectTable = (props) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-5 pb-1 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="font-bold">
          <div className="text-xl">Dự án gần đây</div>
        </div>
        {props.projects && (
          <div>
            <Button text="Xem" onClick={() => navigate("/projects")} />
          </div>
        )}
      </div>
      <div>
        {props.loading ? (
          <>
            <div className="mb-5">
              <Loading />
            </div>
          </>
        ) : (
          <>
            {!isEmpty(props.projects) ? (
              <table className="table-auto w-full text-left text-gray-700 border-separate border-spacing-y-5">
                <thead>
                  <tr>
                    <th className="w-1/5 text-center">Tên dự án</th>
                    <th className="w-auto text-center">Ngày khởi tạo</th>
                    <th className="w-1/5 text-center">Quỹ dự án</th>
                    <th className="w-1/5 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {props.projects?.map((project) => {
                    return (
                      <tr key={project.projectId}>
                        <td>{project.projectName}</td>
                        <td className="text-center">
                          {toDate(project.createdAt)}
                        </td>
                        <td className="text-center">
                          {project.budget.toLocaleString()}
                        </td>
                        <td
                          className={`text-center font-bold ${
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center font-bold text-lg mb-5">
                Không có dự án
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectTable;

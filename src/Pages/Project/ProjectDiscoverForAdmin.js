import { useState } from "react";
import { TopBar } from "../Layout/TopBar";
import DateInput from "../../Components/Input/DateInput";
import { useEffect } from "react";
import projectApi from "../../API/Project/projectApi";
import ToastError from "../../Components/Alert/ToastError";
import ProjectDiscoverTable from "../../Components/Table/ProjectDiscoverTable";
import { find, isEmpty } from "lodash";

const ProjectDiscoverForAdmin = () => {
  const [projects, setProjects] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);

  document.title = "Dự án | UniCare";

  const getPage = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const getStartDate = (date) => {
    setPage(-1);
    setStartDate(date);
  };

  const getEndDate = (date) => {
    setPage(-1);
    setEndDate(date);
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getProjects = async () => {
      setLoading(true);
      try {
        const response = await projectApi.get({
          page: page,
          "page-size": pageSize,
          OrderBy: "dateDesc",
          StartAfter: startDate.startDate,
          EndBefore: endDate.endDate,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          settotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          const data = response.data.message;
          const promises = data.map(async (project) => {
            const response = await projectApi.getProjectEndRequest(
              project.projectId
            );
            return response.data.message;
          });
          const projectData = await Promise.all(promises);
          const projectList = projectData.map((item, index) => {
            if (!isEmpty(item) && find(item, { status: "created" })) {
              return {
                ...data[index],
                haveEndReq: true,
              };
            } else {
              return {
                ...data[index],
                haveEndReq: false,
              };
            }
          });
          setProjects(projectList);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getProjects();
  }, [page, pageSize, startDate, endDate]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-14 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h1 className="mb-8 font-bold text-3xl">Thống kê dự án</h1>

          <div className="grid grid-cols-2 gap-10 mb-8">
            <div className="grid grid-cols-2 gap-10">
              <div>
                <DateInput
                  placeholder="Từ"
                  value={startDate}
                  onChange={getStartDate}
                  useRange={false}
                  asSingle={true}
                  displayFormat={"DD/MM/YYYY"}
                />
              </div>
              <div>
                <DateInput
                  placeholder="Đến"
                  value={endDate}
                  onChange={getEndDate}
                  useRange={false}
                  asSingle={true}
                  displayFormat={"DD/MM/YYYY"}
                />
              </div>
            </div>
          </div>
          <div>
            <div>
              <ProjectDiscoverTable
                data={projects}
                loading={loading}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                currentPage={currentPage}
                getPage={getPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDiscoverForAdmin;

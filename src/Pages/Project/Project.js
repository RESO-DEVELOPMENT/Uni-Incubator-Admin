import { useEffect, useState } from "react";
import { TopBar } from "./../Layout/TopBar";
import project_pic from "../../Pictures/create_project.png";
import { useSelector } from "react-redux";
import ButtonIcon from "../../Components/Button/ButtonIcon";
import { MdOutlineAddCircle } from "react-icons/md";
import CardProjectCount from "../../Components/Card/CardProjectCount";
import ProjectProgressTable from "./../../Components/Table/ProjectProgressTable";
import DateInput from "../../Components/Input/DateInput";
import SelectSimpleDot from "../../Components/Select/SelectSimpleDot";
import TextInputSimple from "./../../Components/Input/TextInputSimple";
import SliderMultiple from "./../../Components/Silder/SilderMultiple";
import { useNavigate } from "react-router-dom";
import projectApi from "./../../API/Project/projectApi";
import ToastError from "../../Components/Alert/ToastError";
import { isEmpty, isNil, omitBy } from "lodash";
import statisticApi from "../../API/Statistic/systemApi";

const Project = () => {
  const currentMember = useSelector((state) => state.auth.member);

  const [status] = useState([
    { value: "created", label: "Khởi tạo", color: "#FF5D9E" },
    { value: "started", label: "Hiện thực", color: "#5B48CC" },
    { value: "ended", label: "Hoàn thành", color: "#30BC97" },
    { value: "stopped", label: "Dừng", color: "red" },
    { value: "cancelled", label: "Hủy bỏ", color: "red" },
  ]);

  const [total, setTotal] = useState({
    totalProjects: 0,
    totalDone: 0,
  });
  const [statisticLoading, setStatisticLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [manager, setManager] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(currentMember.role === "ADMIN" ? 5 : 10);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const member = useSelector((state) => state.auth.member);

  const navigate = useNavigate();

  document.title = "Dự án | UniCare";

  const getStartDate = (date) => {
    setPage(-1);
    setStartDate(date);
  };

  const getEndDate = (date) => {
    setPage(-1);
    setEndDate(date);
  };

  const getStatusFilter = (status) => {
    setPage(-1);
    if (status) {
      setStatusFilter(status.value);
    } else {
      setStatusFilter(undefined);
    }
  };

  const getManager = (data) => {
    setPage(-1);
    setManager(data.target.value);
  };

  const getPriceRange = (data) => {
    setPage(-1);
    setMinPrice(data[0]);
    setMaxPrice(data[1]);
  };

  const getPage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getRecentProject = async () => {
      setLoading(true);
      try {
        const params = {
          page: page,
          "page-size": pageSize,
          OrderBy: "dateDesc",
          Status: statusFilter,
          ManagerEmail: manager,
          BudgetMin: minPrice === 0 ? null : minPrice,
          BudgetMax: maxPrice === 0 ? null : maxPrice,
          StartAfter: startDate.startDate,
          EndBefore: endDate.endDate,
          ProjectName: projectName,
        };
        const response = await projectApi.get(omitBy(params, isNil));
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    if (
      !isEmpty(projectName.trim()) ||
      !isEmpty(manager.trim()) ||
      (minPrice && minPrice > 0) ||
      (maxPrice && maxPrice > 0)
    ) {
      const timer = setTimeout(() => {
        getRecentProject();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getRecentProject();
    }
  }, [
    page,
    pageSize,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    statusFilter,
    manager,
    projectName,
  ]);

  useEffect(() => {
    const getStatistic = async () => {
      setStatisticLoading(true);
      try {
        const response = await statisticApi.get();
        if (response.success) {
          const statistic = response.data.message;
          setTotal({
            totalProjects: statistic.projects.total,
            totalDone: statistic.projects.ended,
          });
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setStatisticLoading(false);
    };
    getStatistic();
  }, []);

  return (
    <>
      <TopBar />
      <div className="flex justify-between px-5">
        <div className="grow px-5">
          {currentMember && currentMember.role === "ADMIN" && (
            <div className="mb-10 bg-white shadow-md flex py-2 px-16 rounded-lg gap-4 h-64">
              <img className="w-60 h-60" src={project_pic} alt="project_pic" />
              <div className="font-bold w-full">
                <div className="mt-5 mb-3">Chào {member.fullName}</div>
                <div className="text-3xl mb-3">Trang quản lý dự án</div>
                <div className="font-normal">
                  Quản lý, chỉnh sửa, xem tiến độ của các dự án
                </div>
                <div className="w-fit mt-10">
                  <ButtonIcon
                    text="Tạo dự án mới"
                    icon={<MdOutlineAddCircle className="text-white text-lg" />}
                    onClick={() => navigate("/projects/create")}
                  ></ButtonIcon>
                </div>
              </div>
            </div>
          )}
          <div className="mb-10">
            <ProjectProgressTable
              projects={projects}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
            />
          </div>
        </div>
        <div className="w-64">
          {currentMember && currentMember.role === "ADMIN" && (
            <div className="mb-10">
              <CardProjectCount
                title="Tổng số dự án"
                total={total.totalProjects}
                ended={total.totalDone}
                loading={statisticLoading}
              />
            </div>
          )}

          <div className="bg-white shadow-md py-5 px-2 rounded-lg mb-5">
            <div className="text-center font-bold text-xl mb-8">
              Tìm dự án theo
            </div>
            <div className="mb-10">
              <TextInputSimple
                value={projectName}
                name="manager"
                onChange={(e) => setProjectName(e.target.value)}
                label="Tên dự án"
                placeholder="Tên dự án"
              />
            </div>
            <div className="mb-10">
              <DateInput
                placeholder="Từ"
                value={startDate}
                onChange={getStartDate}
                useRange={false}
                asSingle={true}
                displayFormat={"DD/MM/YYYY"}
              />
            </div>
            <div className="mb-10">
              <DateInput
                placeholder="Đến"
                value={endDate}
                onChange={getEndDate}
                useRange={false}
                asSingle={true}
                displayFormat={"DD/MM/YYYY"}
              />
            </div>
            <div className="mb-10">
              <SelectSimpleDot
                label="Tiến độ"
                placeholder="Chọn trạng thái"
                options={status}
                onChange={getStatusFilter}
              />
            </div>
            <div className="mb-10">
              <TextInputSimple
                value={manager}
                name="manager"
                onChange={getManager}
                label="Quản lý"
                placeholder="Tên manager"
              />
            </div>
            <div className="mb-20 px-3">
              <div className="text-sm text-primary font-bold mb-10">
                Quỹ dự án (Point)
              </div>
              <SliderMultiple
                min={minPrice}
                max={maxPrice}
                onChange={getPriceRange}
              />
            </div>
          </div>

          {currentMember && currentMember.role === "USER" && (
            <div className="mb-10">
              <CardProjectCount
                title="Tổng số dự án"
                total={total.totalProjects}
                ended={total.totalDone}
                loading={statisticLoading}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Project;

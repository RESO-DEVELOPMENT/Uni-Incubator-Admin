import { TopBar } from "../Layout/TopBar";
import report_pic from "../../Pictures/report_pic.png";
import { TbListCheck, TbReport } from "react-icons/tb";
import { useEffect, useState } from "react";
import ToastError from "../../Components/Alert/ToastError";
import projectApi from "../../API/Project/projectApi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { isNil, omitBy } from "lodash";
import { useSelector } from "react-redux";
import ReportsTable from "../../Components/Table/ReportsTable";
import ButtonIcon from "../../Components/Button/ButtonIcon";
import { MdOutlineAddCircle } from "react-icons/md";
import AddReportModal from "./Components/AddReportModal";

const Report = () => {
  const currentMember = useSelector((state) => state.auth.member);

  const [reports, setReports] = useState([]);

  const [tab, setTab] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  document.title = "Báo cáo | UniCare";

  const nonActiveClassname =
    "text-black/70 p-3 cursor-pointer hover:border-b-2 hover:border-green hover:text-green";
  const activeClassname =
    "text-green p-3 cursor-pointer border-b-2 border-green";

  const getPage = (page) => {
    setPage(page);
  };
  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getReports = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getAllReports(
          omitBy(
            {
              page: page,
              "page-size": pageSize,
              status: tab === 2 ? "created" : tab === 3 ? "accepted" : null,
            },
            isNil
          )
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setReports(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };
    getReports();
  }, [tab, page, pageSize]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="grid grid-cols-8 gap-10 mb-10">
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow-md grid grid-cols-5 p-5">
              <div className="col-span-2 flex justify-center items-center">
                <img className="w-40 h-40" src={report_pic} alt="img" />
              </div>
              <div className="col-span-3">
                <div className="font-bold text-3xl mb-5">
                  Quản lý báo cáo lương
                </div>
                <div className="mb-10">
                  Quản lý, duyệt báo cáo lương của các dự án trong vườm ươm Uni
                  Incubator
                </div>
                <div>
                  <div className="w-fit">
                    <ButtonIcon
                      text="Tạo báo cáo mới"
                      icon={
                        <MdOutlineAddCircle className="text-white text-lg" />
                      }
                      onClick={() => setOpenModal(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-center items-center text-per-75 font-bold text-xl h-full">
              <div>Tổng số báo cáo</div>
              <div className="flex gap-2 items-center">
                <div>{reports.length}</div>
                <div>
                  <TbReport />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-md border border-slate-200">
            <div className="px-5 bg-green/10 flex gap-5">
              <div
                className={`flex items-center gap-2 ${
                  tab === 1 ? activeClassname : nonActiveClassname
                }`}
                onClick={() => setTab(1)}
              >
                <div>
                  <TbReport />
                </div>
                <div>Tất cả</div>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  tab === 2 ? activeClassname : nonActiveClassname
                }`}
                onClick={() => setTab(2)}
              >
                <div>
                  <AiOutlineUnorderedList />
                </div>
                <div>Chờ duyệt</div>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  tab === 3 ? activeClassname : nonActiveClassname
                }`}
                onClick={() => setTab(3)}
              >
                <div>
                  <TbListCheck />
                </div>
                <div>Đã duyệt</div>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-10">
                <div className="font-bold text-xl mb-2">
                  Báo cáo lương của thành viên
                </div>
                <div className="text-orange-600 font-bold">
                  Tổng số báo cáo: {reports.length}
                </div>
              </div>
              <div>
                <ReportsTable
                  reports={reports}
                  loading={loading}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  getPage={getPage}
                  isManager={true}
                  currentMember={currentMember}
                />
              </div>
            </div>
          </div>
        </div>
        {openModal && <AddReportModal closeModal={() => setOpenModal(false)} />}
      </div>
    </div>
  );
};

export default Report;

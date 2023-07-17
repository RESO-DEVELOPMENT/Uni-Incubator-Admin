import { useState } from "react";
import { TopBar } from "../Layout/TopBar";
import { useEffect } from "react";
import projectApi from "../../API/Project/projectApi";
import ToastError from "../../Components/Alert/ToastError";
import ReportsTable from "../../Components/Table/ReportsTable";
import { useSelector } from "react-redux";
import { filter, size } from "lodash";
import { TbReport } from "react-icons/tb";
import salaryApi from "../../API/Salary/salaryApi";
import { toDate } from "../../Ultilities/Date";
import SelectSimple from "../../Components/Select/SelectSimple";
import { CircularProgressbar } from "react-circular-progressbar";

const ReportForAdmin = () => {
  const currentMember = useSelector((state) => state.auth.member);

  const [reports, setReports] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [cycles, setCycles] = useState([{ label: "Tất cả", value: "" }]);
  const [currentCycle, setCurrentCycles] = useState("");

  const [accepted, setAccepted] = useState(0);
  const [notAccepted, setNotAccepted] = useState(0);

  const [loading, setLoading] = useState(false);

  document.title = "Báo cáo | UniCare";

  const getPage = (page) => {
    setPage(page);
  };

  const getCurrentCycle = async (option) => {
    setPage(-1);
    setCurrentCycles(option.value);
  };

  useEffect(() => {
    const getAllCycles = async () => {
      try {
        const response = await salaryApi.getAll();
        if (response.success) {
          const cycleList = response.data.message;
          const options = [];
          cycleList.forEach((cycle) => {
            options.push({
              value: cycle.salaryCycleId,
              label: `${toDate(cycle.createdAt)} - ${toDate(cycle.endedAt)}`,
            });
          });
          setCycles([{ label: "Tất cả", value: "" }, ...options]);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    getAllCycles();
  }, []);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getReports = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getAllReports({
          page: page,
          "page-size": pageSize,
          SalaryCycleId: currentCycle,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setTotalItems(pagination.totalItems);
          setReports(response.data.message);
          const accepted = size(
            filter(response.data.message, { status: "accepted" })
          );
          const processed = size(
            filter(response.data.message, {
              status: "processed",
            })
          );
          const created = size(
            filter(response.data.message, { status: "created" })
          );
          setAccepted(accepted + processed);
          setNotAccepted(created);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };
    getReports();
  }, [page, pageSize, currentCycle]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-xl font-bold mb-10">Báo cáo trong chu kỳ</div>
          <div className="mb-10 grid grid-cols-4 px-10">
            <div className="flex gap-4">
              <div className="font-bold leading-8">
                <div>Tổng báo cáo</div>
                <div className="text-purple text-xl">{size(reports)}</div>
              </div>
              <div className="text-green text-5xl">
                <TbReport />
              </div>
            </div>
            <div>
              <div className="flex gap-5 font-bold leading-8">
                <div>
                  <div>Chưa duyệt</div>
                  <div className="text-xl text-purple tracking-wider">
                    {notAccepted}
                  </div>
                </div>
                <div>
                  <CircularProgressbar
                    className="w-14 h-14 font-bold"
                    value={notAccepted}
                    maxValue={loading ? 100 : totalItems}
                    text={`${loading ? 0 : (notAccepted / totalItems * 100).toFixed(1)}%`}
                    styles={{
                      path: {
                        stroke: "#30BC97",
                      },
                      text: {
                        fill: "#5B48CC",
                        fontWeight: `bold`,
                      },
                    }}
                    strokeWidth={15}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-5 font-bold leading-8">
                <div>
                  <div>Đã duyệt</div>
                  <div className="text-xl text-purple tracking-wider">
                    {accepted}
                  </div>
                </div>
                <div>
                  <CircularProgressbar
                    className="w-14 h-14 font-bold"
                    value={accepted}
                    maxValue={loading ? 100 : totalItems}
                    text={`${loading ? 0 : (accepted / totalItems * 100).toFixed(1)}%`}
                    styles={{
                      path: {
                        stroke: "#30BC97",
                      },
                      text: {
                        fill: "#5B48CC",
                        fontWeight: `bold`,
                      },
                    }}
                    strokeWidth={15}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="min-w-64">
                <SelectSimple
                  label="Kỳ lương"
                  options={cycles}
                  onChange={getCurrentCycle}
                />
              </div>
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
  );
};

export default ReportForAdmin;

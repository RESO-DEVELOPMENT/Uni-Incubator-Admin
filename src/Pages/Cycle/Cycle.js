import { MdOutlineAddCircle } from "react-icons/md";
import ButtonIcon from "../../Components/Button/ButtonIcon";
import { TopBar } from "../../Pages/Layout/TopBar";
import cycle_pic from "../../Pictures/cycle_pic.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToastError from "../../Components/Alert/ToastError";
import salaryApi from "../../API/Salary/salaryApi";
import { isEmpty } from "lodash";
import { toDate } from "../../Ultilities/Date";
import { textToColor, toVN } from "../../Ultilities/String";
import { TbReport } from "react-icons/tb";
import { BsBook } from "react-icons/bs";
import DateInput from "../../Components/Input/DateInput";
import CycleTable from "../../Components/Table/CycleTable";
import projectApi from "../../API/Project/projectApi";
import AddCycleModal from "./Components/AddCycleModal";
import DetailCycleModal from "./Components/DetailCycleModal";
import { onHubMessageReceived } from "../../Store/Middlewares/signalrConnection";
import ProceedModal from "./Components/ProceedModal";

const Cycle = () => {
  const [openModal, setOpenModal] = useState(false);

  const [cycles, setCycles] = useState([]);
  const [currentCycle, setCurrentCycle] = useState({});
  const [selectedCycle, setSelectedCycle] = useState({});

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy] = useState("dateDesc");

  const [projectCount, setProjectCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  const [modalLoading, setModalLoading] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [openProceedModal, setOpenProceedModal] = useState(false);
  const [proceed, setProceed] = useState(false);

  const [reload, setReload] = useState(false);

  let { cycleId } = useParams();

  document.title = "Kỳ lương | UniCare";

  const navigate = useNavigate();

  const getPage = (page) => {
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

  const closeDetailModal = () => {
    navigate("/cycles");
    setOpenDetailModal(false);
    setSelectedCycle({});
  };

  const getCurrentCycle = (cycle) => {
    setCurrentCycle(cycle);
  };

  const proceedPaid = () => {
    setOpenProceedModal(true);
  };

  useEffect(() => {
    onHubMessageReceived(() => {
      setProceed(false);
      setReload(!reload);
    });
  }, [reload]);

  useEffect(() => {
    const getCycleById = async () => {
      setModalLoading(true);
      setOpenDetailModal(true);
      try {
        const response = await salaryApi.getById(cycleId);
        if (response.success) {
          setSelectedCycle(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setModalLoading(false);
    };

    if (cycleId) {
      getCycleById();
    } else {
      setOpenDetailModal(false);
      setSelectedCycle({});
    }
  }, [cycleId, reload]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getCycles = async () => {
      setLoading(true);
      try {
        const response = await salaryApi.get({
          page: page,
          "page-size": pageSize,
          StartedAt: startDate.startDate,
          EndedBefore: endDate.endDate,
          OrderBy: orderBy,
        });
        if (response.success) {
          const data = response.data.message;
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setCycles(data);
          if (!isEmpty(data)) {
            setCurrentCycle(data[0]);
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getCycles();
  }, [page, pageSize, orderBy, startDate, endDate, reload]);

  useEffect(() => {
    const getProjectCount = async () => {
      try {
        const response = await projectApi.get({
          page: 1,
          "page-size": 1,
          StartAfter: currentCycle.startedAt,
          EndedBefore: currentCycle.endedAt,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setProjectCount(pagination.totalItems);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    const getReportCount = async () => {
      try {
        const response = await projectApi.getAllReports({
          page: 1,
          "page-size": 1,
          SalaryCycleId: currentCycle.salaryCycleId,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setReportCount(pagination.totalItems);
        }
      } catch (error) {
        ToastError({ text: "Không thể lấy thông tin báo cáo" });
      }
    };

    getReportCount();
    getProjectCount();
  }, [currentCycle]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="grid grid-cols-7 gap-10 mb-10">
          <div className="bg-white flex p-5 rounded-lg gap-5 h-64 col-span-5 shadow-md">
            <div className="p-5 flex justify-center items-center">
              <img src={cycle_pic} alt="cycle" />
            </div>
            <div className="font-bold w-full grid grid-rows-3">
              <div className="text-3xl self-start">Chu kì lương hiện tại</div>
              <div className="self-center grid grid-cols-4">
                <div>
                  <div className="mb-3 text-black/70">Bắt đầu:</div>
                  <div className="mb-3 text-black/70">Kết thúc:</div>
                  <div className="text-black/70">Trạng thái:</div>
                </div>
                <div className="col-span-3">
                  <div className="text-green mb-3">
                    {toDate(currentCycle.startedAt)}
                  </div>
                  <div className="text-slate-400 mb-3">
                    {toDate(currentCycle.endedAt)}
                  </div>
                  <div style={{ color: textToColor(currentCycle.status) }}>
                    {!isEmpty(currentCycle) ? toVN(currentCycle.status) : "N/A"}
                  </div>
                </div>
              </div>
              <div className="w-fit self-end">
                {!proceed && (
                  <ButtonIcon
                    text="Tạo chu kì mới"
                    icon={<MdOutlineAddCircle className="text-white text-lg" />}
                    onClick={() => setOpenModal(true)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2 p-5 bg-white shadow-md rounded-lg">
            <div className="text-2xl text-center font-bold mb-5">
              Thống kê chu kỳ
            </div>
            <div className="flex items-center gap-4 px-4 py-2 bg-purple/20 rounded-lg mb-3">
              <div className="text-3xl p-2 bg-purple text-white rounded-lg">
                <TbReport />
              </div>
              <div className="font-bold text-lg">
                <div>Báo cáo</div>
                <div className="font-normal text-sm">{reportCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 py-2 bg-green/20 rounded-lg">
              <div className="text-3xl p-2 bg-green text-white rounded-lg">
                <BsBook />
              </div>
              <div className="font-bold text-lg">
                <div>Dự án</div>
                <div className="font-normal text-sm">{projectCount}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md px-5 py-10">
          <div className="grid grid-cols-2 mb-10">
            <div>
              <div className="text-xl font-bold mb-2">
                Quản lý các chu kì lương trong hệ thống
              </div>
              <div className="text-orange-700 font-bold">
                Số kì lương: {cycles.length}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 z-50">
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
            <CycleTable
              cycles={cycles}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              isManager={true}
            />
          </div>
        </div>
      </div>
      {openModal && (
        <AddCycleModal
          closeModal={() => setOpenModal(false)}
          reload={() => setPage(-1)}
          getCurrentCycle={getCurrentCycle}
          currentCycle={currentCycle}
        />
      )}
      {openDetailModal && (
        <DetailCycleModal
          closeModal={closeDetailModal}
          cycle={selectedCycle}
          loading={modalLoading}
          proceedPaid={proceedPaid}
          startProceed={() => setProceed(true)}
          proceed={proceed}
        />
      )}
      {openProceedModal && (
        <ProceedModal closeModal={() => setOpenProceedModal(false)} />
      )}
    </div>
  );
};

export default Cycle;

import { useEffect } from "react";
import { useState } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import memberApi from "../../../API/Member/memberApi";
import SelfPayslipsTable from "../../../Components/Table/SelfPayslipsTable";
import salaryApi from "../../../API/Salary/salaryApi";
import { toDate } from "../../../Ultilities/Date";
import { isEmpty } from "lodash";
import PayslipDetail from "./PayslipDetail";
import { useParams } from "react-router-dom";

const MemberPayslips = () => {
  document.title = "Phiếu lương | UniCare";

  const [cycles, setCycles] = useState([{ label: "Tất cả", value: "" }]);
  const [payslip, setPayslip] = useState({});
  const [payslips, setPayslips] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [currentCycle, setCurrentCycles] = useState("");

  const [loading, setLoading] = useState(false);

  let { payslipId } = useParams();

  const getPage = (page) => {
    setPage(page);
  };

  const getCurrentCycle = async (option) => {
    setPage(-1);
    setCurrentCycles(option.value);
  };

  const getCurrentPaySlip = (payslip) => {
    setPayslip(payslip);
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
    const getPayslips = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getSelfPayslip({
          SalaryCycleId: currentCycle,
          page: page,
          "page-size": pageSize,
          OrderBy: "dateDesc",
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setPayslips(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getPayslips();
  }, [page, pageSize, currentCycle]);

  return (
    <div>
      {!isEmpty(payslipId) ? (
        <PayslipDetail payslip={payslip} />
      ) : (
        <SelfPayslipsTable
          payslips={payslips}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          currentPage={currentPage}
          getPage={getPage}
          loading={loading}
          getCurrentCycle={getCurrentCycle}
          cycles={cycles}
          getCurrentPaySlip={getCurrentPaySlip}
        />
      )}
    </div>
  );
};

export default MemberPayslips;

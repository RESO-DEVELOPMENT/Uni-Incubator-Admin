import { useEffect } from "react";
import { useState } from "react";
import ToastError from "../../../Components/Alert/ToastError";
import projectApi from "../../../API/Project/projectApi";
import DateInput from "../../../Components/Input/DateInput";
import { GiTwoCoins } from "react-icons/gi";
import { find } from "lodash";
import ProjectTransactionsTable from "../../../Components/Table/ProjectTransactionsTable";

const ProjectTransactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [projectWallets, setProjectWallets] = useState([]);

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const getProjectWallet = async () => {
      try {
        const response = await projectApi.getProjectWallet(props.projectId);
        if (response.success) {
          setProjectWallets(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getProjectWallet();
  }, [props.projectId]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getTransactions = async () => {
      setLoading(true);
      try {
        const response = await projectApi.getProjectTransaction(
          props.projectId,
          {
            page: page,
            "page-size": pageSize,
            FromDate: startDate.startDate,
            ToDate: endDate.endDate,
            OrderBy: "createdAtDesc",
          }
        );
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setTransactions(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getTransactions();
  }, [page, pageSize, props.projectId, startDate, endDate]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div>
          <div className="font-bold text-xl mb-5">Biến động point</div>
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
            <div></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div className=" border border-slate-400 p-5 text-xl font-bold rounded-lg h-fit">
            <div className="mb-3">Ví dự án</div>
            <div className="flex items-center gap-2 text-yellow-500">
              <div className="tracking-wider">
                {find(projectWallets, { walletTag: "main" })
                  ? find(projectWallets, {
                      walletTag: "main",
                    }).amount.toLocaleString()
                  : 0}
              </div>
              <div>
                <GiTwoCoins />
              </div>
            </div>
          </div>
          <div className=" border border-slate-400 p-5 text-xl font-bold rounded-lg h-fit">
            <div className="mb-3">Ví tài trợ</div>
            <div className="flex items-center gap-2 text-yellow-500">
              <div className="tracking-wider">
                {find(projectWallets, { walletTag: "bonus" })
                  ? find(projectWallets, {
                      walletTag: "bonus",
                    }).amount.toLocaleString()
                  : 0}
              </div>
              <div>
                <GiTwoCoins />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ProjectTransactionsTable
          transactions={transactions}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          currentPage={currentPage}
          getPage={getPage}
        />
      </div>
    </div>
  );
};

export default ProjectTransactions;

import { useState } from "react";
import { TopBar } from "../Layout/TopBar";
import { GiTwoCoins } from "react-icons/gi";
import { filter, isEmpty } from "lodash";
import { useEffect } from "react";
import memberApi from "../../API/Member/memberApi";
import ToastError from "../../Components/Alert/ToastError";
import DateInput from "../../Components/Input/DateInput";
import ProjectTransactionsTable from "../../Components/Table/ProjectTransactionsTable";

const Wallet = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

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
    const getSelfWallet = async () => {
      try {
        const response = await memberApi.getSelfWallet();
        if (response.success) {
          setWallets(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getSelfWallet();
  }, []);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getTransactions = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getSelfTransaction({
          page: page,
          "page-size": pageSize,
          FromDate: startDate.startDate,
          ToDate: endDate.endDate,
          OrderBy: "createdAtDesc",
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalItems(pagination.totalItems);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setTransactions(filter(response.data.message, { token: "point" }));
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getTransactions();
  }, [page, pageSize, startDate, endDate]);

  return (
    <div>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="bg-white rounded-lg p-5 shadow-md">
          <div className="mb-10">
            <div className="text-xl font-bold mb-1">Lịch sử point của tôi</div>
            <div className="font-bold text-orange-600">
              Số lượng giao dịch: {totalItems}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5 mb-10">
            <div className="font-bold col-span-2">
              <div>Point hiện có</div>
              <div className="flex text-yellow-500 items-center gap-2 text-xl">
                <div className="tracking-wider">
                  {!isEmpty(wallets) ? wallets.totalPoint.toLocaleString() : 0}
                </div>
                <div>
                  <GiTwoCoins />
                </div>
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-5">
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
      </div>
    </div>
  );
};

export default Wallet;

import { useState } from "react";
import { TopBar } from "../Layout/TopBar";
import { useEffect } from "react";
import salaryApi from "../../API/Salary/salaryApi";
import { toDate } from "../../Ultilities/Date";
import ToastError from "../../Components/Alert/ToastError";
import payslipApi from "../../API/Payslip/payslipApi";
import { CircularProgressbar } from "react-circular-progressbar";
import { GiTwoCoins } from "react-icons/gi";
import PayslipTable from "../../Components/Table/PayslipTable";
import SelectSimple from "../../Components/Select/SelectSimple";
import walletApi from "../../API/Wallet/walletApi";
import { find, isEmpty } from "lodash";
import { useSelector } from "react-redux";

const Payslip = () => {
  const currentMember = useSelector((state) => state.auth.member);
  const [cycles, setCycles] = useState([{ label: "Tất cả", value: "" }]);
  const [statistic, setStatistic] = useState({
    payslipsCount: 0,
    totalP1: 0,
    totalP2: 0,
    totalP3: 0,
    totalXP: 0,
    totalBonus: 0,
  });
  const [totalPayslip, setTotalPayslip] = useState(0);
  const [payslips, setPayslips] = useState([]);
  const [wallets, setWallets] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [currentCycle, setCurrentCycles] = useState("");

  const [loading, setLoading] = useState(false);

  const getCurrentCycle = async (option) => {
    setPage(-1);
    setCurrentCycles(option.value);
  };

  const getPage = (page) => {
    setCurrentPage(page);
    setPage(page);
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
    const getWallets = async () => {
      try {
        const response = await walletApi.getSystemWallet();
        if (response.success) {
          setWallets(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getWallets();
    getAllCycles();
  }, []);

  useEffect(() => {
    const getStatistic = async () => {
      try {
        const response = await payslipApi.getStatistic({
          SalaryCycleId: currentCycle,
        });
        if (response.success) {
          setStatistic(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    getStatistic();
  }, [currentCycle]);

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getPayslips = async () => {
      setLoading(true);
      try {
        const response = await payslipApi.get({
          SalaryCycleId: currentCycle,
          page: page,
          "page-size": pageSize,
          OrderBy: "dateDesc",
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPayslip(pagination.totalItems);
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
    <>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="flex justify-between gap-5 mb-10">
          <div className="grow bg-white rounded-lg shadow-md py-5">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex justify-center items-center gap-5 font-bold leading-8">
                <div>
                  <div>Tổng P1</div>
                  <div className="text-xl text-purple tracking-wider">
                    {statistic.totalP1.toLocaleString()}
                  </div>
                  <div className="text-black/50 text-sm">
                    Lương theo vị trí
                  </div>
                </div>
                <div>
                  <CircularProgressbar
                    className="w-14 h-14 font-bold"
                    value={
                      statistic.totalP1 > 0 ? statistic.totalP1.toFixed(1) : 0
                    }
                    maxValue={
                      statistic.totalP1 +
                        statistic.totalP2 +
                        statistic.totalP3 +
                        statistic.totalBonus >
                      0
                        ? statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus
                        : 100
                    }
                    text={`${
                      statistic.totalP1 > 0
                        ? (
                            (statistic.totalP1 /
                              (statistic.totalP1 +
                                statistic.totalP2 +
                                statistic.totalP3 +
                                statistic.totalBonus)) *
                            100
                          ).toFixed(1)
                        : 0
                    }%`}
                    styles={{
                      path: {
                        stroke: "#30BC97",
                      },
                      text: {
                        fill: "#30BC97",
                        fontWeight: `bold`,
                      },
                    }}
                    strokeWidth={15}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 font-bold leading-8">
                <div>
                  <div>Tổng P2</div>
                  <div className="text-xl text-purple tracking-wider">
                    {statistic.totalP2.toLocaleString()}
                  </div>
                  <div className="text-black/50 text-sm">
                    Lương theo năng lực
                  </div>
                </div>
                <div>
                  <CircularProgressbar
                    className="w-14 h-14 font-bold"
                    value={
                      statistic.totalP2 > 0 ? statistic.totalP2.toFixed(1) : 0
                    }
                    maxValue={
                      statistic.totalP1 +
                        statistic.totalP2 +
                        statistic.totalP3 +
                        statistic.totalBonus >
                      0
                        ? statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus
                        : 100
                    }
                    text={`${
                      statistic.totalP2 > 0
                        ? (
                            (statistic.totalP2 /
                              (statistic.totalP1 +
                                statistic.totalP2 +
                                statistic.totalP3 +
                                statistic.totalBonus)) *
                            100
                          ).toFixed(1)
                        : 0
                    }%`}
                    styles={{
                      path: {
                        stroke: "#30BC97",
                      },
                      text: {
                        fill: "#30BC97",
                        fontWeight: `bold`,
                      },
                    }}
                    strokeWidth={15}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 font-bold leading-8">
                <div>
                  <div>Tổng P3</div>
                  <div className="text-xl text-purple tracking-wider">
                    {statistic.totalP3.toLocaleString()}
                  </div>
                  <div className="text-black/50 text-sm">
                    Lương theo hiệu suất
                  </div>
                </div>
                <div>
                  <CircularProgressbar
                    className="w-14 h-14 font-bold"
                    value={
                      statistic.totalP3 > 0 ? statistic.totalP3.toFixed(1) : 0
                    }
                    maxValue={
                      statistic.totalP1 +
                        statistic.totalP2 +
                        statistic.totalP3 +
                        statistic.totalBonus >
                      0
                        ? statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus
                        : 100
                    }
                    text={`${
                      statistic.totalP3 > 0
                        ? (
                            (statistic.totalP3 /
                              (statistic.totalP1 +
                                statistic.totalP2 +
                                statistic.totalP3 +
                                statistic.totalBonus)) *
                            100
                          ).toFixed(1)
                        : 0
                    }%`}
                    styles={{
                      path: {
                        stroke: "#30BC97",
                      },
                      text: {
                        fill: "#30BC97",
                        fontWeight: `bold`,
                      },
                    }}
                    strokeWidth={15}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 font-bold leading-8">
                <div>
                  <div>Tổng thưởng</div>
                  <div className="text-xl text-purple tracking-wider">
                    {statistic.totalBonus.toLocaleString()}
                  </div>
                  <div className="text-black/50 text-sm">
                    Lương thưởng
                  </div>
                </div>
                <div>
                  <CircularProgressbar
                    className="w-14 h-14 font-bold"
                    value={
                      statistic.totalBonus > 0
                        ? statistic.totalBonus.toFixed(1)
                        : 0
                    }
                    maxValue={
                      statistic.totalP1 +
                        statistic.totalP2 +
                        statistic.totalP3 +
                        statistic.totalBonus >
                      0
                        ? statistic.totalP1 +
                          statistic.totalP2 +
                          statistic.totalP3 +
                          statistic.totalBonus
                        : 100
                    }
                    text={`${
                      statistic.totalBonus > 0
                        ? (
                            (statistic.totalBonus /
                              (statistic.totalP1 +
                                statistic.totalP2 +
                                statistic.totalP3 +
                                statistic.totalBonus)) *
                            100
                          ).toFixed(1)
                        : 0
                    }%`}
                    styles={{
                      path: {
                        stroke: "#30BC97",
                      },
                      text: {
                        fill: "#30BC97",
                        fontWeight: `bold`,
                      },
                    }}
                    strokeWidth={15}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-64">
            <div className="p-5 bg-white rounded-lg shadow-md font-bold h-full">
              <div className="mb-5">Tổng point hệ thống</div>
              <div className="flex items-center gap-2 text-yellow-500 text-2xl">
                <div>
                  {!isEmpty(wallets)
                    ? find(wallets.wallets, {
                        walletToken: "point",
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
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="text-xl font-bold mb-2">
                Phiếu lương của nhân viên
              </div>
              <div className="text-orange-600 font-bold">
                Số phiếu lương: {totalPayslip}
              </div>
            </div>
            <div className="min-w-64">
              <SelectSimple
                label="Kỳ lương"
                options={cycles}
                onChange={getCurrentCycle}
              />
            </div>
          </div>
          <div>
            <PayslipTable
              p1={true}
              payslips={payslips}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              loading={loading}
              currentMember={currentMember}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payslip;

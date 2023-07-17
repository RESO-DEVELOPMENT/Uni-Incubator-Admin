import { useState } from "react";
import { TopBar } from "../Layout/TopBar";
import { TbReport } from "react-icons/tb";
import { useEffect } from "react";
import ToastError from "../../Components/Alert/ToastError";
import walletApi from "../../API/Wallet/walletApi";
import payslipApi from "../../API/Payslip/payslipApi";
import { find, isEmpty } from "lodash";
import systemApi from "../../API/Statistic/systemApi";
import { FiUsers } from "react-icons/fi";
import funds_pic from "../../Pictures/funds_pic.png";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import { BsArrowRight, BsCalculator } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import projectApi from "../../API/Project/projectApi";
import RecentSponsorTable from "../../Components/Table/RecentSponsorTable";
import Loading from "../../Components/Loading/Loading";
import salaryApi from "../../API/Salary/salaryApi";
import { textToColor, toVN } from "../../Ultilities/String";
import voucherApi from "../../API/Voucher/voucherApi";
import { toDate } from "../../Ultilities/Date";

const Funds = () => {
  const [wallets, setWallets] = useState([]);
  const [statistic, setStatistic] = useState({});
  const [paySlipCount, setPaySlipCount] = useState({});
  const [currentCycle, setCurrentCycle] = useState(false);
  const [recentSponsors, setRecentSponsors] = useState([]);
  const [sponsoredProjects, setSponsoredProjects] = useState([]);
  const [reportCount, setReportCount] = useState(0);

  const [tableLoading, setTableLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cycleLoading, setCycleLoading] = useState(false);

  const [vouchers, setVouchers] = useState(0);

  const navigate = useNavigate();

  document.title = "Quỹ | UniCare";

  useEffect(() => {
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

    const getStatistic = async () => {
      try {
        const response = await systemApi.get();
        if (response.success) {
          setStatistic(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    const getPaySlipCount = async () => {
      try {
        const response = await payslipApi.getStatistic();
        if (response.success) {
          setPaySlipCount(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    const getRecentSponsor = async () => {
      setTableLoading(true);
      try {
        const response = await projectApi.getSponsorTransaction({
          page: 1,
          "page-size": 5,
          OrderBy: "dateDesc",
        });
        if (response.success) {
          setRecentSponsors(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setTableLoading(false);
    };

    const getSponsoredProjects = async () => {
      setCardLoading(true);
      try {
        const resposne = await projectApi.getSponsoredProject({
          page: 1,
          "page-szie": 5,
        });
        if (resposne.success) {
          setSponsoredProjects(resposne.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setCardLoading(false);
    };

    const getReportCount = async () => {
      try {
        const response = await projectApi.getProjectReportCount();
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setReportCount(pagination.totalItems);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    const getVoucher = async () => {
      try {
        const response = await voucherApi.get({
          OrderBy: "createdAtDesc",
          page: 1,
          "page-size": 1,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setVouchers(pagination.totalItems);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };
    const getCycles = async () => {
      setCycleLoading(true);
      try {
        const response = await salaryApi.get({
          page: 1,
          "page-size": 1,
          OrderBy: "dateDesc",
        });
        if (response.success) {
          const data = response.data.message;
          if (!isEmpty(data)) {
            setCurrentCycle(data[0]);
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setCycleLoading(false);
    };

    getCycles();
    getVoucher();
    getWallets();
    getStatistic();
    getPaySlipCount();
    getRecentSponsor();
    getSponsoredProjects();
    getReportCount();
  }, []);

  return (
    <>
      <TopBar />
      <div className="pl-10 pr-5 mb-10">
        <div className="grid grid-cols-6 gap-10 mb-10">
          <div className="col-span-4 grid grid-cols-2 gap-10">
            <div className="p-5 font-bold bg-white rounded-lg shadow-md">
              <div className="flex items-start justify-between">
                <div className="text-xl mb-3">Báo cáo lương</div>
                <div
                  className="flex items-center gap-2 text-sm text-green cursor-pointer"
                  onClick={() => navigate("/reports")}
                >
                  <div>Chi tiết</div>
                  <div>
                    <BsArrowRight />
                  </div>
                </div>
              </div>
              <div className="text-xl text-green tracking-widest mb-3">
                {reportCount}
              </div>
              <div className="text-sm flex items-center gap-2 text-black/60 font-normal">
                <div>
                  <TbReport />
                </div>
                <div>Thống kê theo từng dự án trong các chu kỳ</div>
              </div>
            </div>
            <div className="p-5 font-bold bg-white rounded-lg shadow-md">
              <div className="text-xl mb-3">Phần thưởng quy đổi</div>
              <div className="text-xl text-green tracking-widest mb-3">
                {vouchers}
              </div>
              <div className="text-sm flex items-center gap-2 text-black/60 font-normal">
                <div>
                  <TbReport />
                </div>
                <div>Voucher của các đơn vị trong Uni Incubator</div>
              </div>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-10">
            <div className="bg-white shadow-md rounded-lg font-bold text-yellow-500 text-xl p-2">
              <div className="border-4 border-yellow-500 rounded-lg p-3">
                <div className="mb-3">
                  <GiTwoCoins />
                </div>
                <div className="mb-3">
                  {!isEmpty(wallets)
                    ? find(wallets.wallets, {
                        walletToken: "point",
                      }).amount.toLocaleString()
                    : 0}
                </div>
                <div className="text-sm text-black/60 font-normal">
                  <div>Tổng point</div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg font-bold text-green text-xl p-2">
              <div className="border-4 border-green rounded-lg p-3">
                <div className="mb-3">
                  <FiUsers />
                </div>
                <div className="mb-3">
                  {!isEmpty(statistic) ? statistic.sponsors.total : 0}
                </div>
                <div className="text-sm text-black/60 font-normal">
                  <div>Nhà tài trợ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-10 mb-10">
          <div className="bg-white shadow-md flex py-2 pl-16 rounded-lg gap-5 h-64 col-span-4">
            <img className="w-60 h-60" src={funds_pic} alt="project_pic" />
            <div className="font-bold w-full">
              <div className="mt-5 mb-3">Thống kê</div>
              <div className="text-2xl mb-3">
                Tổng số phiếu lương đã trả kỳ vừa qua
              </div>
              <div className="flex items-center gap-1 text-purple text-2xl mb-10 tracking-widest">
                <div>
                  {!isEmpty(paySlipCount) ? paySlipCount.payslipsCount : 0}
                </div>
                <div>
                  <BsCalculator />
                </div>
              </div>
              <div className="w-fit">
                <Button
                  text="Xem tất cả"
                  onClick={() => navigate("/funds/payslips")}
                />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-5 col-span-2">
            <div className="grid grid-row-3 h-full">
              <div className="font-bold text-xl">Chu kỳ lương hiện tại</div>
              {cycleLoading ? (
                <Loading />
              ) : (
                <>
                  {!isEmpty(currentCycle) ? (
                    <>
                      <div className="font-bold">
                        <div className="text-green text-xl mb-3">
                          {toDate(currentCycle.createdAt)}
                        </div>
                        <div className="text-primary mb-3">
                          Bắt đầu từ: {toDate(currentCycle.startedAt)}
                        </div>
                        <div className="text-primary">
                          Trạng thái:{" "}
                          <span
                            style={{ color: textToColor(currentCycle.status) }}
                          >
                            {toVN(currentCycle.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="trans"
                          text="Xem tất cả chu kỳ lương"
                          onClick={() => navigate("/cycles")}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center font-bold">
                        Không có chu kỳ lương hiện tại
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="trans"
                          text="Tạo chu kỳ lương mới"
                          onClick={() => navigate("/cycles")}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-10 mb-10">
          <div className="col-span-4">
            <RecentSponsorTable
              sponsors={recentSponsors}
              loading={tableLoading}
            />
          </div>
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="font-bold mb-5">
                <div>
                  <div className="text-xl">Dự án được tài trợ</div>
                  <div className="text-sm text-orange-600">
                    Tổng số: {sponsoredProjects.length}
                  </div>
                </div>
              </div>
              <div>
                {cardLoading ? (
                  <Loading />
                ) : (
                  <>
                    {!isEmpty(sponsoredProjects) &&
                      sponsoredProjects.map((project) => {
                        return (
                          <div className="rounded-md border border-slate-200 border-l-4 border-l-green font-bold p-3 mb-5">
                            <div
                              className="mb-3 hover:underline cursor-pointer"
                              onClick={() =>
                                navigate(`/projects/${project.projectId}`)
                              }
                            >
                              {project.projectName}
                            </div>
                            <div className="flex items-center text-yellow-500 tracking-wider gap-2">
                              <div>
                                <GiTwoCoins />
                              </div>
                              <div>
                                {project.totalSponsorsed.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;

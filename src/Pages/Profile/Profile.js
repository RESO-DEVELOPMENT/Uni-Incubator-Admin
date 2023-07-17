import { find, findIndex, isEmpty, isNil, size } from "lodash";
import { useEffect, useState } from "react";
import memberApi from "../../API/Member/memberApi";
import Loading from "../../Components/Loading/Loading";
import ToastError from "./../../Components/Alert/ToastError";
import { HiBadgeCheck } from "react-icons/hi";
import { FaPaperPlane, FaStopwatch } from "react-icons/fa";
import { BsArrowBarRight, BsFillCalendarWeekFill } from "react-icons/bs";
import { TbCertificate } from "react-icons/tb";
import { toDate } from "../../Ultilities/Date";
import tree from "../../Pictures/tree.png";
import { addMonths, format } from "date-fns";

import { GiTwoCoins } from "react-icons/gi";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import { AiFillCalendar, AiFillPhone } from "react-icons/ai";
import Button from "../../Components/Button/Button";
import JoinedProjectTable from "../../Components/Table/JoinedProjectTable";
import { useNavigate } from "react-router-dom";
import certificateApi from "../../API/Certificate/certificateApi";
import levelApi from "../../API/Level/levelApi";

const Profile = () => {
  const currentMember = useSelector((state) => state.auth.member);

  document.title = "Hồ sơ | UniCare";

  const member = useSelector((state) => state.auth.member);

  const navigate = useNavigate();

  const [achievement, setAchievement] = useState({
    totalWorkHours: 0,
    totalTaskDone: 0,
  });
  const [payslip, setPayslip] = useState([]);
  const [prevCycle, setPrevCycle] = useState({});
  const [projects, setProjects] = useState([]);
  const [totalPoint, setTotalPoint] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [payslipLoading, setPayslipLoading] = useState(false);

  const [currentXp, setCurrenXp] = useState(0);
  const [nextlevel, setNextlevel] = useState({});

  const getPage = (page) => {
    setPage(page);
  };

  const exportFile = async () => {
    try {
      const response = await certificateApi.getSelfCertificate();
      if (response.success) {
        window.open(response.data.message.url, "_blank");
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  useEffect(() => {
    const getNextLevel = async () => {
      try {
        const response = await memberApi.getSelfWallet();
        if (response.success) {
          setCurrenXp(response.data.message.totalXP);
          const leRes = await levelApi.get({
            OrderBy: "requiredXPAsc",
          });
          if (leRes.success) {
            const data = leRes.data.message;
            if (!isNil(currentMember.memberLevels)) {
              const currentXp = response.data.message.totalXP;
              setTotalPoint(response.data.message.totalPoint);
              const currentLevel = currentMember.memberLevels.level.levelName;

              const currentLevelIndex = findIndex(data, {
                levelName: currentLevel,
              });

              const nextLevel = find(
                data.slice(currentLevelIndex + 1),
                (level) => level.xpNeeded > currentXp
              );
              setNextlevel(nextLevel);
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
    };

    getNextLevel();
  }, [currentMember]);

  useEffect(() => {
    const getAchievement = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getSelfAchievement();
        if (response.success) {
          setAchievement(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    const getPayslip = async () => {
      setPayslipLoading(true);
      try {
        const cycleRes = await memberApi.getSelfCycle({
          page: 1,
          "page-size": 1,
          OrderBy: "dateDesc",
        });
        if (cycleRes.success) {
          if (!isEmpty(cycleRes.data.message)) {
            setPrevCycle(cycleRes.data.message[0]);
            const cycleId = cycleRes.data.message[0].salaryCycleId;
            const payRes = await memberApi.getSelfPayslip({
              SalaryCycleId: cycleId,
              OrderBy: "dateDesc",
              page: 1,
              "page-size": 1,
            });
            if (payRes.success) {
              if (!isEmpty(payRes.data.message)) {
                const data = payRes.data.message[0];
                setPayslip(data);
              }
            }
          }
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setPayslipLoading(false);
    };

    getAchievement();
    getPayslip();
  }, []);

  useEffect(() => {
    const getUserProjects = async () => {
      setProjectLoading(true);
      try {
        const response = await memberApi.getSelfProjects({
          page: page,
          "page-size": pageSize,
          OrderBy: "dateDesc",
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          setProjects(response.data.message);
          setTotalItems(pagination.totalItems);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setProjectLoading(false);
    };

    getUserProjects();
  }, [page, pageSize]);

  return (
    <div className="pl-10 pr-5 my-10">
      <div className="bg-white rounded-md grid grid-cols-4 shadow-md">
        <div className="col-span-3 p-5">
          <h1 className="text-3xl font-bold mb-5">Thông tin cá nhân</h1>
          <div className="flex gap-5 mb-5">
            <div className="w-1/3 rounded-lg bg-yellow-50 border border-slate-300 pt-5 px-2 relative">
              <div className="font-bold text-center mb-5">
                Thống kê đóng góp
              </div>
              {loading ? (
                <div className="mb-5">
                  <Loading />
                </div>
              ) : (
                <>
                  <div className="flex mb-5">
                    <div className="flex flex-col items-center font-bold w-1/2 text-sm">
                      <HiBadgeCheck className="w-10 h-10 text-yellow-500" />
                      <div>Giờ làm</div>
                      <div className="text-green">
                        {achievement.totalWorkHours}
                      </div>
                    </div>
                    <div className="flex flex-col items-center font-bold w-1/2 text-sm">
                      <HiBadgeCheck className="w-10 h-10 text-yellow-500" />
                      <div>Công việc</div>
                      <div className="text-green">
                        {achievement.totalTaskDone}
                      </div>
                    </div>
                  </div>
                  <div className="text-center mb-5">
                    <div>Số dự án tham gia</div>
                    <div className="font-bold text-orange-700">
                      {size(projects)}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-green text-sm cursor-pointer flex items-center justify-end gap-2 h-fit hover:underline absolute bottom-0 right-1"
                      onClick={exportFile}
                    >
                      <div>Xuất file</div>
                      <div>
                        <BsArrowBarRight />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="w-2/3 border border-slate-300 rounded-lg p-5 h-fit">
              <div className="flex items-center justify-between font-bold mb-5">
                <div>PHIẾU LƯƠNG GẦN NHẤT</div>
                {!payslipLoading && payslip && (
                  <div
                    className="text-sm text-green cursor-pointer"
                    onClick={() => navigate(`/profile/payslips`)}
                  >
                    Xem chi tiết
                  </div>
                )}
              </div>
              {payslipLoading ? (
                <div className="mb-5">
                  <Loading />
                </div>
              ) : (
                <>
                  {!isEmpty(payslip) ? (
                    <div>
                      <div className="flex justify-between mb-5 text-sm">
                        <div className="flex gap-4 items-center">
                          <div className="text-3xl text-primary">
                            <BsFillCalendarWeekFill />
                          </div>
                          <div>
                            <div className="font-bold text-black/70">
                              Từ ngày
                            </div>
                            <div className="text-primary/70">
                              {!isNil(prevCycle.createdAt)
                                ? toDate(prevCycle.createdAt)
                                : "..."}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-black/70 text-right">
                            Đến ngày
                          </div>
                          <div className="text-primary/70 text-right">
                            {!isNil(prevCycle.endedAt)
                              ? toDate(prevCycle.endedAt)
                              : "..."}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-5">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl text-yellow-500">
                            <GiTwoCoins />
                          </div>
                          <div>
                            <div className="font-bold text-black/70">
                              Số point nhận được
                            </div>
                            <div className="text-primary/70">Hết hạn vào</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-yellow-500 text-right font-bold">
                            {(
                              payslip.totalP1 +
                              payslip.totalP2 +
                              payslip.totalP3 +
                              payslip.totalBonus
                            ).toLocaleString()}
                          </div>
                          <div className="text-primary/70 text-right">
                            {!isNil(prevCycle.endedAt)
                              ? format(
                                  addMonths(new Date(prevCycle.endedAt), 2),
                                  "dd/MM/yyyy"
                                )
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl text-per-75">
                            <FaPaperPlane />
                          </div>
                          <div>
                            <div className="font-bold text-black/70">
                              Số xp nhận được
                            </div>
                            <div className="text-primary/70">
                              Để lên hạn kế tiếp, XP cần có
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-per-75 text-right font-bold">
                            {payslip.totalXP}
                          </div>
                          <div className="text-primary/70 text-right">
                            {nextlevel?.xpNeeded - currentXp}xp
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="font-bold text-sm text-center">
                      Không có phiếu lương gần đây
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <JoinedProjectTable
              title="Dự án tham gia"
              projects={projects}
              loading={projectLoading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              totalItems={totalItems}
            />
          </div>
        </div>
        <div className="bg-yellow-50 border-l border-slate-100 p-5">
          <div className="flex justify-center">
            <img
              className="w-32 h-32 rounded-full"
              src={
                member.imageUrl
                  ? member.imageUrl
                  : `https://ui-avatars.com/api/?name=${member.fullName}&length=1&background=30BC97&color=FFFFFF`
              }
              alt="avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center font-bold text-xl">{member.fullName}</div>
          <hr className=" my-5 border-none bg-slate-200 h-px" />
          <div className="mb-10">
            <div className="font-bold mb-3">Thông tin</div>
            <div className="flex items-center gap-2 mb-3">
              <div>
                <MdEmail className="text-green" />
              </div>
              <div className="text-sm text-black/70">{member.emailAddress}</div>
            </div>
            <hr className="border-none h-px bg-slate-100 my-1" />
            <div className="flex items-center gap-2 mb-3">
              <div>
                <AiFillPhone className="text-green" />
              </div>
              <div className="text-sm text-black/70">
                {member.phoneNumber ? member.phoneNumber : "N/A"}
              </div>
            </div>
            <hr className="border-none h-px bg-slate-100 my-1" />
            <div className="flex items-center gap-2 mb-3">
              <div>
                <AiFillCalendar className="text-green" />
              </div>
              <div className="text-sm text-black/70">
                Ngày tham gia:{" "}
                <span className="text-green">
                  {toDate(member.createdAt)}
                </span>
              </div>
            </div>
            <hr className="border-none h-px bg-slate-100 my-1" />
            <div className="flex items-center gap-2 mb-3">
              <div>
                <FaStopwatch className="text-green" />
              </div>
              <div className="text-sm text-black/70">
                Số giờ làm:{" "}
                <span className="text-green">{achievement.totalWorkHours}</span>
              </div>
            </div>
            <hr className="border-none h-px bg-slate-100 my-1" />
            <div className="flex items-center gap-2 mb-3">
              <div>
                <TbCertificate className="text-green" />
              </div>
              <div className="text-sm text-black/70">
                Số công việc:{" "}
                <span className="text-green">{achievement.totalTaskDone}</span>
              </div>
            </div>
            <hr className="border-none h-px bg-slate-100 my-1" />
            <div className="flex items-center gap-2 mb-3">
              <div>
                <GiTwoCoins className="text-green" />
              </div>
              <div className="text-sm text-black/70">
                Tổng point:{" "}
                <span className="text-green">
                  {totalPoint.toLocaleString()}
                </span>
              </div>
            </div>
            <hr className="border-none h-px bg-slate-100 my-1" />
          </div>
          <div className="mb-10">
            <div className="p-3 flex items-center justify-between bg-gradient-to-bl from-green/50 to-green text-white rounded-lg mb-5">
              <div className="w-1/2">
                <div className="font-bold mb-3">Cấp hiện tại</div>
                <div className="font-bold mb-3">
                  {member.memberLevels.level.levelName}
                </div>
                <div className="mb-3">
                  Số XP hiện có:{" "}
                  <div className="font-bold">
                    {currentXp.toLocaleString()} XP
                  </div>
                </div>
                <div className="text-xs">
                  Còn{" "}
                  <span className="font-bold">
                    {(nextlevel?.xpNeeded - currentXp).toLocaleString()}
                  </span>{" "}
                  XP để lên hạng kế tiếp
                </div>
              </div>
              <div>
                <img src={tree} alt="tree" />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <Button
              type="trans"
              text="Chỉnh sửa thông tin"
              onClick={() => navigate("/profile/information")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

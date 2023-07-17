import SearchInput from "./../../Components/Input/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { BiLogOutCircle, BiUser } from "react-icons/bi";
import { authAction } from "../../Store/Slice/userSlice";
import { useNavigate } from "react-router-dom";
import { BsBook, BsFillBriefcaseFill } from "react-icons/bs";
import { TbReport } from "react-icons/tb";
import { AiOutlineBarChart, AiOutlineBell } from "react-icons/ai";
import { find, isEmpty, isNil, map, remove, size, sum } from "lodash";
import memberApi from "../../API/Member/memberApi";
import ToastError from "../../Components/Alert/ToastError";
import { toDate, toDateWithTime } from "../../Ultilities/Date";
import { filter } from "lodash";
import notiApi from "../../API/Notification/notiApi";
import { IoIosReturnLeft } from "react-icons/io";
import projectApi from "../../API/Project/projectApi";
import sponsorApi from "../../API/Sponsor/sponsorApi";
import { FaUserAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { textToColor, toVN } from "../../Ultilities/String";
import Loading from "../../Components/Loading/Loading";
import { CircularProgressbar } from "react-circular-progressbar";
import { differenceInDays } from "date-fns";
import { GiTwoCoins } from "react-icons/gi";
import { onHubMessageReceived } from "../../Store/Middlewares/signalrConnection";

const TopBar = () => {
  const member = useSelector((state) => state.auth.member);

  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] = useState(false);
  const ref = useRef();

  const [openNoti, setOpenNoti] = useState(false);
  const refNoti = useRef();

  const [notiFilter, setNotiFilter] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [openSearch, setOpenSearch] = useState(false);
  const refSearch = useRef();

  const [reload, setReload] = useState(false);

  const [totalSearch, setTotalSearch] = useState({
    projects: 0,
    users: 0,
    sponsors: 0,
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  const [userLoading, setUserLoading] = useState(false);
  const [sponsorLoading, setSponsorLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getNotiFilter = (value) => {
    setNotiFilter(value);
  };

  const getSearchData = (e) => {
    setSearch(e.target.value);
  };

  const goToPage = (url) => {
    setOpenSearch(false);
    navigate(url);
  };

  const clickNoti = async (noti) => {
    setOpenNoti(false);
    const data = JSON.parse(noti.target);
    const key = Object.keys(data)[0].toLowerCase();
    const value = Object.values(data)[0].toLowerCase();
    if (key.includes("project")) {
      navigate(`/projects/${value}`);
    }
    if (member.role === "ADMIN") {
      if (key.includes("salary")) {
        navigate(`/cycles/${value}`);
      } else if (key.includes("voucher")) {
        navigate(`/vouchers`);
      }
    } else {
      if (key.includes("voucher")) {
        navigate(`/vouchers`);
      }
    }
    try {
      await notiApi.setToRead(noti.notificationId);
      setReload(!reload);
    } catch (error) {
      ToastError({ text: "Lỗi cập nhật thông báo" });
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      setUserLoading(true);
      try {
        const response = await memberApi.get({
          page: 1,
          "page-size": 5,
          OrderBy: "dateDesc",
          FullName: search,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalSearch((prev) => {
            return {
              ...prev,
              users: pagination.totalItems,
            };
          });
          const membersList = remove(
            response.data.message,
            (item) => item.memberId !== member.memberId
          );
          setUsers(membersList);
        }
      } catch (error) {
        ToastError({ text: "Lỗi khi lấy danh sách thành viên" });
      }
      setUserLoading(false);
    };

    const getProjects = async () => {
      setProjectLoading(true);
      try {
        const response = await projectApi.get({
          page: 1,
          "page-size": 5,
          OrderBy: "dateDesc",
          ProjectName: search,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalSearch((prev) => {
            return {
              ...prev,
              projects: pagination.totalItems,
            };
          });
          setProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: "Lỗi khi lấy thông tin dự án" });
      }
      setProjectLoading(false);
    };

    const getSponsors = async () => {
      setSponsorLoading(true);
      try {
        const response = await sponsorApi.get({
          page: 1,
          "page-size": 5,
          SponsorName: search,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          setTotalSearch((prev) => {
            return {
              ...prev,
              sponsors: pagination.totalItems,
            };
          });
          setSponsors(response.data.message);
        }
      } catch (error) {
        ToastError({ text: "Không thể lấy thông tin nhà tài trợ" });
      }
      setSponsorLoading(false);
    };

    if (!isEmpty(search)) {
      const timer = setTimeout(() => {
        getProjects();
        if (member.role === "ADMIN") {
          getUsers();
          getSponsors();
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setProjects([]);
      setUsers([]);
      setSponsors([]);
      setTotalSearch({
        projects: 0,
        users: 0,
        sponsors: 0,
      });
    }
  }, [member.role, member.memberId, search]);

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setOpenMenu(false);
    };

    document.body.addEventListener("click", onBodyClick);

    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, []);

  useEffect(() => {
    const onBodyClickNoti = (event) => {
      if (refNoti.current && refNoti.current.contains(event.target)) {
        return;
      }
      setOpenNoti(false);
    };

    document.body.addEventListener("click", onBodyClickNoti);

    return () => {
      document.body.removeEventListener("click", onBodyClickNoti);
    };
  }, []);

  useEffect(() => {
    const onBodyClickSearch = (event) => {
      if (refSearch.current && refSearch.current.contains(event.target)) {
        return;
      }
      setOpenSearch(false);
    };

    document.body.addEventListener("click", onBodyClickSearch);

    return () => {
      document.body.removeEventListener("click", onBodyClickSearch);
    };
  }, []);

  useEffect(() => {
    onHubMessageReceived(() => {
      setReload(!reload);
    });
  }, [reload]);

  useEffect(() => {
    const getSelfNoti = async () => {
      try {
        const response = await memberApi.getSelfNoti({
          OrderBy: "dateDesc",
        });
        if (response.success) {
          const data = response.data.message;
          if (isEmpty(notiFilter)) {
            setNotifications(data);
          } else if (notiFilter === "readed") {
            setNotifications(filter(data, (o) => o.isRead));
          } else {
            setNotifications(filter(data, (o) => !o.isRead));
          }
        }
      } catch (error) {
        ToastError({ text: "Không thể lấy thông báo" });
      }
    };

    if (!isNil(member)) {
      getSelfNoti();
    }
  }, [member, notiFilter, reload]);

  const logout = () => {
    dispatch(authAction.logout());
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-1000 my-5">
      <div className="relative flex items-center px-5 py-10 h-12 bg-light-sky">
        {openSearch && (
          <>
            {member.role === "ADMIN" && (
              <div
                className={`absolute top-full left-0 pl-10 pr-5 w-full ${
                  !isEmpty(search) ? "h-[40rem]" : "h-fit"
                }`}
              >
                <div className="relative bg-white rounded-lg shadow-md p-5 pt-0 h-full overflow-y-auto">
                  <div className="sticky top-0 bg-white py-5 z-50">
                    <div
                      className="flex items-center gap-2 text-purple font-bold cursor-pointer hover:underline w-fit"
                      onClick={() => setOpenSearch(false)}
                    >
                      <div className="text-lg">
                        <IoIosReturnLeft />
                      </div>
                      <div className="text-sm">Quay về</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-300 p-3 mb-5">
                    <div className="font-bold text-xl mb-2">
                      Kết quả tìm kiếm
                    </div>
                    <div>
                      Có{" "}
                      <span className="text-green mb-2">
                        {sum(map(totalSearch, (value) => value))}
                      </span>
                    </div>
                    <div className="text-primary text-sm">
                      Chú thích: hiển thị tối đa 5 kết quả mỗi phân loại
                    </div>
                  </div>
                  {!isEmpty(search) && (
                    <>
                      <div className="grid grid-cols-12 gap-5 mb-5">
                        <div className="col-span-8">
                          <div className="rounded-lg border border-slate-300">
                            <div className="flex justify-between items-center px-5 py-3 bg-green/10">
                              <div className="text-xl font-bold">Nhân sự</div>
                              <div
                                className="text-green text-sm cursor-pointer hover:underline"
                                onClick={() => goToPage("/users")}
                              >
                                Xem tất cả
                              </div>
                            </div>
                            {userLoading ? (
                              <Loading />
                            ) : (
                              <table className="w-full">
                                <thead className="py-2 text-black/70">
                                  <tr>
                                    <th className="py-3 w-1/5 border-b border-slate-300">
                                      Họ và tên
                                    </th>
                                    <th className="py-3 w-1/5 border-b border-slate-300">
                                      Email
                                    </th>
                                    <th className="py-3 w-1/5 border-b border-slate-300">
                                      Level
                                    </th>
                                    <th className="py-3 w-1/5 border-b border-slate-300">
                                      Vai trò
                                    </th>
                                    <th className="py-3 w-1/5 border-b border-slate-300">
                                      Ngày tham gia
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="relative">
                                  {!isEmpty(users) ? (
                                    users.map((user) => {
                                      return (
                                        <tr
                                          className="hover:bg-green/10 cursor-pointer"
                                          key={user.memberId}
                                          onClick={() =>
                                            goToPage(`/users/${user.memberId}`)
                                          }
                                        >
                                          <td className="py-5 border-b border-slate-300">
                                            <div className="text-center grid truncate text-primary px-2">
                                              {user.fullName}
                                            </div>
                                          </td>
                                          <td className="py-5 border-b border-slate-300">
                                            <div className="text-center grid truncate text-primary px-2">
                                              {user.emailAddress}
                                            </div>
                                          </td>
                                          <td className="py-5 border-b border-slate-300">
                                            <div
                                              className="text-center font-bold"
                                              style={{
                                                color:
                                                  user.memberLevels.level
                                                    .levelColor,
                                              }}
                                            >
                                              {
                                                user.memberLevels.level
                                                  .levelName
                                              }
                                            </div>
                                          </td>
                                          <td className="py-5 border-b border-slate-300">
                                            <div className="text-center text-primary">
                                              {toVN(user.role.roleName)}
                                            </div>
                                          </td>
                                          <td className="py-5 border-b border-slate-300">
                                            <div className="text-center text-primary">
                                              {toDate(
                                                user.memberLevels.createdAt
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <td colSpan={10}>
                                      <div className="text-center py-3 font-bold text-black/70">
                                        Không có thành viên nào
                                      </div>
                                    </td>
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>
                        <div className="col-span-4 py-5 px-3 border border-slate-300 rounded-lg">
                          <div className="font-bold text-xl mb-5">Thống kê</div>
                          <div>
                            <div className="flex p-3 bg-purple/20 rounded-md gap-3 mb-4">
                              <div className="p-3 rounded-md flex items-center justify-center text-2xl bg-purple text-white">
                                <AiOutlineBarChart />
                              </div>
                              <div>
                                <div className="text-lg">Tổng cộng</div>
                                <div className="font-normal text-sm">
                                  {sum(map(totalSearch, (value) => value))}
                                </div>
                              </div>
                            </div>
                            <div className="flex p-3 bg-green/20 rounded-md gap-3 mb-4">
                              <div className="p-3 rounded-md flex items-center justify-center text-2xl bg-green text-white">
                                <FaUserAlt />
                              </div>
                              <div>
                                <div className="text-lg">Thành viên</div>
                                <div className="font-normal text-sm">
                                  {totalSearch.users}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-2 bg-red-600/10 rounded-lg mb-4">
                              <div className="text-3xl p-2 bg-orange-600 text-white rounded-lg">
                                <BsBook />
                              </div>
                              <div className="font-bold text-lg">
                                <div>Dự án</div>
                                <div className="font-normal text-sm">
                                  {totalSearch.projects}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-2 bg-yellow-500/10 rounded-lg">
                              <div className="text-3xl p-2 bg-yellow-500 text-white rounded-lg">
                                <FiUsers />
                              </div>
                              <div className="font-bold text-lg">
                                <div>Nhà tài trợ</div>
                                <div className="font-normal text-sm">
                                  {totalSearch.sponsors}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-5 mb-5">
                        <div className="col-span-8">
                          <div className="rounded-lg border border-slate-300">
                            <div className="flex justify-between items-center px-5 py-3 bg-green/10">
                              <div className="text-xl font-bold">Dự án</div>
                              <div
                                className="text-green text-sm cursor-pointer hover:underline"
                                onClick={() => goToPage("/projects/discover")}
                              >
                                Xem tất cả
                              </div>
                            </div>
                            <div>
                              {projectLoading ? (
                                <Loading />
                              ) : (
                                <table className="w-full">
                                  <thead className="py-2 text-black/70">
                                    <tr>
                                      <th className="py-3 w-1/5 border-b border-slate-300">
                                        Tiến độ
                                      </th>
                                      <th className="py-3 w-1/5 border-b border-slate-300">
                                        Tên viết tắt
                                      </th>
                                      <th className="py-3 w-1/5 border-b border-slate-300">
                                        Tên dự án
                                      </th>
                                      <th className="py-3 w-1/5 border-b border-slate-300">
                                        Ngày tạo
                                      </th>
                                      <th className="py-3 w-1/5 border-b border-slate-300">
                                        Thành viên
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="relative">
                                    {!isEmpty(projects) ? (
                                      projects.map((project) => {
                                        return (
                                          <tr
                                            key={project.projectId}
                                            className="hover:bg-green/10 cursor-pointer"
                                            onClick={() =>
                                              goToPage(
                                                `/projects/${project.projectId}`
                                              )
                                            }
                                          >
                                            <td className="py-3 border-b border-slate-300">
                                              <div className="flex justify-center items-center px-2">
                                                <CircularProgressbar
                                                  className="w-11 h-11 font-bold"
                                                  value={
                                                    project.projectStatus ===
                                                      "ended" ||
                                                    project.projectStatus ===
                                                      "cancelled"
                                                      ? 100
                                                      : project.startedAt
                                                      ? (
                                                          differenceInDays(
                                                            new Date(),
                                                            new Date(
                                                              project.startedAt
                                                            )
                                                          ) / 180
                                                        ).toFixed()
                                                      : 0
                                                  }
                                                  maxValue={100}
                                                  text={`${
                                                    project.projectStatus ===
                                                      "ended" ||
                                                    project.projectStatus ===
                                                      "cancelled"
                                                      ? 100
                                                      : project.startedAt
                                                      ? (
                                                          differenceInDays(
                                                            new Date(),
                                                            new Date(
                                                              project.startedAt
                                                            )
                                                          ) / 180
                                                        ).toFixed()
                                                      : 0
                                                  }%`}
                                                  styles={{
                                                    path: {
                                                      stroke: textToColor(
                                                        project.projectStatus
                                                      ),
                                                    },
                                                    text: {
                                                      fill: textToColor(
                                                        project.projectStatus
                                                      ),
                                                      fontWeight: `bold`,
                                                    },
                                                  }}
                                                />
                                              </div>
                                            </td>
                                            <td className="py-3 border-b border-slate-300">
                                              <div className="text-center grid truncate text-green font-bold px-2">
                                                {project.projectShortName}
                                              </div>
                                            </td>
                                            <td className="py-3 border-b border-slate-300">
                                              <div
                                                className="text-center"
                                                style={{
                                                  color: textToColor(
                                                    project.projectStatus
                                                  ),
                                                }}
                                              >
                                                {project.projectName}
                                              </div>
                                            </td>
                                            <td className="py-3 border-b border-slate-300">
                                              <div className="text-center text-primary">
                                                {toDate(project.createdAt)}
                                              </div>
                                            </td>
                                            <td className="py-3 border-b border-slate-300">
                                              <div className="text-center text-primary">
                                                {size(project.members)}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <td colSpan={10}>
                                        <div className="text-center py-3 font-bold text-black/70">
                                          Không có dự án
                                        </div>
                                      </td>
                                    )}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="rounded-lg border border-slate-300">
                            <div className="flex justify-between items-center px-5 py-3 bg-green/10">
                              <div className="text-xl font-bold">
                                Nhà tài trợ
                              </div>
                              <div
                                className="text-green text-sm cursor-pointer hover:underline"
                                onClick={() => goToPage("/sponsors")}
                              >
                                Xem tất cả
                              </div>
                            </div>
                            <div>
                              {sponsorLoading ? (
                                <Loading />
                              ) : (
                                <div>
                                  <div className="grid grid-cols-6 font-bold text-black/70 py-3 border-b border-slate-300">
                                    <div className="col-span-4 text-center">
                                      Thông tin
                                    </div>
                                    <div className="col-span-2 text-center">
                                      Tổng point
                                    </div>
                                  </div>
                                  {sponsors.map((sponsor) => {
                                    return (
                                      <div
                                        onClick={() =>
                                          goToPage(
                                            `/sponsors/${sponsor.sponsorId}`
                                          )
                                        }
                                        key={sponsor.sponsorId}
                                        className="border-b border-slate-300 grid grid-cols-6 p-3 hover:bg-green/10 cursor-pointer"
                                      >
                                        <div className="col-span-4 flex items-center gap-2">
                                          <div>
                                            <img
                                              className="w-8 h-8 rounded-full hover:shadow-md"
                                              src={
                                                sponsor.imageUrl
                                                  ? sponsor.imageUrl
                                                  : `https://ui-avatars.com/api/?name=${sponsor.sponsorName}&length=1&background=30BC97&color=FFFFFF`
                                              }
                                              alt="avatar"
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                          <div>
                                            <div className="grid truncate font-bold text-primary">
                                              {sponsor.sponsorName}
                                            </div>
                                            <div className="text-sm flex items-center gap-2">
                                              <div
                                                className={`w-3 h-3 rounded-full bg-${textToColor(
                                                  sponsor.type
                                                )}`}
                                              ></div>
                                              <div>{toVN(sponsor.type)}</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1 text-yellow-500 font-bold justify-end">
                                          <div>
                                            {sponsor.totalPoint.toLocaleString()}
                                          </div>
                                          <div>
                                            <GiTwoCoins />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div
          className="relative grow px-5"
          onClick={() => setOpenSearch(true)}
          ref={refSearch}
        >
          <SearchInput
            label="Tìm kiếm"
            name="search"
            value={search}
            onChange={getSearchData}
          />
          {openSearch && member.role === "USER" && (
            <div className="absolute top-full mt-2 w-full pr-10">
              <div className="bg-white rounded-lg shadow-md p-5">
                <div className="text-xl font-bold">Kết quả tìm kiếm</div>
                {!isEmpty(search) ? (
                  <div>
                    <div className="mb-5">
                      <div>
                        Có{" "}
                        <span className="text-green mb-2">
                          {totalSearch.projects}
                        </span>{" "}
                        kết quả
                      </div>
                      <div className="text-primary text-sm">
                        Chú thích: hiển thị tối đa 5 kết quả
                      </div>
                    </div>
                    <div className="border border-slate-300 rounded-lg">
                      <div className="flex justify-between items-center px-5 py-3 bg-green/10">
                        <div className="text-xl font-bold">Dự án</div>
                        <div
                          className="text-green text-sm cursor-pointer hover:underline"
                          onClick={() => goToPage("/projects/discover")}
                        >
                          Xem tất cả
                        </div>
                      </div>
                      {projectLoading ? (
                        <Loading />
                      ) : (
                        <table className="w-full">
                          <thead className="py-2 text-black/70">
                            <tr>
                              <th className="py-2 w-1/5 border-b border-slate-300">
                                Tiến độ
                              </th>
                              <th className="py-2 w-1/5 border-b border-slate-300">
                                Tên viết tắt
                              </th>
                              <th className="py-2 w-1/5 border-b border-slate-300">
                                Tên dự án
                              </th>
                              <th className="py-2 w-1/5 border-b border-slate-300">
                                Ngày tạo
                              </th>
                              <th className="py-2 w-1/5 border-b border-slate-300">
                                Thành viên
                              </th>
                            </tr>
                          </thead>
                          <tbody className="relative">
                            {!isEmpty(projects) ? (
                              projects.map((project) => {
                                return (
                                  <tr
                                    key={project.projectId}
                                    className="hover:bg-green/10 cursor-pointer"
                                    onClick={() =>
                                      goToPage(`/projects/${project.projectId}`)
                                    }
                                  >
                                    <td className="py-2 border-b border-slate-300">
                                      <div className="flex justify-center items-center px-2">
                                        <CircularProgressbar
                                          className="w-11 h-11 font-bold"
                                          value={
                                            project.projectStatus === "ended" ||
                                            project.projectStatus ===
                                              "cancelled"
                                              ? 100
                                              : project.startedAt
                                              ? (
                                                  differenceInDays(
                                                    new Date(),
                                                    new Date(project.startedAt)
                                                  ) / 180
                                                ).toFixed()
                                              : 0
                                          }
                                          maxValue={100}
                                          text={`${
                                            project.projectStatus === "ended" ||
                                            project.projectStatus ===
                                              "cancelled"
                                              ? 100
                                              : project.startedAt
                                              ? (
                                                  differenceInDays(
                                                    new Date(),
                                                    new Date(project.startedAt)
                                                  ) / 180
                                                ).toFixed()
                                              : 0
                                          }%`}
                                          styles={{
                                            path: {
                                              stroke: textToColor(
                                                project.projectStatus
                                              ),
                                            },
                                            text: {
                                              fill: textToColor(
                                                project.projectStatus
                                              ),
                                              fontWeight: `bold`,
                                            },
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300">
                                      <div className="text-center grid truncate text-green font-bold px-2">
                                        {project.projectShortName}
                                      </div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300">
                                      <div
                                        className="text-center"
                                        style={{
                                          color: textToColor(
                                            project.projectStatus
                                          ),
                                        }}
                                      >
                                        {project.projectName}
                                      </div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300">
                                      <div className="text-center text-primary">
                                        {toDate(project.createdAt)}
                                      </div>
                                    </td>
                                    <td className="py-2 border-b border-slate-300">
                                      <div className="text-center text-primary">
                                        {size(project.members)}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <td colSpan={10}>
                                <div className="text-center py-3 font-bold text-black/70">
                                  Không có dự án
                                </div>
                              </td>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>Nhập nội dung tìm kiếm</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-64">
          {member && (
            <div className="relative grid grid-cols-4">
              <div className="flex items-center" ref={refNoti}>
                <div
                  className="bg-white shadow-md cursor-pointer rounded-lg text-xl p-3"
                  onClick={() => setOpenNoti(!openNoti)}
                >
                  <div className="relative">
                    <AiOutlineBell />
                    {!isNil(find(notifications, { isRead: false })) && (
                      <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green animate-pulse"></div>
                    )}
                  </div>
                </div>
                {openNoti && (
                  <div className="absolute top-full right-0 bg-white shadow-md rounded-md w-96 p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="font-bold text-xl">Thông báo</div>
                      </div>
                      <div className="text-sm hover:underline cursor-pointer text-black/70">
                        Đánh dấu tất cả đã đọc
                      </div>
                    </div>
                    <div className="flex text-sm py-5">
                      <div className="flex items-center justify-center">
                        <div
                          className={`py-1 px-5 rounded-full font-bold cursor-pointer ${
                            isEmpty(notiFilter)
                              ? "bg-green/10 text-green"
                              : "text-black/70"
                          }`}
                          onClick={() => getNotiFilter("")}
                        >
                          Tất cả
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className={`py-1 px-5 rounded-full font-bold cursor-pointer ${
                            notiFilter === "notread"
                              ? "bg-green/10 text-green"
                              : "text-black/70"
                          }`}
                          onClick={() => getNotiFilter("notread")}
                        >
                          Chưa đọc
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className={`py-1 px-5 rounded-full font-bold cursor-pointer ${
                            notiFilter === "readed"
                              ? "bg-green/10 text-green"
                              : "text-black/70"
                          }`}
                          onClick={() => getNotiFilter("readed")}
                        >
                          Đã đọc
                        </div>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {!isEmpty(notifications) ? (
                        notifications.map((item) => {
                          return (
                            <div
                              key={item.notificationId}
                              className="relative p-3 border-b border-slate-300 cursor-pointer hover:shadow-md rounded-lg"
                              onClick={() => clickNoti(item)}
                            >
                              {!item.isRead && (
                                <div className="absolute top-2 left-0 w-2 h-2 rounded-full bg-green animate-pulse"></div>
                              )}
                              <div>
                                <div className="font-bold">{item.title}</div>
                                <div className="mb-3">{item.content}</div>
                                <div className="text-primary font-bold">
                                  {toDateWithTime(item.createdAt)}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center font-bold py-5">
                          Không có thông báo nào
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="truncate">{member.fullName}</div>
              </div>
              <div
                className="cursor-pointer flex justify-end"
                ref={ref}
                onClick={() => {
                  setOpenMenu(!openMenu);
                }}
              >
                <img
                  className="w-12 h-12 rounded-md hover:shadow-md"
                  src={
                    member.imageUrl
                      ? member.imageUrl
                      : `https://ui-avatars.com/api/?name=${member.fullName}&length=1&background=30BC97&color=FFFFFF`
                  }
                  alt="avatar"
                  referrerPolicy="no-referrer"
                />
                {openMenu && (
                  <div className="absolute top-full right-0 bg-white shadow-md rounded-md w-48">
                    {member?.role === "ADMIN" ? (
                      <div className="font-bold rounded-sm text-sm hover:bg-green/10">
                        <div
                          onClick={() => navigate("/profile/information")}
                          className="flex items-center gap-3 px-5 py-2 text-primary text-sm hover:text-green"
                        >
                          <div>
                            <BiUser className="w-4 h-4" />
                          </div>
                          <div>Tài khoản</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-bold rounded-sm text-sm hover:bg-green/10">
                          <div
                            onClick={() => navigate("/profile")}
                            className="flex items-center gap-3 px-5 py-2 text-primary text-sm hover:text-green"
                          >
                            <div>
                              <TbReport className="w-4 h-4" />
                            </div>
                            <div>Hồ sơ</div>
                          </div>
                        </div>
                        <div className="font-bold rounded-sm text-sm hover:bg-green/10">
                          <div
                            onClick={() => navigate("/profile/information")}
                            className="flex items-center gap-3 px-5 py-2 text-primary text-sm hover:text-green"
                          >
                            <div>
                              <BiUser className="w-4 h-4" />
                            </div>
                            <div>Tài khoản</div>
                          </div>
                        </div>
                        <div className="font-bold rounded-sm text-sm hover:bg-green/10">
                          <div
                            onClick={() => navigate("/profile/payslips")}
                            className="flex items-center gap-3 px-5 py-2 text-primary text-sm hover:text-green"
                          >
                            <div>
                              <BsFillBriefcaseFill className="w-4 h-4" />
                            </div>
                            <div>Phiếu lương</div>
                          </div>
                        </div>
                      </>
                    )}
                    <hr className="border-none h-px bg-slate-200" />
                    <div className="font-bold rounded-sm text-sm hover:bg-red-500/10">
                      <div
                        onClick={logout}
                        className="flex items-center gap-3 px-5 py-2 text-red-500 text-sm"
                      >
                        <div>
                          <BiLogOutCircle className="w-4 h-4" />
                        </div>
                        <div>Đăng xuất</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { TopBar };

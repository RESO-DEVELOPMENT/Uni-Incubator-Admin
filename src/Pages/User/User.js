import { TopBar } from "../Layout/TopBar";
import { useState, useEffect } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import UserTable from "../../Components/Table/UserTable";
import AddUserModal from "./Components/AddUserModal";
import ToastError from "./../../Components/Alert/ToastError";
import memberApi from "./../../API/Member/memberApi";
import userApi from "./../../API/User/userApi";
import ToastSuccess from "./../../Components/Alert/ToastSuccess";
import {
  find,
  findIndex,
  isEmpty,
  isNil,
  pickBy,
  remove,
  size,
  values,
} from "lodash";
import { useSelector } from "react-redux";
import UserDetailModal from "./Components/UserDetailModal";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { BsListStars } from "react-icons/bs";
import TextInputSimple from "../../Components/Input/TextInputSimple";
import SelectSimple from "../../Components/Select/SelectSimple";
import levelApi from "../../API/Level/levelApi";
import ConfirmModal from "./Components/ConfirmModal";

const User = () => {
  const currentMember = useSelector((state) => state.auth.member);

  let { userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [achievementLoading, setAchievementLoading] = useState(false);

  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedUserProjects, setSelectedUserProjects] = useState([]);
  const [selectedUserAchievement, setSelectedUserAchievement] = useState({});

  const [currentXp, setCurrentXp] = useState(0);
  const [nextlevel, setNextlevel] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [reload, setReload] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [orderOptions] = useState([
    { value: "dateDesc", label: "Ngày tạo giảm dần" },
    { value: "dateAsc", label: "Ngày tạo tăng dần" },
    { value: "levelAsc", label: "Cấp độ tăng dần" },
    { value: "levelDesc", label: "Cấp độ giảm dần" },
  ]);
  const [emailAddress, setEmailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [orderBy, setOrderBy] = useState("dateDesc");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDisabled, setUserToDisabled] = useState({});

  document.title = "Nhân sự | UniCare";

  const getSelectedUsers = (data) => {
    setSelectedUsers(data.selectedRows);
  };

  const getUserInformation = (user) => {
    navigate(`/users/${user.memberId}`);
  };

  const closeAddModal = () => {
    setOpenModal(false);
  };

  const closeDetailModal = () => {
    navigate("/users");
    setSelectedUser({});
    setSelectedUserAchievement({});
    setSelectedUserProjects([]);
    setOpenDetailModal(false);
  };

  const addUser = async (user) => {
    setLoading(true);
    try {
      const response = await userApi.add({
        emailAddress: user.email,
        password: user.password,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        sendEmail: user.sendEmail,
      });
      if (response.success) {
        closeAddModal();
        ToastSuccess({ text: "Đã thêm thành công" });
        setReload(-1);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  const removeUser = async (userId) => {
    try {
      const response = await memberApi.updateMemberStatus({
        memberId: userId,
        status: "unavailable",
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        setOpenConfirm(false);
        setUserToDisabled({});
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const disabledUser = async (user) => {
    setUserToDisabled(user);
    setOpenConfirm(true);
  };

  const disabledUserConfirm = async () => {
    try {
      const response = await memberApi.updateMemberStatus({
        memberId: userToDisabled.memberId,
        status: "disabled",
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const activeUser = async (userId) => {
    try {
      const response = await memberApi.updateMemberStatus({
        memberId: userId,
        status: "available",
      });
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        setReload(!reload);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
  };

  const handleSort = async (column, sortDirection) => {
    if (sortDirection === "asc") {
      setOrderBy("dateAsc");
    } else if (sortDirection === "desc") {
      setOrderBy("dateDesc");
    }
    setPage(-1);
  };

  const getPage = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  useEffect(() => {
    if (page === -1) {
      setPage(1);
      return;
    }
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await memberApi.get({
          page: page,
          "page-size": pageSize,
          OrderBy: orderBy,
          FullName: fullName,
          EmailAddress: emailAddress,
        });
        if (response.success) {
          const pagination = JSON.parse(response.headers.pagination);
          settotalPages(pagination.totalPages);
          setCurrentPage(pagination.currentPage);
          const membersList = remove(
            response.data.message,
            (member) => member.memberId !== currentMember.memberId
          );
          setMembers(membersList);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };
    if (!isEmpty(fullName) || !isEmpty(emailAddress)) {
      const timer = setTimeout(() => {
        getUsers();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      getUsers();
    }
  }, [
    page,
    pageSize,
    orderBy,
    currentMember.memberId,
    reload,
    emailAddress,
    fullName,
  ]);

  useEffect(() => {
    const getUserNextLevel = async (userId) => {
      try {
        const response = await memberApi.getMemberWallet(userId);
        if (response.success) {
          setCurrentXp(response.data.message.totalXP);
          const leRes = await levelApi.get({
            OrderBy: "requiredXPAsc",
          });
          if (leRes.success) {
            const data = leRes.data.message;
            if (!isNil(selectedUser.memberLevels)) {
              const currentXp = response.data.message.totalXP;
              const currentLevel = selectedUser.memberLevels.level.levelName;

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
    if (userId) {
      getUserNextLevel(userId);
    }
  }, [userId, selectedUser]);

  useEffect(() => {
    const getUserFromUrl = async (userId) => {
      setModalLoading(true);
      try {
        const userRes = await memberApi.getById(userId);
        if (userRes.success) {
          const user = userRes.data.message;
          setSelectedUser(user);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
        setOpenDetailModal(false);
      }
    };

    const getUserProjects = async (userId) => {
      try {
        const response = await memberApi.getMemberProjects(userId);
        if (response.success) {
          setSelectedUserProjects(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setModalLoading(false);
    };

    const getUserAchievement = async (userId) => {
      setAchievementLoading(true);
      try {
        const response = await memberApi.getMemberAchievement(userId);
        if (response.success) {
          setSelectedUserAchievement(response.data.message);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setAchievementLoading(false);
    };

    if (userId) {
      setOpenDetailModal(true);
      getUserFromUrl(userId);
      getUserProjects(userId);
      getUserAchievement(userId);
    } else {
      setSelectedUser({});
      setSelectedUserAchievement({});
      setSelectedUserProjects([]);
      setOpenDetailModal(false);
    }
  }, [userId]);

  return (
    <>
      <TopBar />
      <div className="pl-10 pr-14 mb-10">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="grid grid-cols-5 gap-10 mb-10">
            <div className="flex items-center gap-10">
              <div className="font-bold text-2xl">Quản lý nhân sự</div>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer text-green hover:underline"
              onClick={() => navigate("/levels")}
            >
              <div className="p-1 bg-green/10 text-xl rounded-full">
                <AiFillEdit />
              </div>
              <div className="text-xs font-bold">Quản lý level</div>
            </div>
            <div></div>
            <div className="select-none flex items-center">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <div className="p-2 rounded-full bg-purple/10 text-purple text-lg">
                  <BsListStars />
                </div>
                <div className="font-bold text-purple text-sm">Lọc kết quả</div>
                <div className="border border-purple w-5 h-5 bg-purple/10 text-purple rounded-sm text-sm flex items-center justify-center font-bold">
                  {size(
                    values(
                      pickBy(
                        {
                          emailAddress,
                          fullName,
                          orderBy,
                        },
                        (value) => !isEmpty(value)
                      )
                    )
                  )}
                </div>
              </div>
            </div>
            <div
              className="flex justify-end items-center gap-2 text-green font-bold cursor-pointer select-none"
              onClick={() => setOpenModal(true)}
            >
              <BiMessageSquareAdd />
              <div>Thêm quản trị viên mới</div>
            </div>
          </div>
          <div
            className={`grid grid-cols-5 gap-5 ${
              openFilter ? "mb-5" : "h-0 overflow-hidden"
            }`}
          >
            <div>
              <TextInputSimple
                label="Tên thành viên"
                placeholder="Tìm kiếm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <TextInputSimple
                label="Email"
                placeholder="Tìm kiếm"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="col-span-2"></div>
            <div>
              <SelectSimple
                label="Sắp xếp"
                options={orderOptions}
                onChange={(data) => setOrderBy(data.value)}
              />
            </div>
          </div>
          <div>
            <UserTable
              data={members}
              getSelectedUsers={getSelectedUsers}
              selectedUsers={selectedUsers}
              getUserInformation={getUserInformation}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              currentPage={currentPage}
              getPage={getPage}
              handleSort={handleSort}
              removeUser={removeUser}
              activeUser={activeUser}
              disabledUser={disabledUser}
            />
          </div>
        </div>
        {openModal && (
          <div>
            <AddUserModal
              onCloseModal={closeAddModal}
              addUser={addUser}
              loading={loading}
            />
          </div>
        )}
        {openDetailModal && (
          <div>
            <UserDetailModal
              onCloseModal={closeDetailModal}
              user={selectedUser}
              userProjects={selectedUserProjects}
              loading={modalLoading}
              achievementLoading={achievementLoading}
              achievement={selectedUserAchievement}
              currentXp={currentXp}
              nextlevel={nextlevel}
            />
          </div>
        )}
        {openConfirm && (
          <ConfirmModal
            closeModal={() => {
              setOpenConfirm(false);
              setUserToDisabled({});
            }}
            user={userToDisabled}
            disabledUser={disabledUserConfirm}
          />
        )}
      </div>
    </>
  );
};

export default User;

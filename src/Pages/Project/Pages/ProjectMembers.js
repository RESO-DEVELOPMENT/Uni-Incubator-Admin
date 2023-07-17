import { useState } from "react";
import memberApi from "../../../API/Member/memberApi";
import ToastError from "../../../Components/Alert/ToastError";
import CardUser from "../../../Components/Card/CardUser";
import Loading from "../../../Components/Loading/Loading";
import UserDetailModal from "../../User/Components/UserDetailModal";
import { AiOutlineUserAdd } from "react-icons/ai";
import RequestModal from "../Components/RequestModal";
import UserP2Modal from "../Components/UserP2Modal";
import projectApi from "../../../API/Project/projectApi";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import RemoveMemberModal from "../Components/RemoveMemberModal";
import { find, findIndex, isNil } from "lodash";
import levelApi from "../../../API/Level/levelApi";

const ProjectMembers = (props) => {
  const [user, setUser] = useState({});
  const [userProjects, setUserProjects] = useState([]);
  const [userAchievement, setUserAchievement] = useState({
    totalWorkHours: 0,
    totalTaskDone: 0,
  });
  const [userLoading, setUserLoading] = useState(false);
  const [achievementLoading, setAchievementLoading] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [openP2Modal, setOpenP2Modal] = useState(false);

  const [userToRemove, setUserToRemove] = useState({});
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [currentXp, setCurrentXp] = useState(0);
  const [nextlevel, setNextlevel] = useState({});

  const [openRequestModal, setOpenRequestModal] = useState(false);

  const closeDetailModal = () => {
    setUserProjects([]);
    setUser({});
    setOpenDetailModal(false);
  };

  const closeRequestModal = () => {
    setOpenRequestModal(false);
  };

  const getUserInformation = (user) => {
    setOpenDetailModal(true);
    setUser(user.member);
    getUserProjects(user);
    getUserAchievement(user);
    getUserNextLevel(user.member);
  };

  const getUserP2Information = (user) => {
    setOpenP2Modal(true);
    setUser(user);
  };

  const closeP2Modal = () => {
    setOpenP2Modal(false);
    setUser({});
  };

  const openRemoveMember = (user) => {
    setUserToRemove(user);
    setOpenRemoveModal(true);
  };

  const removeMember = async () => {
    setRemoveLoading(true);
    try {
      const response = await projectApi.updateMemberStatus({
        projectMemberId: userToRemove.projectMemberId,
        status: "inactive",
      });
      if (response.success) {
        ToastSuccess({ text: "Xóa thành viên thành công" });
        setUserToRemove({});
        setOpenRemoveModal(false);
        props.getActiveReload();
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setRemoveLoading(false);
  };

  const getUserNextLevel = async (user) => {
    try {
      const response = await memberApi.getMemberWallet(user.memberId);
      if (response.success) {
        setCurrentXp(response.data.message.totalXP);
        const leRes = await levelApi.get({
          OrderBy: "requiredXPAsc",
        });
        if (leRes.success) {
          const data = leRes.data.message;
          if (!isNil(user.memberLevels)) {
            const currentXp = response.data.message.totalXP;
            const currentLevel = user.memberLevels.level.levelName;

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

  const getUserProjects = async (user) => {
    setUserLoading(true);
    try {
      const response = await memberApi.getMemberProjects(user.member.memberId);
      if (response.success) {
        setUserProjects(response.data.message);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setUserLoading(false);
  };

  const getUserAchievement = async (user) => {
    setAchievementLoading(true);
    try {
      const response = await memberApi.getMemberAchievement(
        user.member.memberId
      );
      if (response.success) {
        setUserAchievement(response.data.message);
      } else {
        ToastError({ text: response.errorName });
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setAchievementLoading(false);
  };

  return (
    <div>
      <div className="font-bold mb-5">
        <div className="flex items-center justify-between">
          <div className="text-xl">Thành viên trong dự án</div>
          {props.isManager &&
            (props.project.projectStatus === "created" ||
              props.project.projectStatus === "started") && (
              <div
                className="text-green cursor-pointer flex items-center gap-2"
                onClick={() => setOpenRequestModal(true)}
              >
                <div className="p-1 bg-green/10 rounded-full">
                  <AiOutlineUserAdd />
                </div>
                <div>Thêm thành viên</div>
              </div>
            )}
        </div>
        <div className="text-orange-600">
          Số thành viên:{" "}
          {props.project.members ? props.project.members.length : 0}
        </div>
      </div>
      {props.loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {props.project.members?.map((member) => {
            return (
              <CardUser
                key={member.member.memberId}
                user={member}
                confirm={
                  props.currentMember.role === "ADMIN"
                    ? getUserInformation
                    : getUserP2Information
                }
                cancel={openRemoveMember}
                isManager={props.isManager}
                isAdmin={props.currentMember.role === "ADMIN"}
                currentMember={props.currentMember}
              />
            );
          })}
        </div>
      )}
      {openDetailModal && (
        <div>
          <UserDetailModal
            onCloseModal={closeDetailModal}
            user={user}
            userProjects={userProjects}
            loading={userLoading}
            achievement={userAchievement}
            achievementLoading={achievementLoading}
            currentXp={currentXp}
            nextlevel={nextlevel}
          />
        </div>
      )}
      {openRequestModal && (
        <RequestModal
          closeRequestModal={closeRequestModal}
          projectId={props.projectId}
          getActiveReload={props.getActiveReload}
        />
      )}
      {openP2Modal && <UserP2Modal closeModal={closeP2Modal} user={user} />}
      {openRemoveModal && (
        <RemoveMemberModal
          loading={removeLoading}
          member={userToRemove}
          closeModal={() => {
            setUserToRemove({});
            setOpenRemoveModal(false);
          }}
          removeMember={removeMember}
        />
      )}
    </div>
  );
};

export default ProjectMembers;

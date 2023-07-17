import Modal from "../../../Components/Modal/Modal";
import { MdEmail } from "react-icons/md";
import { AiFillProject, AiFillStar, AiOutlineClose } from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import { BsJournalBookmarkFill } from "react-icons/bs";
import tree from "../../../Pictures/tree.png";
import Button from "../../../Components/Button/Button";
import Loading from "../../../Components/Loading/Loading";
import { filter, isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDetailModal = (props) => {
  const currentMember = useSelector((state) => state.auth.member);
  const navigate = useNavigate();

  return (
    <Modal overflow={true}>
      <div className="w-80 rounded-lg shadow-md bg-white p-5">
        <div className="flex justify-end">
          <div
            className="text-red-500 font-bold text-lg cursor-pointer rounded-full hover:bg-red-500/20 p-1"
            onClick={props.onCloseModal}
          >
            <AiOutlineClose />
          </div>
        </div>

        <div className="flex justify-center">
          {!props.loading ? (
            <img
              className="rounded-full w-20 h-20"
              src={
                props.user.imageUrl
                  ? props.user.imageUrl
                  : `https://ui-avatars.com/api/?name=${props.user.fullName}&length=1&background=30BC97&color=FFFFFF`
              }
              alt="avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="bg-slate-200 w-20 h-20 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="text-center font-bold text-lg mb-5">
          {props.user.fullName ? (
            props.user.fullName
          ) : (
            <div className="bg-slate-200 w-1/2 rounded-md animate-pulse mt-3 h-5 translate-x-1/2"></div>
          )}
        </div>
        <div className="font-bold mb-3">Thông tin</div>
        <div className="flex items-center gap-2 mb-3">
          <div>
            <MdEmail className="text-green" />
          </div>
          <div>
            {props.user.emailAddress ? (
              props.user.emailAddress
            ) : (
              <span className="animate-pulse text-green font-bold">...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div>
            <AiFillProject className="text-green" />
          </div>
          <div>
            Dự án tham gia:{" "}
            <span className="text-green">
              {!props.loading && props.userProjects ? (
                filter(
                  props.userProjects,
                  (project) => project.role !== "manager"
                ).length
              ) : (
                <span className="animate-pulse text-green font-bold">...</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div>
            <AiFillStar className="text-green" />
          </div>
          <div>
            Quản lý dự án:{" "}
            <span className="text-green">
              {!props.loading && props.userProjects ? (
                filter(
                  props.userProjects,
                  (project) => project.role === "manager"
                ).length
              ) : (
                <span className="animate-pulse text-green font-bold">...</span>
              )}
            </span>
          </div>
        </div>
        <div
          className={`grid grid-cols-12 ${
            !isEmpty(props.userProjects) && "mb-5"
          }`}
        >
          {!isEmpty(props.userProjects) && (
            <div>
              <BsJournalBookmarkFill className="text-green" />
            </div>
          )}
          {!isEmpty(props.userProjects) && (
            <>
              {props.loading ? (
                <Loading />
              ) : (
                <div className="col-span-11 grid grid-cols-3 gap-2">
                  {props.userProjects.map((project) => {
                    return (
                      <div
                        onClick={() =>
                          navigate(`/projects/${project.projectId}`)
                        }
                        className="rounded-full bg-green/30 text-green text-xs px-2 py-1 w-20 text-center truncate cursor-pointer hover:underline"
                      >
                        {project.projectName}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <div className="font-bold mb-3">Thống kê đóng góp</div>
        {props.achievementLoading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div className="flex mb-5">
            <div className="flex flex-col items-center font-bold w-1/2 text-sm">
              <HiBadgeCheck className="w-10 h-10 text-yellow-500" />
              <div>Giờ làm</div>
              <div className="text-green">
                {props.achievement.totalWorkHours}
              </div>
            </div>
            <div className="flex flex-col items-center font-bold w-1/2 text-sm">
              <HiBadgeCheck className="w-10 h-10 text-yellow-500" />
              <div>Công việc</div>
              <div className="text-green">
                {props.achievement.totalTaskDone}
              </div>
            </div>
          </div>
        )}
        <div className="p-3 flex items-center justify-between bg-gradient-to-bl from-green/50 to-green text-white rounded-lg mb-5">
          <div className="w-1/2">
            <div className="font-bold mb-3">Cấp hiện tại</div>
            <div className="font-bold mb-3">
              {!isEmpty(props.user) && props.user.memberLevels.level.levelName}
            </div>
            <div className="mb-3">
              Số XP hiện có: <div>{props.currentXp} Xp</div>
            </div>
            <div className="text-xs">
              Còn <span>{props.nextlevel?.xpNeeded - props.currentXp}</span> XP để lên hạng kế tiếp
            </div>
          </div>
          <div>
            <img src={tree} alt="tree" />
          </div>
        </div>
        {currentMember.role === "ADMIN" && (
          <div>
            <Button
              type="trans"
              text="Xem phiếu lương"
              onClick={() => navigate(`/users/${props.user.memberId}/payslips`)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserDetailModal;

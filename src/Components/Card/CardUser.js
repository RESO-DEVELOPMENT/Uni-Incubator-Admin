import { GiFireFlower } from "react-icons/gi";
import { IoIosPaper } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CardUser = (props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-md border border-slate-300 p-3 w-60">
      <div className="flex flex-col items-center">
        <img
          className="w-20 h-20 rounded-full mb-2"
          src={
            props.user.member.imageUrl
              ? props.user.member.imageUrl
              : `https://ui-avatars.com/api/?name=${props.user.member.fullName}&length=1&background=30BC97&color=FFFFFF`
          }
          alt="avatar"
          referrerPolicy="no-referrer"
        />
        <div className="font-bold mb-5">{props.user.member.fullName}</div>
        <div className={props.isManager || props.isAdmin ? "mb-5" : ""}>
          <div className="flex items-center gap-2 text-green font-bold text-sm">
            <GiFireFlower />
            <div>
              {props.user.member.memberLevels.level.levelName.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
            <IoIosPaper />
            <div>{props.user.role.toUpperCase()}</div>
          </div>
        </div>
        {props.isManager &&
          !props.isAdmin &&
          props.currentMember.memberId !== props.user.member.memberId && (
            <div className="w-full flex items-center justify-between text-sm">
              <div
                className="px-3 py-1 bg-green/20 text-green rounded-md cursor-pointer hover:underline"
                onClick={() => {
                  props.confirm(props.user);
                }}
              >
                Thông tin
              </div>
              <div
                className="px-3 py-1 bg-red-500/20 text-red-500 rounded-md cursor-pointer hover:underline"
                onClick={() => {
                  props.cancel(props.user);
                }}
              >
                Rời dự án
              </div>
            </div>
          )}
        {props.isAdmin && (
          <div className="w-full flex items-center justify-between text-sm">
            <div
              className="px-3 py-1 bg-green/20 text-green rounded-md cursor-pointer hover:underline"
              onClick={() => {
                props.confirm(props.user);
              }}
            >
              Thông tin
            </div>
            <div
              className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-md cursor-pointer hover:underline"
              onClick={() => {
                navigate(`/users/${props.user.member.memberId}/payslips`);
              }}
            >
              Phiếu lương
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CardUser;

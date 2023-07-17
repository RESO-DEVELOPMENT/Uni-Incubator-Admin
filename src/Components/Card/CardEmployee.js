import { BsFillPencilFill } from "react-icons/bs";
import { RiVipCrownFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import Loading from "../Loading/Loading";

const CardEmployee = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full p-5 font-bold content-middle text-xl flex flex-col justify-center">
      <div className="flex gap-5 items-center mb-3">
        <div>{props.title}</div>
        <div className="text-lg">
          <BsFillPencilFill />
        </div>
      </div>
      {props.loading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex p-3 bg-purple/20 rounded-md gap-3">
            <div className="p-3 rounded-md flex items-center justify-center text-2xl bg-purple text-white">
              <RiVipCrownFill />
            </div>
            <div>
              <div className="text-lg">Quản trị viên</div>
              <div className="font-normal text-sm">{props.totalAdmin}</div>
            </div>
          </div>
          <div className="py-2"></div>
          <div className="flex p-3 bg-green/20 rounded-md gap-3">
            <div className="p-3 rounded-md flex items-center justify-center text-2xl bg-green text-white">
              <FaUsers />
            </div>
            <div>
              <div className="text-lg">Thành viên</div>
              <div className="font-normal text-sm">{props.totalMember}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardEmployee;

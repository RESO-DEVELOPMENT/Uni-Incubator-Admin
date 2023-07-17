import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import MemberP2Information from "../Pages/MemberP2Information";

const UserP2Modal = (props) => {
  return (
    <Modal>
      <div className="w-3/4 bg-white rounded-lg shadow-md p-5">
        <div className="flex items-center justify-between mb-10">
          <div className="text-xl font-bold text-black/70">
            Thông tin thành viên dự án
          </div>
          <div
            className="p-2 text-xl text-red-600 rounded-full cursor-pointer hover:bg-red-500/10"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div>
          <MemberP2Information
            user={props.user}
            closeModal={props.closeModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UserP2Modal;

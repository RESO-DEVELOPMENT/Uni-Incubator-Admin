import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";

const ConfirmModal = (props) => {
  return (
    <Modal>
      <div className="w-96 bg-white rounded-lg shadow-md p-5">
        <div className="flex items-center justify-between mb-10">
          <div className="text-xl font-bold text-black/70">
            Vô hiệu hóa thành viên
          </div>
          <div
            className="p-2 text-xl text-red-600 rounded-full cursor-pointer hover:bg-red-500/10"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className="mb-10">
          Bạn có chắc chắn muốn vô hiệu hóa{" "}
          <span className="font-bold text-green">{props.user.fullName}</span>{" "}
          không ?
        </div>
        <div className="flex justify-between">
          <div>
            <Button type="trans" text="Hủy bỏ" onClick={props.closeModal} />
          </div>
          <div>
            <ButtonCancel text="Đồng ý" onClick={props.disabledUser} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import Button from "../../../Components/Button/Button";

const ProceedModal = (props) => {
  return (
    <Modal>
      <div className="bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-bold">Thông tin chu kỳ lương</div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className="text-primary font-bold mb-10">
          Yêu cầu đang được xử lý, xin hãy đợi trong giây lát
        </div>
        <div>
          <Button type="trans" text="Quay về" onClick={props.closeModal} />
        </div>
      </div>
    </Modal>
  );
};

export default ProceedModal;

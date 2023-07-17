import { AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import Button from "../../../Components/Button/Button";
import { useNavigate } from "react-router-dom";

const ConfirmModal = (props) => {
  const navigate = useNavigate();

  return (
    <Modal>
      <div className="w-96 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center mb-5">
          <div className="text-xl font-bold text-green">
            Nộp báo cáo thành công
          </div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className="flex justify-center items-center mb-5">
          <div className="text-6xl text-green">
            <AiFillCheckCircle />
          </div>
        </div>
        <div className="text-center mb-10">
          Bạn đã nộp báo cáo của dự án{" "}
          <span className="font-bold text-primary">
            {props.project.projectName}
          </span>{" "}
          ở chu kỳ lương{" "}
          <span className="font-bold text-primary">{props.cycle.name}</span>
        </div>
        <div>
          <Button type="trans" text="Quay lại báo cáo" onClick={() => navigate("/reports")} />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

import { useState } from "react";
import Modal from "../../../Components/Modal/Modal";
import MemberRequests from "../Pages/MemberRequests";
import { AiOutlineClose } from "react-icons/ai";
import MemberInformation from "../Pages/MemberInformation";

const RequestModal = (props) => {
  const [step, setStep] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);

  const getSelectedRequests = (requests) => {
    setSelectedRequests(requests);
  };

  const getStep = (step) => {
    setStep(step);
  };

  return (
    <Modal overflow={true}>
      <div className="w-3/4 bg-white rounded-lg shadow-md p-5">
        <div className="flex items-center justify-between mb-10">
          <div className="text-xl font-bold text-black/70">
            Thêm thành viên cho dự án
          </div>
          <div
            className="p-2 text-xl text-red-600 rounded-full cursor-pointer hover:bg-red-500/10"
            onClick={props.closeRequestModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className="flex justify-center gap-5 mb-10">
          <div className="flex items-center gap-5 font-bold">
            <div className="flex items-center gap-2">
              <div
                className={`p-1 rounded-full w-8 h-8 flex items-center justify-center ${
                  step >= 1 ? "text-white" : "text-black/70"
                } ${step >= 1 ? "bg-green" : "bg-black/30"}`}
              >
                1
              </div>
              <div className={`${step >= 1 ? "text-green" : "text-black/70"}`}>
                Chọn thành viên
              </div>
            </div>
            <div
              className={`h-px w-24 ${step >= 1 ? "bg-green" : "bg-black/30"}`}
            />
          </div>
          <div className="flex items-center gap-5 font-bold">
            <div className="flex items-center gap-2">
              <div
                className={`p-1 rounded-full w-8 h-8 flex items-center justify-center ${
                  step >= 2 ? "text-white" : "text-black/70"
                } ${step >= 2 ? "bg-green" : "bg-black/30"}`}
              >
                2
              </div>
              <div className={`${step >= 2 ? "text-green" : "text-black/70"}`}>
                Điền thông tin
              </div>
            </div>
            <div
              className={`h-px w-24 ${step >= 2 ? "bg-green" : "bg-black/30"}`}
            />
          </div>
          <div className="flex items-center gap-5 font-bold">
            <div className="flex items-center gap-2">
              <div
                className={`p-1 rounded-full w-8 h-8 flex items-center justify-center ${
                  step >= 3 ? "text-white" : "text-black/70"
                } ${step >= 3 ? "bg-green" : "bg-black/30"}`}
              >
                3
              </div>
              <div className={`${step >= 3 ? "text-green" : "text-black/70"}`}>
                Xác nhận
              </div>
            </div>
          </div>
        </div>
        <div>
          {step === 1 ? (
            <MemberRequests
              projectId={props.projectId}
              selectedRequests={selectedRequests}
              getSelectedRequests={getSelectedRequests}
              getStep={getStep}
            />
          ) : (
            step >= 2 && (
              <MemberInformation
                selectedRequests={selectedRequests}
                getSelectedRequests={getSelectedRequests}
                getStep={getStep}
                getActiveReload={props.getActiveReload}
              />
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RequestModal;

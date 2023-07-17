import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import ToastError from "../../../Components/Alert/ToastError";
import projectApi from "../../../API/Project/projectApi";
import { toVN } from "../../../Ultilities/String";
import CancelEndRequestModal from "./CancelEndRequestModal";

const DetailEndRequestModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [request] = useState(props.request);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const updateRequestStatus = async (status) => {
    setOpenConfirmModal(false);
    setLoading(true);
    try {
      const response = await projectApi.updateEndRequestStatus({
        RequestId: request.requestId,
        Status: status,
      });
      if (response.success) {
        props.closeModal();
        props.reload();
        props.getActiveReload();
      }
    } catch (error) {
      setLoading(false);
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  return (
    <Modal>
      <div className="w-96 bg-white rounded-lg p-5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xl font-bold text-black/70">
              Chi tiết yêu cầu
            </div>
            {!props.isAdmin && !loading && request.status === "created" && (
              <div
                className="text-red-500 text-sm cursor-pointer hover:underline"
                onClick={() => setOpenConfirmModal(true)}
              >
                Hủy yêu cầu
              </div>
            )}
          </div>
          <div
            className="p-2 text-xl text-red-600 rounded-full cursor-pointer hover:bg-red-500/10"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="mb-5">
                <div className="mb-2 font-bold text-black/70">Lý do</div>
                <div className="px-3 text-primary font-bold">
                  {request.note ? request.note : "N/A"}
                </div>
              </div>
              <div className="mb-10">
                <div className="mb-2 font-bold text-black/70">
                  Phần point còn lại
                </div>
                <div className="px-3 text-primary font-bold">
                  {toVN(request.pointAction)}
                </div>
              </div>
              <div className="flex justify-between">
                {props.isAdmin && request.status === "created" ? (
                  <>
                    <div>
                      <ButtonCancel
                        text="Từ chối"
                        onClick={() => {
                          updateRequestStatus("rejected");
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        text="Duyệt"
                        onClick={() => {
                          updateRequestStatus("accepted");
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full">
                      <Button
                        type="trans"
                        text="Quay lại"
                        onClick={props.closeModal}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {openConfirmModal && (
            <CancelEndRequestModal
              closeModal={() => setOpenConfirmModal(false)}
              removeRequest={() => updateRequestStatus("cancelled")}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DetailEndRequestModal;

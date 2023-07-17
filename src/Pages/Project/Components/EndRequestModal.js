import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import ToastError from "../../../Components/Alert/ToastError";
import projectApi from "../../../API/Project/projectApi";
import TextAreaSimple from "../../../Components/Input/TextAreaSimple";
import { isEmpty } from "lodash";

const EndRequestModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [pointAction, setPointAction] = useState("pointReturnedToSystem");
  const [note, setNote] = useState("Tôi muốn kết thúc dự án");

  const [disabled, setDisabled] = useState(false);

  const activeClassname =
    "p-5 font-bold text-green border border-green cursor-pointer rounded-lg select-none text-center";
  const inactiveClassname =
    "p-5 border boder-slate-200 cursor-pointer rounded-lg hover:text-green hover:border-green font-bold text-primary select-none text-center";

  const getNoteData = (e) => {
    setNote(e.target.value);
    setDisabled(false);
    if (isEmpty(e.target.value?.trim())) {
      setDisabled(true);
    }
  };

  const createEndRequest = async () => {
    setLoading(true);
    try {
      const response = await projectApi.createProjectEndRequest(
        props.projectId,
        {
          Note: note,
          PointAction: pointAction,
        }
      );
      if (response.success) {
        props.closeModal();
        props.getPage(-1);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  return (
    <Modal>
      <div className="w-96 bg-white rounded-lg p-5">
        <div className="flex items-center justify-between mb-10">
          <div className="text-xl font-bold text-black/70">
            Yêu cầu kết thúc dự án
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
                <div>
                  <TextAreaSimple
                    name="note"
                    value={note}
                    placeholder="Tôi muốn kết thúc dự án"
                    rows={5}
                    onChange={getNoteData}
                  />
                </div>
              </div>
              <div className="mb-10">
                <div className="mb-1 font-bold text-black/70">
                  Phần point còn lại
                </div>
                <div className="text-xs font-bold text-primary mb-5">
                  Phần point còn lại sẽ được hệ thống xử lý theo lựa chọn dưới
                  đây
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div
                    className={
                      pointAction === "pointReturnedToSystem"
                        ? activeClassname
                        : inactiveClassname
                    }
                    onClick={() => setPointAction("pointReturnedToSystem")}
                  >
                    Kết thúc dự án và trả point về hệ thống
                  </div>
                  <div
                    className={
                      pointAction === "pointSplitToMembers"
                        ? activeClassname
                        : inactiveClassname
                    }
                    onClick={() => setPointAction("pointSplitToMembers")}
                  >
                    Dừng dự án và tạo báo cáo chia point
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <ButtonCancel
                    type="trans"
                    text="Hủy bỏ"
                    onClick={props.closeModal}
                  />
                </div>
                <div>
                  <Button
                    text="Hoàn tất"
                    onClick={createEndRequest}
                    disabled={disabled}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EndRequestModal;

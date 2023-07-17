import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineFieldTime,
  AiOutlineWarning,
} from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import { toDate } from "../../../Ultilities/Date";
import { BsCalendar2, BsJournalCheck } from "react-icons/bs";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { textToColor, toVN } from "../../../Ultilities/String";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import ToastError from "../../../Components/Alert/ToastError";
import salaryApi from "../../../API/Salary/salaryApi";
import { useNavigate } from "react-router-dom";
import ButtonIcon from "../../../Components/Button/ButtonIcon";
import { TbReport } from "react-icons/tb";
import CancelCycleModal from "./CancelCycleModal";

const DetailCycleModal = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);

  const updateCycleStatus = async (status) => {
    setLoading(true);
    try {
      const response = await salaryApi.updateCycleStatus({
        salaryCycleId: props.cycle.salaryCycleId,
        status: status,
      });
      if (response.success) {
        if (status === "paid" || status === "cancelled") {
          setOpenConfirm(false);
          props.startProceed();
          props.closeModal();
          props.proceedPaid();
        }
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  return (
    <Modal>
      <div className="p-5 bg-white rounded-lg w-1/3">
        <div className="flex justify-between mb-10">
          <div>
            <div className="text-xl font-bold">Thông tin chu kỳ lương</div>
            <div
              className="text-sm text-red-500 hover:underline cursor-pointer"
              onClick={() => setOpenConfirm(true)}
            >
              Hủy kỳ lương
            </div>
          </div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer h-fit"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.loading || loading ? (
          <Loading />
        ) : (
          <div>
            <div className="flex items-center gap-2 font-bold text-primary mb-5">
              <div>
                <BsCalendar2 className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm text-black/70">Tên chu kỳ</div>
                <div>{props.cycle.name ? props.cycle.name : "N/A"}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div className="flex items-center gap-2 font-bold text-primary">
                <div>
                  <BsCalendar2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm text-black/70">Bắt đầu</div>
                  <div>{toDate(props.cycle.startedAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-primary">
                <div>
                  <BsCalendar2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm text-black/70">Kết thúc</div>
                  <div>{toDate(props.cycle.endedAt)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-primary mb-5">
              <div>
                <AiOutlineFieldTime className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm text-black/70">Ngày tạo</div>
                <div>{toDate(props.cycle.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-primary mb-5">
              <div>
                <HiOutlineStatusOnline className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm text-black/70">Trạng thái</div>
                <div style={{ color: textToColor(props.cycle.status) }}>
                  {toVN(props.cycle.status)}
                </div>
              </div>
            </div>
            <div
              className={
                props.cycle.status === "ongoing" ||
                props.cycle.status === "locked"
                  ? "mb-10"
                  : "mb-5"
              }
            >
              {props.cycle.status === "ongoing" ? (
                <div className="flex gap-2">
                  <div className="font-bold text-primary">
                    <AiOutlineWarning className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-bold">
                    <div className="text-primary mb-2">
                      Trạng thái kế tiếp:{" "}
                      <span className="text-orange-600">Duyệt báo cáo</span>
                    </div>
                    <div className="font-normal text-primary text-xs">
                      Ở trạng thái{" "}
                      <span className="text-slate-500 font-bold">
                        "Duyệt báo cáo"
                      </span>{" "}
                      hệ thống sẽ tạm thời khóa chức năng nộp báo cáo của người
                      quản lý dự án
                    </div>
                  </div>
                </div>
              ) : (
                props.cycle.status === "locked" && (
                  <div className="flex gap-2">
                    <div className="font-bold text-primary">
                      <AiOutlineWarning className="w-8 h-8" />
                    </div>
                    <div className="text-sm font-bold">
                      <div className="text-primary mb-2">
                        Trạng thái kế tiếp:{" "}
                        <span className="text-orange-600">Kết thúc chu kỳ</span>
                      </div>
                      <div className="font-normal text-primary text-xs">
                        Ở trạng thái{" "}
                        <span className="text-slate-500 font-bold">
                          "Kết thúc chu kỳ"
                        </span>{" "}
                        hệ thống sẽ tiến hành tính toán chuyển point cho thành
                        viên
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between">
              {props.cycle.status === "ongoing" ? (
                <>
                  <div>
                    <ButtonCancel
                      type="trans"
                      text="Hủy bỏ"
                      onClick={props.closeModal}
                    />
                  </div>
                  <div>
                    <ButtonIcon
                      icon={<BsJournalCheck />}
                      type="trans"
                      text="Duyệt báo cáo"
                      onClick={() => updateCycleStatus("locked")}
                      disabled={props.proceed}
                    />
                  </div>
                </>
              ) : props.cycle.status === "locked" ? (
                <>
                  <div>
                    <ButtonIcon
                      icon={<TbReport />}
                      type="trans"
                      text="Cập nhật báo cáo"
                      onClick={() => updateCycleStatus("ongoing")}
                    />
                  </div>
                  <div>
                    <ButtonIcon
                      icon={<AiOutlineCheck />}
                      text="Kết thúc chu kỳ"
                      onClick={() => updateCycleStatus("paid")}
                      disabled={props.proceed}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <ButtonCancel
                      type="trans"
                      text="Quay về"
                      onClick={props.closeModal}
                    />
                  </div>
                  <div>
                    <Button
                      text="Đi đến báo cáo"
                      onClick={() => navigate("/reports")}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {openConfirm && (
        <CancelCycleModal
          removeCycle={() => updateCycleStatus("cancelled")}
          loading={loading}
          closeModal={() => {
            setOpenConfirm(false);
          }}
        />
      )}
    </Modal>
  );
};

export default DetailCycleModal;

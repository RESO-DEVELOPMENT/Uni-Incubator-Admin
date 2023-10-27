import { AiOutlineClose, AiOutlineWarning } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { useState } from "react";
import DateInput from "../../../Components/Input/DateInput";
import ToastError from "../../../Components/Alert/ToastError";
import Button from "../../../Components/Button/Button";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Loading from "../../../Components/Loading/Loading";
import salaryApi from "../../../API/Salary/salaryApi";
import { isEmpty, isNil, pickBy, set } from "lodash";
import { useNavigate } from "react-router-dom";
import { addMinutes, formatISO, subDays } from "date-fns";
import { toDate } from "../../../Ultilities/Date";
import { textToColor } from "../../../Ultilities/String";

const AddCycleModal = (props) => {
  const [cycle, setCycle] = useState({
    startedAt: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    name: `Chu kỳ lương tháng ${new Date().getMonth() + 1}`,
  });
  const [error, setError] = useState({
    startedAt: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getCycleData = (e) => {
    setCycle((prev) => {
      return {
        ...prev,
        name: e.target.value,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        name: "",
      };
    });
  };

  const getStartDate = (data) => {
    setCycle((prev) => {
      return {
        ...prev,
        startedAt: data,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        startedAt: "",
      };
    });
  };

  const createCycle = async () => {
    const nullUndefinedEmpty = pickBy(
      {
        name: cycle.name.trim(),
        startedAt: cycle.startedAt.startDate,
      },
      (value) => {
        return isNil(value) || isEmpty(value);
      }
    );
    if (!isEmpty(nullUndefinedEmpty)) {
      for (const key in nullUndefinedEmpty) {
        setError((prev) => {
          return {
            ...prev,
            [key]: "*",
          };
        });
      }
      return;
    }
    setLoading(true);
    const dateStr = cycle.startedAt.startDate;
    const date = new Date(dateStr);
    const now = addMinutes(date, 5);
    const formatted = set(now, {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
    });
    const isoString = formatISO(formatted, { representation: "complete" });
    try {
      const response = await salaryApi.createCycle({
        name: cycle.name,
        startedAt: isoString,
      });
      if (response.success) {
        console.log(cycle.startedAt.startDate);
        props.closeModal();
        props.getCurrentCycle(response.data.message);
        props.reload();
        navigate(`/cycles/${response.data.message.salaryCycleId}`);
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
      console.log(cycle.startedAt.startDate);
    }
    setLoading(false);
  };

  return (
    <Modal>
      <div className="p-5 bg-white rounded-lg w-96">
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-bold">Tạo chu kỳ lương mới</div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {isEmpty(props.currentCycle) ||
            (!isEmpty(props.currentCycle) &&
              (props.currentCycle.status === "paid" ||
                props.currentCycle.status === "cancelled")) ? (
              <>
                <div className="mb-10">
                  <div className="mb-5">
                    <div className="mb-3 text-primary font-bold text-sm">
                      Tên chu kỳ
                    </div>
                    <TextInputSimple
                      value={cycle.name}
                      name="name"
                      onChange={getCycleData}
                      placeholder="Nhập tên chu kỳ"
                      error={error.name}
                    />
                  </div>
                  <div className="mb-5">
                    <div className="mb-3 text-primary font-bold text-sm">
                      Bắt đầu
                    </div>
                    <DateInput
                      value={cycle.startedAt}
                      onChange={getStartDate}
                      useRange={false}
                      asSingle={true}
                      displayFormat={"DD/MM/YYYY"}
                      error={error.startedAt}
                      minDate={new Date()}
                    />
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
                    <Button text="Tạo mới" onClick={createCycle} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-5">
                  <div className="mb-5">
                    <div className="mb-3 text-primary font-bold text-sm">
                      Tên chu kỳ
                    </div>
                    <div
                      className="font-bold px-5"
                      style={{ color: textToColor(props.currentCycle.status) }}
                    >
                      {props.currentCycle.name}
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="mb-3 text-primary font-bold text-sm">
                      Bắt đầu
                    </div>
                    <div
                      className="font-bold px-5"
                      style={{ color: textToColor(props.currentCycle.status) }}
                    >
                      {toDate(props.currentCycle.startedAt)}
                    </div>
                  </div>
                </div>
                <div className="font-normal text-primary text-xs flex gap-2 mb-10">
                  <div className="font-bold text-red-500">
                    <AiOutlineWarning className="w-5 h-5" />
                  </div>
                  <div>
                    Hiện tại hệ thống đang trong một kỳ lương, hãy kết thúc kỳ
                    lương hiện tại trước khi tạo mới
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
                      text="Đi đến kỳ lương"
                      onClick={() => {
                        props.closeModal();
                        navigate(`/cycles/${props.currentCycle.salaryCycleId}`);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddCycleModal;

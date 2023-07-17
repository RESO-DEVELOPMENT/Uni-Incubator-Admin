import { AiFillClockCircle,  AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import { SiGumtree } from "react-icons/si";
import { useState } from "react";
import { BiTimer } from "react-icons/bi";
import { GiTwoCoins } from "react-icons/gi";
import { GoDatabase } from "react-icons/go";
import { FaPaperPlane } from "react-icons/fa";
import Button from "../../../Components/Button/Button";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import { CirclePicker } from "react-color";
import Loading from "../../../Components/Loading/Loading";
import { isEmpty } from "lodash";
import ToastError from "../../../Components/Alert/ToastError";
import levelApi from "../../../API/Level/levelApi";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import { useEffect } from "react";

const LevelDetailModal = (props) => {
  const [level, setLevel] = useState(props.level);

  const [error, setError] = useState({
    levelName: "",
    basePoint: "",
    basePointPerHour: "",
    xpNeeded: "",
    minWorkHour: "",
    maxWorkHour: "",
    levelColor: "",
  });
  const [disabled, setDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const getLevelData = (e) => {
    const { name, value } = e.target;

    if (name !== "levelName") {
      if (
        isEmpty(value.trim()) ||
        isNaN(+value) ||
        +value <= 0 ||
        +value > 100000
      ) {
        return;
      } else {
        if (name === "xpNeeded") {
          setLevel((prev) => {
            return {
              ...prev,
              minWorkHour: (value * 2 * 75) / 100,
              maxWorkHour: (value * 2 * 125) / 100,
            };
          });
        }
      }
    } else {
      if (isEmpty(value.trim())) {
        setError((prev) => {
          return {
            ...prev,
            [name]: "*",
          };
        });
        setDisabled(true);
      } else {
        setError((prev) => {
          return {
            ...prev,
            [name]: "",
          };
        });
        setDisabled(false);
      }
    }
    setLevel((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getLevelColor = (updatedColor) => {
    setLevel((prev) => {
      return {
        ...prev,
        levelColor: updatedColor.hex,
      };
    });
  };

  const updateLevel = async () => {
    setLoading(true);
    try {
      const response = await levelApi.updateLevel(level);
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thành công" });
        props.closeModal();
        props.reload();
      }
    } catch (error) {
      ToastError({ text: "Cập nhật thất bại" });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLevel(props.level);
  }, [props.level]);

  return (
    <Modal>
      <div className="bg-white rounded-lg p-5 w-3/4">
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-bold">Thông tin chi tiết level</div>
          <div
            className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
            onClick={props.closeModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.loading || loading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-10 grid grid-cols-6">
              <div className="col-span-2">
                <div className="mb-10 font-bold text-black/70">
                  Chọn màu cho level
                </div>
                <div className="mb-10">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-full mb-3"
                      style={{ backgroundColor: level.levelColor }}
                    ></div>
                    <div
                      className="font-bold"
                      style={{ color: level.levelColor }}
                    >
                      {level.levelName ? level.levelName : "Tên level"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <CirclePicker
                    color={level.levelColor}
                    onChange={getLevelColor}
                  />
                </div>
              </div>
              <div className="col-span-4 grid grid-cols-2 gap-10">
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Tên cấp độ (level)
                  </div>
                  <div>
                    <TextInputSimple
                      name="levelName"
                      inputTextColor="text-green"
                      icon={<SiGumtree className="text-green text-lg" />}
                      value={level.levelName}
                      onChange={getLevelData}
                      error={error.levelName}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">
                    Mức lương theo giờ
                  </div>
                  <div>
                    <TextInputSimple
                      name="basePointPerHour"
                      inputTextColor="text-yellow-500"
                      icon={<GiTwoCoins className="text-yellow-500 text-xl" />}
                      value={level.basePointPerHour}
                      onChange={getLevelData}
                      error={error.basePointPerHour}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">Lương cơ bản</div>
                  <div>
                    <TextInputSimple
                      name="basePoint"
                      inputTextColor="text-green"
                      icon={<GoDatabase className="text-green text-xl" />}
                      value={level.basePoint}
                      onChange={getLevelData}
                      error={error.basePoint}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-bold text-black/70">XP cần có</div>
                  <div>
                    <TextInputSimple
                      name="xpNeeded"
                      inputTextColor="text-per-75"
                      icon={<FaPaperPlane className="text-per-75 text-xl" />}
                      value={level.xpNeeded}
                      onChange={getLevelData}
                      error={error.xpNeeded}
                    />
                  </div>
                </div>
                <div className=" col-span-2 grid grid-cols-2 gap-10">
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Giờ làm tối thiểu
                    </div>
                    <div className="bg-green/10">
                      <TextInputSimple
                        name="minWorkHour"
                        inputTextColor="text-purple"
                        icon={<BiTimer className="text-purple text-xl" />}
                        value={level.minWorkHour}
                        onChange={getLevelData}
                        error={error.minWorkHour}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-black/70">
                      Giờ làm tối đa
                    </div>
                    <div className="bg-green/10">
                      <TextInputSimple
                        name="maxWorkHour"
                        inputTextColor="text-orange-700"
                        icon={
                          <AiFillClockCircle className="text-orange-700 text-xl" />
                        }
                        value={level.maxWorkHour}
                        onChange={getLevelData}
                        error={error.maxWorkHour}
                        disabled={true}
                      />
                    </div>
                  </div>
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
                  text="Chỉnh sửa"
                  disabled={disabled}
                  onClick={updateLevel}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
export default LevelDetailModal;

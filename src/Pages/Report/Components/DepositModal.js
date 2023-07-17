import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import NumberInput from "../../../Components/Input/NumberInput";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";
import ToastError from "../../../Components/Alert/ToastError";
import projectApi from "../../../API/Project/projectApi";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";

const DepositModal = (props) => {
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState(1000);

  const getAmount = (e) => {
    const value = +e.target.value;
    if (value >= 0) {
      setAmount(value);
    }
  };

  const increaseStep = () => {
    setAmount(+amount + 100);
  };

  const depositToProject = async () => {
    setLoading(true);
    try {
      const response = await projectApi.depositToProject(
        props.projectId,
        amount
      );
      if (response.success) {
        ToastSuccess({ text: "Nạp thành công" });
        props.reload();
        props.closeModal();
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  return (
    <Modal>
      <div className="bg-white p-5 rounded-lg w-96">
        <div className="flex justify-between items-center mb-10">
          <div className="text-xl font-bold">Thêm quỹ dự án</div>
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
            <div className="mb-10">
              <div>
                <div className="mb-3 text-primary font-bold text-sm">
                  Nhập số point
                </div>
                <div className="select-none">
                  <NumberInput
                    name="amount"
                    value={amount}
                    onChange={getAmount}
                    increaseButton={true}
                    increaseStep={increaseStep}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <ButtonCancel
                  onClick={props.closeModal}
                  text="Hủy bỏ"
                  type="trans"
                />
              </div>
              <div>
                <Button text="Hoàn tất" onClick={depositToProject} />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DepositModal;

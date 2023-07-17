import { AiFillCheckCircle } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import Button from "../../../Components/Button/Button";
import { useEffect, useState } from "react";

const CountDownModal = (props) => {
  const [timeRemaining, setTimeRemaining] = useState(5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime !== 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      props.closeModal();
    }
  }, [timeRemaining, props]);

  return (
    <Modal>
      <div className="w-96 bg-white p-5 rounded-lg">
        <div className="text-xl font-bold text-center mb-5 text-green">
          Đổi mật khẩu thành công
        </div>
        <div className="flex justify-center items-center mb-5">
          <div className="text-6xl text-green">
            <AiFillCheckCircle />
          </div>
        </div>
        <div className="text-center mb-2 text-primary font-bold">
          Bạn sẽ được chuyển về màn hình đăng nhập trong giây lát
        </div>
        <div className="mb-10 font-bold text-xl text-center text-green">
          {timeRemaining}
        </div>
        <div>
          <Button
            type="trans"
            text="Đăng nhập lại"
            onClick={props.closeModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CountDownModal;

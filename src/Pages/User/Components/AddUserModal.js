import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import { useState } from "react";
import { BiUser } from "react-icons/bi";
import TextInputSimple from "./../../../Components/Input/TextInputSimple";
import PasswordInputSimple from "./../../../Components/Input/PasswordInputSimple";
import Button from "./../../../Components/Button/Button";
import ButtonCancel from "./../../../Components/Button/ButtonCancel";
import { BsCheckSquareFill } from "react-icons/bs";
import Loading from "../../../Components/Loading/Loading";
import { isEmpty, pickBy } from "lodash";

const AddUserModal = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "0123456789",
    sendEmail: true,
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [disabled, setDisabled] = useState(true);

  const getUserData = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => {
      return {
        ...prev,
        [name]: "",
      };
    });
    setDisabled(false);
  };

  const toggleSendEmail = () => {
    setUser((prev) => {
      return {
        ...prev,
        sendEmail: !user.sendEmail,
      };
    });
  };

  const addUser = () => {
    const nullUndefinedEmpty = pickBy(
      {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
      },
      (value) => {
        return isEmpty(value);
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
      setDisabled(true);
      return;
    }
    props.addUser({
      ...user,
      sendEmail: user.sendEmail,
    });
  };

  return (
    <Modal>
      <div className="rounded-lg shadow-md bg-white p-5">
        <div className="flex justify-between items-center w-80 mb-5">
          <div className="font-bold text-lg">Tạo quản trị viên mới</div>
          <div
            className="text-red-500 font-bold text-lg cursor-pointer rounded-full hover:bg-red-500/20 p-1"
            onClick={props.onCloseModal}
          >
            <AiOutlineClose />
          </div>
        </div>
        {props.loading ? (
          <Loading />
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-full p-3 bg-green/30 text-green">
                <BiUser />
              </div>
              <div>
                <div className="text-sm font-bold">
                  {user.email ? user.email : "Email đăng nhập"}
                </div>
                <div className="text-sm">
                  {user.fullName ? user.fullName : "Họ và tên"}
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">
                Họ và tên
              </div>
              <TextInputSimple
                value={user.fullName}
                name="fullName"
                onChange={getUserData}
                placeholder="Nhập họ và tên"
                error={error.fullName}
              />
            </div>
            <div className="mb-5">
              <div className="mb-3 text-primary font-bold text-sm">Email</div>
              <TextInputSimple
                value={user.email}
                name="email"
                onChange={getUserData}
                placeholder="Nhập email"
                error={error.email}
              />
            </div>
            <div className="mb-3">
              <div className="mb-3 text-primary font-bold text-sm">
                Mật khẩu
              </div>
              <PasswordInputSimple
                value={user.password}
                name="password"
                onChange={getUserData}
                placeholder="Nhập mật khẩu"
                error={error.password}
              />
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer mb-10"
              onClick={toggleSendEmail}
            >
              <div className="text-green">
                {!user.sendEmail ? (
                  <div
                    className="w-3 h-3 border border-black rounded-sm"
                    onClick={toggleSendEmail}
                  ></div>
                ) : (
                  <BsCheckSquareFill
                    className="animate-custom-ping"
                    onClick={toggleSendEmail}
                  />
                )}
              </div>
              <span className="select-none text-sm">
                Gửi mail thông báo đến quản trị viên mới
              </span>
            </div>
            <div className="flex items-center justify-between select-none">
              <div>
                <ButtonCancel
                  type="trans"
                  text="Hủy bỏ"
                  font="font-normal"
                  onClick={props.onCloseModal}
                />
              </div>
              <div>
                <Button
                  text="Hoàn tất"
                  font="font-normal"
                  onClick={addUser}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddUserModal;

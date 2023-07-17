import { AiOutlineClose } from "react-icons/ai";
import Modal from "../../../Components/Modal/Modal";
import Loading from "../../../Components/Loading/Loading";
import PasswordInputSimple from "../../../Components/Input/PasswordInputSimple";
import ButtonCancel from "../../../Components/Button/ButtonCancel";
import Button from "../../../Components/Button/Button";

const ChangePasswordModal = (props) => {
  return (
    <Modal>
      <div className="w-96 bg-white rounded-lg p-5">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xl font-bold">Cập nhật mật khẩu mới</div>
            <div
              className="text-red-500 p-1 rounded-full hover:bg-red-500/10 cursor-pointer"
              onClick={props.closeModal}
            >
              <AiOutlineClose />
            </div>
          </div>
          <div className="text-center font-bold text-primary">
            Nhập mật khẩu cũ và mật khẩu mới
          </div>
        </div>
        {props.loading ? (
          <Loading />
        ) : (
          <div>
            <div className="mb-10">
              <div className="mb-5">
                <div className="mb-2 font-bold text-black/70">
                  Mật khẩu hiện tại
                </div>
                <div className="bg-white">
                  <PasswordInputSimple
                    name="currentPassword"
                    value={props.password.currentPassword}
                    onChange={props.getPasswordData}
                    error={props.error.currentPassword}
                  />
                </div>
              </div>
              <div className="mb-5">
                <div className="mb-2 font-bold text-black/70">Mật khẩu mới</div>
                <div className="bg-white">
                  <PasswordInputSimple
                    name="newPassword"
                    value={props.password.newPassword}
                    onChange={props.getPasswordData}
                    error={props.error.newPassword}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 font-bold text-black/70">
                  Xác nhận mật khẩu mới
                </div>
                <div className="bg-white">
                  <PasswordInputSimple
                    name="confirmPassword"
                    value={props.password.confirmPassword}
                    onChange={props.getPasswordData}
                    error={props.error.confirmPassword}
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
                <Button text="Hoàn tất" onClick={props.updatePassword} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;

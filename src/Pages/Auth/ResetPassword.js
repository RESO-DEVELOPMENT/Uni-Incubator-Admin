import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import { useState } from "react";
import resetPassIll from "../../Pictures/resetPassiLL.png";
import logo from "../../Pictures/cnb_logo.png";
import userApi from "../../API/User/userApi";
import { isEmpty } from "lodash";
import Loading from "../../Components/Loading/Loading";
import PasswordInputSimple from "../../Components/Input/PasswordInputSimple";
import ToastError from "../../Components/Alert/ToastError";
import ToastSuccess from "../../Components/Alert/ToastSuccess";

const ResetPassword = () => {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const getPasswordData = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const newError = { ...error };
    let hasErrors = false;
    Object.keys(password).forEach((key) => {
      if (isEmpty(password[key].trim())) {
        newError[key] = "Không được rỗng";
        hasErrors = true;
      }
    });

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (
      password.newPassword &&
      password.confirmPassword &&
      !regex.test(password.newPassword) &&
      !regex.test(password.confirmPassword)
    ) {
      newError.newPassword = "Mật khẩu quá yếu";
      newError.confirmPassword = "Mật khẩu quá yếu";
      hasErrors = true;
    }

    if (
      password.newPassword &&
      password.confirmPassword &&
      password.newPassword !== password.confirmPassword
    ) {
      newError.confirmPassword = "Không khớp";
      hasErrors = true;
    }
    setError(newError);

    if (hasErrors) {
      return;
    }
    setLoading(true);
    try {
      const response = await userApi.resetPassword({
        token: token,
        newPassword: password.newPassword,
      });
      if (response.success) {
        ToastSuccess({ text: "Thành công! Xin hãy đăng nhập lại" });
        navigate("/login");
      }
    } catch (error) {
      ToastError({ text: error.data.ErrorMsg });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center py-5 px-10">
        <div className="flex gap-10 items-center">
          <div>
            <img className="w-48" src={logo} alt="UniCare" />
          </div>
          <div
            className="font-bold cursor-pointer"
            onClick={() =>
              window.open(
                "https://www.facebook.com/Uni.IncubatorVietnam",
                "_blank"
              )
            }
          >
            <h3>Uni Incubator</h3>
          </div>
          <div
            className="font-bold cursor-pointer"
            onClick={() =>
              window.open(
                "https://www.facebook.com/Uni.IncubatorVietnam",
                "_blank"
              )
            }
          >
            <h3>Liên hệ</h3>
          </div>
        </div>
        <div className="flex gap-2">
          <div>
            <Button text="Đăng nhập" onClick={() => navigate("/login")} />
          </div>
          <div>
            <Button
              type="trans"
              text="Trợ giúp"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/Uni.IncubatorVietnam",
                  "_blank"
                )
              }
            />
          </div>
        </div>
      </div>
      <div className="flex px-28 mt-10">
        <div className="w-1/2">
          <img src={resetPassIll} alt="logo" />
        </div>
        <div className="w-1/2 relative flex justify-center items-center">
          <div className="bg-white pt-6 pb-10 px-10 rounded-lg shadow-md w-3/4 h-fit">
            <h1 className="font-bold text-3xl text-center">
              Khôi phục mật khẩu
            </h1>
            {loading ? (
              <div className="mt-5">
                <Loading />
              </div>
            ) : (
              <>
                <form onSubmit={resetPassword}>
                  <div className="my-10">
                    <div className="mb-5">
                      <div className="mb-2 font-bold text-black/70">
                        Mật khẩu mới
                      </div>
                      <div className="bg-white">
                        <PasswordInputSimple
                          name="newPassword"
                          value={password.newPassword}
                          onChange={getPasswordData}
                          error={error.newPassword}
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
                          value={password.confirmPassword}
                          onChange={getPasswordData}
                          error={error.confirmPassword}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button text="Tiếp tục" />
                  </div>
                </form>
                <div className="my-5 text-center">
                  <p>Hoặc</p>
                </div>
                <div>
                  <Button
                    type="trans"
                    text="Quay về đăng nhập"
                    onClick={() => navigate("/login")}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

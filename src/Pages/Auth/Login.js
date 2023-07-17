import logo from "../../Pictures/cnb_logo.png";
import LoginIll from "../../Components/Svgs/loginIll";
import Button from "../../Components/Button/Button";
import { useState } from "react";
import TextInput from "../../Components/Input/TextInput";
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import PasswordInput from "../../Components/Input/PasswordInput";
import { auth, provider } from "../../Service/Firebase/config";
import { signInWithPopup } from "firebase/auth";
import GoogleButton from "./../../Components/Button/GoogleButton";
import authApi from "./../../API/Auth/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authAction } from "../../Store/Slice/userSlice";
import ToastSuccess from "./../../Components/Alert/ToastSuccess";
import Loading from "./../../Components/Loading/Loading";
import ToastError from "../../Components/Alert/ToastError";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  document.title = "Login | UniCare";

  const getUserData = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const loginGoogle = () => {
    setLoading(true);
    signInWithPopup(auth, provider).then(async (data) => {
      try {
        const token = data.user.accessToken;
        const response = await authApi.loginGoogle(token);
        if (response.success) {
          const jwtToken = response.data.message.token;
          const user = response.data.message.user;
          dispatch(authAction.login({ token: jwtToken, member: user }));
          ToastSuccess({ text: "Đăng nhập thành công" });
          navigate("/dashboard");
        }
      } catch (error) {
        ToastError({ text: "Fail to login" });
      }
    });
    setLoading(false);
  };

  const loginWithAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.loginAccount({
        emailAddress: e.target.email.value,
        password: e.target.password.value,
      });
      if (response.success) {
        const jwtToken = response.data.message.token;
        const user = response.data.message.user;
        dispatch(authAction.login({ token: jwtToken, member: user }));
        ToastSuccess({ text: "Đăng nhập thành công" });
        navigate("/dashboard");
      }
    } catch (error) {
      ToastError({ text: "Lỗi đăng nhập" });
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <Loading fullPage={true} />}
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
            <Button text="Đăng nhập" />
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
      <div className="mt-5 flex px-28">
        <div className="w-1/2">
          <LoginIll />
        </div>
        <div className="w-1/2 relative">
          <form onSubmit={loginWithAccount}>
            <div className="absolute left-1/2 top-8 -translate-x-1/2 bg-white pt-6 pb-10 px-10 rounded-lg w-3/4 shadow-md">
              <h1 className="font-bold text-3xl text-center">Đăng Nhập</h1>
              <div className="my-10">
                <div>
                  <TextInput
                    icon={<BiUser className="w-6 h-6" />}
                    label="Email"
                    name="email"
                    value={user.email}
                    onChange={getUserData}
                  />
                </div>
                <div className="my-6"></div>
                <div className="mb-2">
                  <PasswordInput
                    icon={<AiOutlineLock className="w-6 h-6" />}
                    label="Mật khẩu"
                    name="password"
                    value={user.password}
                    onChange={getUserData}
                  />
                </div>
                <div className="flex justify-end">
                  <div
                    className="text-green cursor-pointer hover:underline"
                    onClick={() => navigate("/recover-password")}
                  >
                    Quên mật khẩu
                  </div>
                </div>
              </div>
              <div>
                <Button text="Đăng nhập" />
              </div>
              <div className="my-5 text-center">
                <p>Hoặc</p>
              </div>
              <div>
                <GoogleButton
                  text="Đăng nhập với Google"
                  onClick={loginGoogle}
                />
              </div>
              <div
                className="text-xs text-center text-green font-bold mt-5 cursor-pointer hover:underline"
                onClick={() => navigate("/policy")}
              >
                Bằng cách sử dụng trang web của chúng tôi, bạn đồng ý với các
                điều khoản và điều kiện của chúng tôi.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

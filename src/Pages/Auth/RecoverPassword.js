import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import { useState } from "react";
import resetPassIll from "../../Pictures/resetPassiLL.png";
import { BiUser } from "react-icons/bi";
import TextInput from "../../Components/Input/TextInput";
import logo from "../../Pictures/cnb_logo.png";
import userApi from "../../API/User/userApi";
import { isEmpty } from "lodash";
import Loading from "../../Components/Loading/Loading";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getEmail = (e) => {
    setEmail(e.target.value);
  };

  const requestChangePassword = async (e) => {
    e.preventDefault();
    if (isEmpty(email.trim())) {
      return;
    }
    setLoading(true);
    try {
      const response = await userApi.requestChangePassword({
        emailAddress: email,
      });
      if (response.success) {
        setError("");
        setSuccess(true);
      }
    } catch (error) {
      setSuccess(false);
      setError(error.data.ErrorMsg);
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
                {success ? (
                  <>
                    <div className="my-10">
                      <div className="text-center text-primary font-bold">
                        Đã gửi email xác thực đến email của bạn. Vui lòng kiểm
                        tra email.
                      </div>
                    </div>
                    <div>
                      <Button
                        text="Kiểm tra email"
                        onClick={() => {
                          window.open("https://mail.google.com/");
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <form onSubmit={requestChangePassword}>
                      <div className="my-10">
                        <div>
                          <TextInput
                            icon={<BiUser className="w-6 h-6" />}
                            label="Email"
                            name="email"
                            value={email}
                            onChange={getEmail}
                          />
                        </div>
                        {!isEmpty(error) && (
                          <div className="text-red-500 font-bold text-sm mt-2">
                            {error}
                          </div>
                        )}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;

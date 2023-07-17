import { useState } from "react";
import { AiFillPhone } from "react-icons/ai";
import { BsFacebook, BsFillCalendarCheckFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import memberApi from "../../../API/Member/memberApi";
import ToastError from "../../../Components/Alert/ToastError";
import ToastSuccess from "../../../Components/Alert/ToastSuccess";
import Button from "../../../Components/Button/Button";
import TextInputSimple from "../../../Components/Input/TextInputSimple";
import Loading from "../../../Components/Loading/Loading";
import { toDate } from "../../../Ultilities/Date";
import { isEmpty, last, omitBy, split } from "lodash";
import ImageInput from "../../../Components/Input/ImageInput";
import { useEffect } from "react";
import validator from "validator";
import ChangePasswordModal from "../Components/ChangePasswordModal";
import userApi from "../../../API/User/userApi";
import { authAction } from "../../../Store/Slice/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CountDownModal from "../Components/CountDownModal";

const MemberInformation = () => {
  const [user, setUser] = useState({
    fullName: "",
    phoneNumber: "",
    facebookUrl: "",
    imageAsBase64: "",
  });
  const [error, setError] = useState({
    fullName: "",
    phoneNumber: "",
    facebookUrl: "",
  });
  const [base64Image, setBase64Image] = useState("");

  const [level, setLevel] = useState({});

  const [lastUpdate, setLastUpdate] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const [disabled, setDisabled] = useState(true);

  const [modalLoading, setModalLoading] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorPassword, setErrorPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [openCountDownModal, setOpenCountDownModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const getImageUrl = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBase64Image(reader.result);
      setUser((prev) => {
        return {
          ...prev,
          imageAsBase64: last(split(reader.result, ",")),
        };
      });
    };

    reader.readAsDataURL(file);
    setDisabled(false);
  };

  const isFacebookUrl = (url) => {
    const options = {
      protocols: ["http", "https"],
      host_whitelist: ["facebook.com", "www.facebook.com"],
    };
    return validator.isURL(url, options);
  };

  const isErrorInput = () => {
    let haveError = false;
    if (!isEmpty(user.facebookUrl) && !isFacebookUrl(user.facebookUrl)) {
      setError((prev) => {
        return {
          ...prev,
          facebookUrl: "*",
        };
      });
      haveError = true;
    }
    if (isEmpty(user.fullName.trim())) {
      setError((prev) => {
        return {
          ...prev,
          fullName: "*",
        };
      });
      haveError = true;
    }
    if (
      !isEmpty(user.phoneNumber) &&
      !validator.isMobilePhone(user.phoneNumber)
    ) {
      setError((prev) => {
        return {
          ...prev,
          phoneNumber: "*",
        };
      });
      haveError = true;
    }
    return haveError;
  };

  const updateUser = async () => {
    if (isErrorInput()) {
      return;
    }
    setLoading(true);
    setDisabled(true);
    try {
      const response = await memberApi.updateSelf(omitBy(user, isEmpty));
      if (response.success) {
        ToastSuccess({ text: "Cập nhật thông tin thành công" });
        setLastUpdate(new Date());
      }
    } catch (error) {
      ToastError({ text: "Cập nhật thông tin thất bại" });
    }
    setLoading(false);
  };

  const closePasswordModal = () => {
    setOpenPasswordModal(false);
    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrorPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getPasswordData = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
    setErrorPassword((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const updatePassword = async () => {
    setModalLoading(true);
    const newErrorPassword = { ...errorPassword };
    let hasErrors = false;
    Object.keys(password).forEach((key) => {
      if (isEmpty(password[key].trim())) {
        newErrorPassword[key] = "Không được rỗng";
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
      newErrorPassword.newPassword = "Mật khẩu quá yếu";
      newErrorPassword.confirmPassword = "Mật khẩu quá yếu";
      hasErrors = true;
    }

    if (
      password.newPassword &&
      password.confirmPassword &&
      password.newPassword !== password.confirmPassword
    ) {
      newErrorPassword.confirmPassword = "Không khớp";
      hasErrors = true;
    }
    setErrorPassword(newErrorPassword);

    if (hasErrors) {
      setModalLoading(false);
      return;
    }

    try {
      const response = await userApi.changePassword({
        oldPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      if (response.success) {
        closePasswordModal();
        setOpenCountDownModal(true);
      }
    } catch (error) {
      setErrorPassword({
        currentPassword: "Sai mật khẩu",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setModalLoading(false);
  };

  const updatePasswordSuccess = () => {
    dispatch(authAction.logout());
    navigate("/login");
  };

  useEffect(() => {
    const getSelfInformation = async () => {
      setLoading(true);
      try {
        const response = await memberApi.getMe();
        if (response.success) {
          const data = response.data.message;
          setUser({
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            facebookUrl: data.facebookUrl,
          });
          setLevel(data.memberLevels.level);
          setEmailAddress(data.emailAddress);
          setLastUpdate(data.updatedAt);
          setJoinedDate(data.createdAt);
          setBase64Image(data.imageUrl);
        }
      } catch (error) {
        ToastError({ text: error.data.ErrorMsg });
      }
      setLoading(false);
    };

    getSelfInformation();
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="bg-green/10 font-bold px-7 py-3 mb-5">
        Thông tin cá nhân
      </div>
      {loading ? (
        <div className="my-10">
          <Loading />
        </div>
      ) : (
        <div className="py-5 px-7">
          <div className="flex items-center gap-5 mb-10">
            <ImageInput
              imageUrl={
                base64Image
                  ? base64Image
                  : `https://ui-avatars.com/api/?name=${user.fullName}&length=1&background=30BC97&color=FFFFFF`
              }
              imageClassName="w-24 h-24 rounded-full"
              onChange={getImageUrl}
            />
            <div>
              <div className="font-bold">{user.fullName}</div>
              <div className="text-sm text-black/70 mb-2">{emailAddress}</div>
              <div
                className="font-bold px-5 py-1 rounded-md w-fit"
                style={{
                  color: level.levelColor,
                  backgroundColor: `${level.levelColor}26`,
                }}
              >
                {level.levelName}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <div className="mb-2 font-bold text-black/70">Họ và tên</div>
              <div className="bg-white">
                <TextInputSimple
                  placeholder="Ví dụ: Nguyễn Văn A"
                  icon={<FaUserAlt />}
                  name="fullName"
                  value={user.fullName}
                  onChange={getUserData}
                  error={error.fullName}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 font-bold text-black/70">
                Điện thoại liên hệ
              </div>
              <div className="bg-white">
                <TextInputSimple
                  placeholder="N/A"
                  icon={<AiFillPhone />}
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={getUserData}
                  error={error.phoneNumber}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 font-bold text-black/70">Facebook</div>
              <div className="bg-white">
                <TextInputSimple
                  placeholder="N/A"
                  icon={<BsFacebook />}
                  name="facebookUrl"
                  value={user.facebookUrl}
                  onChange={getUserData}
                  error={error.facebookUrl}
                />
              </div>
            </div>
            {/* EMPTY DIV */}
            <div></div>
            <div className="col-span-2">
              <div className="text-lg font-bold mb-5">Mật khẩu và xác thực</div>
              <div className="w-fit mb-5">
                <Button
                  text="Đổi mật khẩu"
                  onClick={() => setOpenPasswordModal(true)}
                />
              </div>
              <div className="font-bold text-primary">
                <div className="text-sm">Đổi mật khẩu mới</div>
                <div className="text-xs">
                  Bạn sẽ phải đăng xuất ra khỏi các thiết bị và đăng nhập lại
                  nếu thực hiện hành động này.
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 font-bold text-black/70">Ngày tham gia</div>
              <div className="bg-green/10">
                <TextInputSimple
                  placeholder="N/A"
                  icon={<BsFillCalendarCheckFill />}
                  name="phoneNumber"
                  value={joinedDate ? toDate(joinedDate) : "N/A"}
                  disabled={true}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 font-bold text-black/70">
                Lần chỉnh sửa gần nhất
              </div>
              <div className="bg-green/10">
                <TextInputSimple
                  placeholder="N/A"
                  icon={<BsFillCalendarCheckFill />}
                  name="phoneNumber"
                  value={lastUpdate ? toDate(lastUpdate) : "N/A"}
                  disabled={true}
                />
              </div>
            </div>
            {/* EMPTY DIV */}
            <div></div>
            <div className="flex justify-end">
              <div className="w-1/2">
                <Button
                  text="Hoàn tất"
                  onClick={updateUser}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
          {openPasswordModal && (
            <ChangePasswordModal
              closeModal={closePasswordModal}
              password={password}
              getPasswordData={getPasswordData}
              updatePassword={updatePassword}
              error={errorPassword}
              loading={modalLoading}
            />
          )}
          {openCountDownModal && (
            <CountDownModal closeModal={updatePasswordSuccess} />
          )}
        </div>
      )}
    </div>
  );
};

export default MemberInformation;

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastError from "./ToastError";
import jwtDecode from "jwt-decode";
import { isEmpty } from "lodash";
import { AiOutlineBell } from "react-icons/ai";

const ToastNotification = (props) => {
  const goToNoti = () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const decoded = jwtDecode(token);
      const noti = JSON.parse(props.data.targetId);
      const key = Object.keys(noti)[0].toLowerCase();
      const value = Object.values(noti)[0].toLowerCase();
      let url = "";
      if (key.includes("project")) {
        url = `/projects/${value}`;
      }
      if (decoded.role === "ADMIN") {
        if (key.includes("salary")) {
          url = `/cycles/${value}`;
        } else if (key.includes("voucher")) {
          url = `/vouchers`;
        }
      } else {
        if (key.includes("voucher")) {
          url = `/vouchers`;
        }
      }
      if (!isEmpty(url)) {
        window.location.href = url;
      }
    } catch (error) {
      ToastError({ text: "Lỗi cập nhật thông báo" });
    }
  };

  const NotiToast = () => (
    <div onClick={goToNoti} className="flex gap-2 items-center">
      <div className="text-2xl text-green p-2 rounded-full bg-green/10">
        <AiOutlineBell />
      </div>
      <div className="text-primary font-bold">{props.data.content}</div>
    </div>
  );

  toast(NotiToast, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
};

export default ToastNotification;

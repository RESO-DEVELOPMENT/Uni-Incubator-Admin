import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ToastError = (props) => {
  toast.error(props.text, {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
};

export default ToastError;
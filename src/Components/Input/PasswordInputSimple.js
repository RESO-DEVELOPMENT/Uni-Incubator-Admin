import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const PasswordInputSimple = (props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={`w-full border ${
          props.error ? "border-red-500" : "border-slate-300"
        } py-2 px-5 rounded-lg outline-none text-primary`}
        placeholder={props.placeholder}
      />
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-2 bg-white">
        {props.label}
      </div>
      <div className="absolute text-red-500 text-xs font-bold top-0 -translate-y-1/2 right-4 px-2 bg-white">
        {props.error}
      </div>
      {show ? (
        <div
          className="absolute text-primary cursor-pointer font-bold top-1/2 -translate-y-1/2 right-2 px-2 bg-white"
          onClick={() => setShow(false)}
        >
          <AiFillEye />
        </div>
      ) : (
        <div
          className="absolute text-primary cursor-pointer font-bold top-1/2 -translate-y-1/2 right-2 px-2 bg-white"
          onClick={() => setShow(true)}
        >
          <AiFillEyeInvisible />
        </div>
      )}
    </div>
  );
};

export default PasswordInputSimple;

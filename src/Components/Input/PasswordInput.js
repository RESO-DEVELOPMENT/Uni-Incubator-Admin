import { useState } from 'react';
import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";

const PasswordInput = (props) => {
    const [show , setShow] = useState(false);
    const customClassName = "absolute right-2 color-gray top-1/2 -translate-y-1/2 cursor-pointer";

    return (
      <div className="relative">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray">
          {props.icon}
        </div>
        <input
          id={props.name}
          className="peer w-full h-14 pl-10 pr-4 border border-gray focus:outline-none rounded-md placeholder-transparent"
          type={show ? "text" : "password"}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          placeholder="Enter you text"
          autoComplete='off'
        />
        <label
          className="absolute left-8 top-0 -translate-y-1/2 text-gray cursor-text bg-white px-1 transition-all peer-placeholder-shown:top-1/2 peer-focus:top-0"
          htmlFor={props.name}
        >
          {props.label}
        </label>
        {show ? <BsEyeFill className={customClassName} onClick={() => {setShow(false)}}/> : <BsEyeSlashFill className={customClassName} onClick={() => {setShow(true)}}/>}
        <p className="text-red">{props.error}</p>
      </div>
    );
  };
  
  export default PasswordInput;
  
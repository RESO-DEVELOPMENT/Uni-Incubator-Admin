import { toNumber } from "lodash";
import { MdAddCircleOutline } from "react-icons/md";

const NumberInput = (props) => {
  return (
    <div
      className={`relative border ${
        props.error ? "border-red-500" : "border-slate-300"
      } rounded-lg`}
    >
      <input
        type="text"
        name={props.name}
        value={toNumber(props.value)}
        onChange={props.onChange}
        className={`w-full border-none py-2 outline-none rounded-lg ${
          props.inputTextColor ? props.inputTextColor : "text-primary"
        } ${props.increaseButton ? "pl-5 px-14" : "px-5"} `}
        placeholder={props.placeholder}
      />
      {props.increaseButton && (
        <div
          className="absolute flex items-center justify-center cursor-pointer right-0 top-0 rounded-r-lg h-full w-1/5 font-bold text-green bg-green/40"
          onClick={props.increaseStep}
        >
          <MdAddCircleOutline />
        </div>
      )}
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-2 bg-white">
        {props.label}
      </div>
    </div>
  );
};

export default NumberInput;

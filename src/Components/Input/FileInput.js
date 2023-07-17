import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { last, split } from "lodash";

const FileInput = (props) => {
  return (
    <div
      className={`relative border ${
        props.error ? "border-red-500" : "border-slate-300"
      }  rounded-lg text-sm text-primary`}
    >
      <div className="absolute flex items-center justify-center h-full w-1/6 right-0 top-0 bg-green/30 text-green rounded-r-lg text-2xl">
        <BsFillCloudArrowUpFill />
      </div>
      {!props.value && (
        <div className="absolute text-slate-500 top-1/2 left-5 -translate-y-1/2">
          {props.placeholder}
        </div>
      )}
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-2 bg-white">
        {props.label}
      </div>
      <input
        className="w-full h-full opacity-0 cursor-pointer px-5 py-2"
        type="file"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
      {props.value && (
        <div className="absolute flex items-center gap-2 top-1/2 left-5 -translate-y-1/2">
          <div>{last(split(props.value, "\\"))}</div>
          <div
            className="h-full text-lg cursor-pointer text-red-500"
            onClick={props.removeFile}
          >
            <AiFillCloseCircle />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;

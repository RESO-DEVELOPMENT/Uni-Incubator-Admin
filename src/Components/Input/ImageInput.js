import { BiImageAdd } from "react-icons/bi";

const ImageInput = (props) => {
  return (
    <div className="relative hover:opacity-80">
      <img
        className={props.imageClassName}
        src={props.imageUrl}
        alt="avatar"
        referrerPolicy="no-referrer"
      />
      <div className="absolute right-0 bottom-0 bg-green rounded-sm text-white flex items-center justify-center p-px">
        <BiImageAdd />
      </div>
      <input
        className="absolute w-full h-full left-0 top-0 cursor-pointer opacity-0"
        type="file"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default ImageInput;

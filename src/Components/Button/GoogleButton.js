import { FcGoogle } from "react-icons/fc";

const GoogleButton = (props) => {
  return (
    <button
      className="rounded-md font-bold p-2 px-4 shadow-md hover:shadow-lg duration-150 border border-green w-full bg-transparent text-primary flex items-center gap-2 justify-center"
      onClick={props.onClick}
      type="button"
    >
      <div>
        <FcGoogle className="h-6 w-6" />
      </div>
      <div>{props.text}</div>
    </button>
  );
};

export default GoogleButton;

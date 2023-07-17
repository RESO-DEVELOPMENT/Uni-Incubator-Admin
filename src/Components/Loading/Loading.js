import { ClipLoader } from "react-spinners";

const Loading = (props) => {
  return (
    <div
      className={`flex justify-center items-center ${
        props.fullPage
          ? "fixed z-1000 left-0 top-0 w-screen h-screen bg-black/20"
          : "w-full h-full"
      }`}
    >
      <div className="font-bold text-lg text-green">
        <ClipLoader color="#30BC97" />
      </div>
    </div>
  );
};

export default Loading;

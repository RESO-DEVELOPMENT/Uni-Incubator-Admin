const ButtonIcon = (props) => {
  return (
    <button
      disabled={props.disabled}
      className={`rounded-md font-bold p-2 px-4 shadow-md hover:shadow-lg duration-150 border border-green w-full flex justify-center items-center gap-2 ${
        props.type === "trans"
          ? "bg-transparent text-green"
          : "bg-green text-white"
      }`}
      onClick={props.onClick}
    >
      {props.icon}
      <div>{props.text}</div>
    </button>
  );
};

export default ButtonIcon;

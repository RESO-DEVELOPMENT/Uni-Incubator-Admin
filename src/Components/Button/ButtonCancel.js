const ButtonCancel = (props) => {
    return (
      <button
        className={`rounded-md ${props.font ? props.font : "font-bold"} p-2 px-4 shadow-sm hover:shadow-md duration-150 border border-red-500 w-full ${
          props.type === "trans"
            ? "bg-transparent text-red-500"
            : "bg-red-500 text-white"
        }`}
        onClick={props.onClick}
      >
        {props.text}
      </button>
    );
  };
  
  export default ButtonCancel;
  
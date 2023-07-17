const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      className={`rounded-md ${
        props.font ? props.font : "font-bold"
      } py-2 px-4 shadow-md duration-150 border ${props.disabled ? "border-none" : "border-green hover:shadow-lg"} w-full ${
        props.type === "trans"
          ? `bg-transparent text-green`
          : `${
              props.disabled ? "bg-green/70 text-white" : "bg-green text-white"
            } `
      }`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;

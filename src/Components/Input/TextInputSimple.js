const TextInputSimple = (props) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
        {props.icon}
      </div>
      <input
        type="text"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={`w-full border ${
          props.error ? "border-red-500" : "border-slate-300"
        }  py-2 ${
          props.icon ? "pl-9 pr-5" : "px-5"
        } rounded-lg outline-none bg-transparent ${
          props.inputTextColor ? props.inputTextColor : "text-primary"
        }`}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-2 bg-white">
        {props.label}
      </div>
      <div className="absolute text-red-500 text-xs font-bold top-0 -translate-y-1/2 right-4 px-2 bg-white">
        {props.error && props.error}
      </div>
    </div>
  );
};

export default TextInputSimple;

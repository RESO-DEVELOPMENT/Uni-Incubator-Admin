const TextInput = (props) => {
  return (
    <div className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray">
        {props.icon}
      </div>
      <input
        id={props.name}
        className="peer w-full h-14 pl-10 pr-4 border border-gray focus:outline-none rounded-md placeholder-transparent"
        type="text"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder="Enter you text"
      />
      <label
        className="absolute left-8 top-0 -translate-y-1/2 text-gray cursor-text bg-white px-1 transition-all peer-placeholder-shown:top-1/2 peer-focus:top-0"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <p className="text-red">{props.error}</p>
    </div>
  );
};

export default TextInput;

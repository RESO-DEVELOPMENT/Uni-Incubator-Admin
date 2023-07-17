const TextAreaSimple = (props) => {
  return (
    <div className="relative">
      <textarea
        className={`w-full outline-none border ${
          props.error ? "border-red-500" : "border-slate-300"
        }  rounded-lg px-5 py-2 text-primary resize-none`}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        rows={props.rows}
        col={props.cols}
        onChange={props.onChange}
      ></textarea>
      <div className="absolute text-red-500 text-xs font-bold top-0 -translate-y-1/2 right-4 px-2 bg-white">
        {props.error && props.error}
      </div>
    </div>
  );
};

export default TextAreaSimple;

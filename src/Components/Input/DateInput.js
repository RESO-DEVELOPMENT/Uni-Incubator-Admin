import Datepicker from "react-tailwindcss-datepicker";

const DateInput = (props) => {
  return (
    <div className="relative">
      <Datepicker
        value={props.value}
        onChange={props.onChange}
        primaryColor={"emerald"}
        useRange={props.useRange}
        asSingle={props.asSingle}
        displayFormat={props.displayFormat}
        showFooter={props.showFooter}
        inputClassName={`font-bold bg-white text-primary border ${
          props.error ? "border-red-500" : "border-slate-300"
        }  outline-none`}
        minDate={props.minDate}
        disabled={props.disabled}
      />
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-3 bg-white">
        {props.placeholder}
      </div>
      <div className="absolute text-red-500 text-xs font-bold top-0 -translate-y-1/2 right-4 px-2 bg-white">
        {props.error}
      </div>
    </div>
  );
};

export default DateInput;

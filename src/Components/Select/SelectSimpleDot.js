import Select from "react-select";

const SelectSimpleDot = (props) => {
  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const customStyle = {
    control: (styles) => ({
      ...styles,
      padding: "0.2rem 0",
      borderRadius: "0.5rem",
      boxShadow: "none",
      border: "none",
    }),
    option: (styles, { data, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? data.color
          : isFocused
          ? "#f1f5f9"
          : "white",
        color: isSelected ? "white" : data.color,
        cursor: "pointer",
      };
    },
    menu: (styles) => {
      return {
        ...styles,
        zIndex: 1000,
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  return (
    <div className="relative">
      <Select
        className={`border ${
          props.error ? "border-red-500" : "border-slate-300"
        } rounded-lg`}
        classNamePrefix="select"
        isLoading={false}
        isClearable={true}
        isSearchable={true}
        name="status"
        options={props.options}
        defaultValue={props.defaultValue}
        styles={customStyle}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-2 bg-white">
        {props.label}
      </div>
      <div className="absolute text-red-500 text-xs font-bold top-0 -translate-y-1/2 right-4 px-2 bg-white">
        {props.error}
      </div>
    </div>
  );
};

export default SelectSimpleDot;

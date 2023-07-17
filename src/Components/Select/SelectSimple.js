import Select from "react-select";

const SelectSimple = (props) => {
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
          ? "#30BC97"
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
  };

  return (
    <div className="relative">
      <Select
        className="border border-slate-300 rounded-lg"
        classNamePrefix="select"
        isLoading={false}
        isClearable={props.isClearable ? props.isClearable : false}
        isSearchable={true}
        name="status"
        options={props.options}
        onChange={props.onChange}
        placeholder={props.placeholder}
        defaultValue={
          props.defaultValue ? props.defaultValue : props.options[0]
        }
        styles={customStyle}
        isDisabled={props.isDisabled}
      />
      <div className="absolute text-primary text-xs font-bold top-0 -translate-y-1/2 left-4 px-2 bg-white">
        {props.label}
      </div>
    </div>
  );
};

export default SelectSimple;

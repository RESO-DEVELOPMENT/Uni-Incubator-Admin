import { BsSearch } from "react-icons/bs";

const SearchInput = (props) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700">
        <BsSearch />
      </div>
      <input
        id={props.name}
        className="peer w-full h-12 pl-10 pr-36 shadow-md focus:outline-none select-none rounded-md placeholder-transparent text-gray"
        type="text"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder="."
        autoComplete="off"
      />
      <label
        className="absolute left-8 top-0 -translate-y-1/2 cursor-text select-none rounded-sm text-gray-700 px-1 transition-all peer-placeholder-shown:top-1/2 peer-focus:top-0"
        htmlFor={props.name}
      >
        {props.label}
      </label>
    </div>
  );
};

export default SearchInput;

import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function PhoneNumberInput({ selected }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState("");

  const inputRef = useRef(null);

  const handleChange = (value) => {
    setValue("+" + value);
  };

  useEffect(() => {
    if (selected.phone) setValue("+" + selected.phone) + " ";
    else setValue("");
  }, [selected]);

  return (
    <div className="relative h-[3rem] z-0">
      <input
        ref={inputRef}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        className={`h-full w-full border-[1px] duration-400 outline-none rounded-lg px-3 ${
          isFocused ? "border-[#8675DC]" : "border-[#282828]"
        }`}
      />
      <p
        className={`absolute pointer-events-none transition-all duration-400 ml-2 px-1 bg-[#202021] ${
          isFocused || value ? "text-xs -top-[20%]" : "top-1/2 -translate-y-1/2"
        } ${isFocused ? "text-[#8675DC]" : "text-[#8c8c8c]"}`}
      >
        Phone Number
      </p>
    </div>
  );
}
PhoneNumberInput.propTypes = {
  selected: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};

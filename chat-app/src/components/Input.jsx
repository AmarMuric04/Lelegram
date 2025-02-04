import { useState } from "react";
import PropTypes from "prop-types";

export default function Input({
  children,
  inputValue,
  inputClass,
  textClass,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative h-[3.5rem] z-0">
      <input
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="text"
        className={`h-full w-full border-[2px] duration-400 outline-none rounded-xl px-5 ${
          isFocused ? "border-[#8675DC]" : "border-[#282828]"
        } ${inputClass && inputClass}`}
      />
      <p
        className={`absolute pointer-events-none transition-all duration-400 ml-2 px-1 bg-[#202021] ${
          isFocused || inputValue
            ? "text-xs -top-[20%]"
            : "top-1/2 -translate-y-1/2"
        } ${isFocused ? "text-[#8675DC]" : "text-[#8c8c8c]"} ${
          textClass && textClass
        }`}
      >
        {children}
      </p>
    </div>
  );
}

Input.propTypes = {
  inputValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  inputClass: PropTypes.string,
  textClass: PropTypes.string,
};

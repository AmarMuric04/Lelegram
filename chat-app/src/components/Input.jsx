import { useState } from "react";
import PropTypes from "prop-types";

export default function Input({
  children,
  inputValue,
  inputClass,
  textClass,
  error,
  setError,
  name,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  let hasError = error?.data?.find((err) => err.path === name);

  const handleFocus = () => {
    setIsFocused(true);
    if (hasError) {
      setError((prevErrors) => ({
        ...prevErrors,
        data: prevErrors.data.filter((err) => err.path !== name),
      }));
    }
  };
  return (
    <div className="relative h-[3.5rem] z-0 mt-4 w-full">
      <input
        {...props}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        type="text"
        className={`h-full w-full border-[2px] duration-400 outline-none rounded-xl px-5 ${
          isFocused ? "border-[#8675DC]" : "border-[#282828]"
        } ${inputClass && inputClass} ${hasError && "border-red-500"}`}
      />
      <p
        className={`absolute pointer-events-none transition-all duration-400 ml-2 px-1  ${
          isFocused || inputValue
            ? "text-xs -top-[20%]"
            : "top-1/2 -translate-y-1/2"
        } ${isFocused ? "text-[#8675DC]" : "text-[#8c8c8c]"} ${
          textClass && textClass
        } ${hasError && "text-red-500"}`}
      >
        {children}
      </p>
      {hasError && (
        <div className="text-xs text-red-500 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
            />
          </svg>
          <p>{hasError.msg ? hasError.msg : error.message}</p>
        </div>
      )}
    </div>
  );
}

Input.propTypes = {
  inputValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  inputClass: PropTypes.string,
  textClass: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.object,
  setError: PropTypes.func,
};

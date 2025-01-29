import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPhoneNumber } from "../store/authSlice";
export default function PhoneNumberInput() {
  const [isFocused, setIsFocused] = useState("");
  const dispatch = useDispatch();

  const { selected, phoneNumber } = useSelector((state) => state.auth);

  const inputRef = useRef(null);

  const handleChange = (value) => {
    const newValue = "+" + value.replace(/\D/g, "");
    dispatch(setPhoneNumber(newValue));
  };

  useEffect(() => {
    if (selected.phone) dispatch(setPhoneNumber("+" + selected.phone + " "));
    else dispatch(setPhoneNumber(""));
  }, [selected, dispatch]);

  return (
    <div className="relative h-[3.5rem] z-0">
      <input
        ref={inputRef}
        value={phoneNumber}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        className={`h-full w-full border-[2px] duration-400 outline-none rounded-xl px-5 ${
          isFocused ? "border-[#8675DC]" : "border-[#282828]"
        }`}
      />
      <p
        className={`absolute pointer-events-none transition-all duration-400 ml-2 px-1 bg-[#202021] ${
          isFocused || phoneNumber
            ? "text-xs -top-[20%]"
            : "top-1/2 -translate-y-1/2"
        } ${isFocused ? "text-[#8675DC]" : "text-[#8c8c8c]"}`}
      >
        Phone Number
      </p>
    </div>
  );
}

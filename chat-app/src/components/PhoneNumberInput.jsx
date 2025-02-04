import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPhoneNumber } from "../store/authSlice";
import Input from "./Input";

export default function PhoneNumberInput() {
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
    <Input
      inputValue={phoneNumber}
      onChange={(e) => handleChange(e.target.value)}
      ref={inputRef}
      value={phoneNumber}
      type="text"
    >
      Phone Number
    </Input>
  );
}

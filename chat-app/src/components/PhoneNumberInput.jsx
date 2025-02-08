import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPhoneNumber } from "../store/authSlice";
import PropTypes from "prop-types";
import Input from "./Input";

export default function PhoneNumberInput({ error, setError }) {
  const dispatch = useDispatch();
  const { selected, phoneNumber } = useSelector((state) => state.auth);

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
      setError={setError}
      error={error}
      inputValue={phoneNumber}
      onChange={(e) => handleChange(e.target.value)}
      value={phoneNumber}
      type="text"
      autoComplete="new-password"
      name="not-a-phone"
      inputMode="text"
    >
      Phone Number
    </Input>
  );
}

PhoneNumberInput.propTypes = {
  error: PropTypes.object,
  setError: PropTypes.func,
};

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCountryName, setPhoneNumber } from "../../store/redux/authSlice";
import PropTypes from "prop-types";
import Input from "../misc/Input";
import { countries } from "../../assets/countryCodes";

export default function PhoneNumberInput({ error, setError }) {
  const dispatch = useDispatch();
  const { countryCode, phoneNumber } = useSelector((state) => state.auth);

  const handleChange = (value) => {
    const newValue = "+" + value.replace(/\D/g, "");
    dispatch(setPhoneNumber(newValue));
  };

  const phoneWithoutPlus = phoneNumber.replace("+", "");
  const isValidCountryCode = countries.find((country) =>
    country.phone.startsWith(phoneWithoutPlus)
  );

  if (phoneWithoutPlus && isValidCountryCode) {
    dispatch(setCountryName(isValidCountryCode.label));
  }

  useEffect(() => {
    if (countryCode) dispatch(setPhoneNumber("+" + countryCode + " "));
    else dispatch(setPhoneNumber(""));
  }, [countryCode, dispatch]);

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
      textClass="bg-[#202021]"
    >
      Phone Number
    </Input>
  );
}

PhoneNumberInput.propTypes = {
  error: PropTypes.object,
  setError: PropTypes.func,
};

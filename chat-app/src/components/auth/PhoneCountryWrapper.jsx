import CountryInput from "./CountryInput";
import PhoneNumberInput from "./PhoneNumberInput";
import PropTypes from "prop-types";

export default function PhoneCountryWrapper({ error, setError }) {
  return (
    <div className="flex gap-4 my-4 flex-col w-full">
      <div className="w-full">
        <CountryInput />
      </div>
      <div className="w-full">
        <PhoneNumberInput error={error} setError={setError} />
      </div>
    </div>
  );
}
PhoneCountryWrapper.propTypes = {
  error: PropTypes.object,
  setError: PropTypes.func,
};

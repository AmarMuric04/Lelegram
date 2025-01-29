import CountryInput from "./CountryInput";
import PhoneNumberInput from "./PhoneNumberInput";

export default function PhoneCountryWrapper() {
  return (
    <div className="flex gap-4 my-4 flex-col w-full">
      <div className="w-full">
        <CountryInput />
      </div>
      <div className="w-full">
        <PhoneNumberInput />
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { countries } from "../assets/countryCodes";

export default function CountryInput({ setSelected }) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const inputRef = useRef(null);

  const handleFilterCountries = (value) => {
    const filtered = countries.filter((country) =>
      country.label.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length === 0) {
      setFilteredCountries(countries);
      return;
    }
    setFilteredCountries(filtered);
  };

  const handleChange = (value) => {
    setValue(value);
    setSelected({});
  };

  const handleCountrySelect = (country) => {
    setSelected(country);
    setValue(country.label);
  };

  return (
    <div className="relative h-[3rem]">
      <input
        ref={inputRef}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          handleChange(e.target.value);
          handleFilterCountries(e.target.value);
        }}
        type="text"
        className={`h-full w-full border-[1px] duration-400 outline-none rounded-lg px-3 ${
          isFocused ? "border-[#8675DC]" : "border-[#282828]"
        }`}
      />
      <svg
        onClick={() => {
          inputRef.current.focus();
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`absolute top-1/2 transition-all duration-400 -translate-y-1/2 right-3 cursor-pointer ${
          isFocused ? "rotate-180 text-[#8675dc]" : "text-[#8c8c8c]"
        }`}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m6 9l6 6l6-6"
        />
      </svg>
      <p
        className={`absolute pointer-events-none transition-all duration-400 ml-2 px-1 bg-[#202021] ${
          isFocused ? "text-[#8675DC]" : "text-[#8c8c8c]"
        } ${
          value || isFocused ? "text-xs -top-[20%]" : "top-1/2 -translate-y-1/2"
        }`}
      >
        Country
      </p>
      <ul
        className={`absolute top-[110%] w-full rounded-lg bg-[#202021] shadow-lg py-4 max-h-[20rem] overflow-auto transition-all duration-100 ${
          isFocused
            ? "opacity-100 pointer-events-auto z-50"
            : "opacity-0 scale-90 pointer-events-none z-0"
        }`}
      >
        {filteredCountries.map((option) => (
          <li
            key={option.code}
            onClick={() => {
              handleCountrySelect(option);
              console.log(option);
            }}
            className="p-2 hover:bg-[#242424] transition-all cursor-pointer"
          >
            <div className="flex w-full items-center justify-between py-2">
              <div className="flex items-center gap-2 w-full">
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt=""
                />
                <span className="max-w-1/2 truncate overflow-hidden whitespace-nowrap">
                  {option.label}
                </span>
                <p>({option.code})</p>
              </div>
              <p className="text-gray-400 text-sm italic">+{option.phone}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

CountryInput.propTypes = {
  selected: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};

import { useState } from "react";
import PropTypes from "prop-types";
import Image from "../../assets/mnky.png";
import { useSelector } from "react-redux";
import Input from "../Input";

export default function CodeAuth({ setActivePage }) {
  const [code, setCode] = useState("");
  const { phoneNumber } = useSelector((state) => state.auth);

  const handleChange = (value) => {
    setCode(value);
  };

  return (
    <div className="min-w-[500px] flex justify-center mt-28 h-screen">
      <div className="flex flex-col items-center w-[360px] text-center">
        <img src={Image} alt="monkey" className="w-[160px]" />
        <div className="text-3xl font-semibold flex items-center gap-2">
          <p>{phoneNumber}</p>
          <svg
            onClick={() => setActivePage("landing")}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="text-[#8c8c8c] hover:text-white transition-all cursor-pointer"
          >
            <path
              fill="currentColor"
              d="m14.06 9.02l.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"
            />
          </svg>
        </div>
        <p className="text-gray-400 w-[70%] mt-4 text-center">
          We have sent a message <br /> with the code.
        </p>
        <div className="flex gap-4 my-4 flex-col w-full">
          <Input
            inputValue={code}
            onChange={(e) => handleChange(e.target.value)}
            type="text"
          >
            Code
          </Input>
        </div>
      </div>
    </div>
  );
}

CodeAuth.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
